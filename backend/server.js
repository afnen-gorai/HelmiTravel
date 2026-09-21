import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {rateLimit} from 'express-rate-limit'
import crypto from 'crypto'
import 'dotenv/config'
import {sequelize} from './config/database.js'
import {uploadsDirectory} from './config/paths.js'
import authRoutes from './routes/authRoutes.js'
import destinationRoutes from './routes/destinationRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import userRoutes from './routes/userRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import marketingRoutes from './routes/marketingRoutes.js'
import carRoutes from './routes/carRoutes.js'
import flightRoutes from './routes/flightRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import {stripe as stripeWebhook} from './controllers/gatewayController.js'
import {sanitize,validatePayload} from './middleware/validation.js'
import {notFound,errorHandler} from './middleware/error.js'
import {auditAdmin} from './middleware/audit.js'
import {auth,permit} from './middleware/auth.js'
import {log,requestLogger,runtimeMetrics} from './middleware/observability.js'
const app=express()
const allowedOrigins=new Set([...(process.env.CORS_ORIGINS||process.env.FRONTEND_URL||'http://localhost:5173').split(',').map(value=>value.trim()).filter(Boolean),...(process.env.NODE_ENV==='production'?[]:['http://localhost:5173','http://localhost:5174'])])
const trustProxy=process.env.TRUST_PROXY
if(trustProxy==='true')app.set('trust proxy',1)
else if(/^\d+$/.test(trustProxy||''))app.set('trust proxy',Number(trustProxy))
app.disable('x-powered-by')
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}))
app.use(cors({origin(origin,callback){if(!origin||allowedOrigins.has(origin))return callback(null,true);callback(new Error('Origine non autorisée par CORS'))},methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],allowedHeaders:['Authorization','Content-Type','X-Request-Id'],maxAge:600}))
app.post('/api/webhooks/stripe',express.raw({type:'application/json',limit:'200kb'}),stripeWebhook)
app.use(express.json({limit:'200kb'}));app.use(express.urlencoded({extended:false,limit:'200kb'}));app.use(sanitize);app.use(validatePayload)
app.use((req,res,next)=>{const supplied=String(req.get('x-request-id')||'');req.id=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(supplied)?supplied:crypto.randomUUID();res.set('X-Request-Id',req.id);next()})
app.use(requestLogger)
app.use((req,res,next)=>{if(req.headers.authorization)return res.set('Cache-Control','private, no-store').vary('Authorization')&&next();const cacheable=['/api/home','/api/destinations','/api/hotels','/api/trips','/api/cars','/api/car-categories','/api/flights','/api/promotions'];if(req.method==='GET'&&cacheable.some(prefix=>req.path===prefix||req.path.startsWith(`${prefix}/`)))res.set('Cache-Control','public, max-age=60, stale-while-revalidate=300');next()})
app.use('/uploads',express.static(uploadsDirectory,{maxAge:'7d',immutable:true,dotfiles:'deny',fallthrough:false,index:false,setHeaders:res=>res.set('X-Content-Type-Options','nosn')}))
app.use('/api',rateLimit({windowMs:15*60*1000,limit:500,standardHeaders:'draft-7',legacyHeaders:false}))
app.use('/api',auditAdmin)
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:40,standardHeaders:'draft-7',legacyHeaders:false,message:{message:'Trop de tentatives, réessayez dans 15 minutes.'}}))
app.use('/api/auth',authRoutes)
app.use('/api/destinations',destinationRoutes)
app.use('/api/hotels',hotelRoutes)
app.use('/api/rooms',roomRoutes)
app.use('/api/trips',tripRoutes)
app.use('/api/users',userRoutes)
app.use('/api',bookingRoutes)
app.use('/api',paymentRoutes)
app.use('/api',adminRoutes)
app.use('/api',marketingRoutes)
app.use('/api',carRoutes)
app.use('/api',flightRoutes)
app.use('/api',orderRoutes)
app.get('/api/health',async(req,res)=>{try{await sequelize.query('SELECT 1');res.json({status:'ok',service:'Helmi Travel API',database:'connected',timestamp:new Date().toISOString()})}catch{res.status(503).json({status:'unavailable',service:'Helmi Travel API',database:'disconnected'})}})
app.get('/api/health/live',(req,res)=>res.json({status:'ok'}))
app.get('/api/health/metrics',auth,permit('admin'),runtimeMetrics)
app.use(notFound);app.use(errorHandler)
const port=process.env.PORT||5000
function validateProductionConfig(){
  if(process.env.NODE_ENV!=='production')return
  const forbidden=['change_this_secret_in_production','change_this_refresh_secret_in_production']
  for(const key of ['JWT_SECRET','JWT_REFRESH_SECRET'])if(!process.env[key]||process.env[key].length<32||forbidden.includes(process.env[key]))throw new Error(`${key} doit contenir au moins 32 caractères aléatoires en production`)
  if(!process.env.FRONTEND_URL?.startsWith('https://'))throw new Error('FRONTEND_URL doit utiliser HTTPS en production')
  if(!process.env.DATABASE_URL&&!['DB_HOST','DB_NAME','DB_USER','DB_PASSWORD'].every(key=>process.env[key]))throw new Error('DATABASE_URL ou toutes les variables DB_* sont obligatoires en production')
  if(process.env.DB_SSL!=='true')console.warn('Attention : DB_SSL devrait être activé pour une base MySQL distante')
}
try{validateProductionConfig()}catch(error){console.error('Configuration de sécurité invalide :',error.message);process.exit(1)}
let server
async function start(){try{await sequelize.authenticate();log('info','database_connected');server=app.listen(port,()=>log('info','server_started',{port}))}catch(error){log('error','startup_failed',{message:error.message});process.exit(1)}}
async function shutdown(signal){console.log(`${signal} reçu, arrêt en cours…`);const force=setTimeout(()=>process.exit(1),25000);force.unref();if(server)await new Promise(resolve=>server.close(resolve));await sequelize.close();process.exit(0)}
process.once('SIGTERM',()=>shutdown('SIGTERM'));process.once('SIGINT',()=>shutdown('SIGINT'))
process.on('unhandledRejection',error=>log('error','unhandled_rejection',{message:error?.message||String(error)}))
process.on('uncaughtException',error=>{log('error','uncaught_exception',{message:error.message});shutdown('uncaughtException')})
start()
