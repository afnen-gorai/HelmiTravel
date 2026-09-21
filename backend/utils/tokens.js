import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import {AuthToken} from '../models/index.js'

export const hashToken=token=>crypto.createHash('sha256').update(token).digest('hex')
const jwtOptions={algorithm:'HS256',issuer:'helmi-travel-api',audience:'helmi-travel-web'}
export const accessToken=user=>jwt.sign({sub:String(user.id),role:user.role},process.env.JWT_SECRET,{...jwtOptions,expiresIn:process.env.ACCESS_TOKEN_TTL||'15m'})
export async function issueToken(user,type,req){if(type!=='refresh')await AuthToken.update({revoked_at:new Date()},{where:{userId:user.id,type,revoked_at:null}});const raw=type==='refresh'?jwt.sign({sub:String(user.id),type,jti:crypto.randomUUID()},process.env.JWT_REFRESH_SECRET||process.env.JWT_SECRET,{...jwtOptions,expiresIn:`${process.env.REFRESH_TOKEN_DAYS||7}d`}):crypto.randomBytes(32).toString('hex');const days=type==='refresh'?Number(process.env.REFRESH_TOKEN_DAYS||7):1;await AuthToken.create({userId:user.id,token_hash:hashToken(raw),type,expires_at:new Date(Date.now()+days*86400000),ip:req.ip,user_agent:String(req.get('user-agent')||'').slice(0,255)});return raw}
export const verifyAccess=token=>jwt.verify(token,process.env.JWT_SECRET,{...jwtOptions,algorithms:['HS256']})
export const verifyRefresh=token=>jwt.verify(token,process.env.JWT_REFRESH_SECRET||process.env.JWT_SECRET,{...jwtOptions,algorithms:['HS256']})
export const findToken=(raw,type)=>typeof raw==='string'&&raw.length>=32?AuthToken.findOne({where:{token_hash:hashToken(raw),type,revoked_at:null}}):null
