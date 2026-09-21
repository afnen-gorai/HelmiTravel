import {User} from '../models/index.js'
import {verifyAccess} from '../utils/tokens.js'
export const auth=async(req,res,next)=>{try{const match=String(req.headers.authorization||'').match(/^Bearer\s+(.+)$/i);if(!match)return res.status(401).json({message:'Authentification requise'});const payload=verifyAccess(match[1]),user=await User.findByPk(Number(payload.sub),{attributes:['id','role','email_verifie']});if(!user||!user.email_verifie)return res.status(401).json({message:'Compte indisponible'});req.user={id:user.id,role:user.role};next()}catch{return res.status(401).json({message:'Session invalide ou expirée'})}}
export const permit=(...roles)=>(req,res,next)=>req.user&&roles.includes(req.user.role)?next():res.status(403).json({message:'Accès non autorisé'})
