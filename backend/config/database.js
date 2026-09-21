import {Sequelize} from 'sequelize'
import 'dotenv/config'

const sslEnabled=process.env.DB_SSL==='true'
const ssl=sslEnabled?{require:true,rejectUnauthorized:process.env.DB_SSL_REJECT_UNAUTHORIZED!=='false',...(process.env.DB_SSL_CA?{ca:process.env.DB_SSL_CA.replace(/\\n/g,'\n')}:{})}:undefined
const options={
  dialect:'mysql',logging:process.env.DB_LOGGING==='true'?console.log:false,
  dialectOptions:ssl?{ssl}:undefined,
  pool:{max:Number(process.env.DB_POOL_MAX||10),min:Number(process.env.DB_POOL_MIN||0),acquire:30000,idle:10000},
  define:{underscored:true,timestamps:true},retry:{max:3}
}

export const sequelize=process.env.DATABASE_URL
  ?new Sequelize(process.env.DATABASE_URL,options)
  :new Sequelize(process.env.DB_NAME||'helmi_travel',process.env.DB_USER||'root',process.env.DB_PASSWORD||'',{...options,host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||3306)})
