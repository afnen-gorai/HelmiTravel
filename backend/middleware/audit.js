import {AuditLog} from '../models/index.js'

export function auditAdmin(req,res,next){
  if(!['POST','PUT','PATCH','DELETE'].includes(req.method))return next()
  const started=Date.now()
  res.on('finish',()=>{
    if(!req.user||!['admin','agent'].includes(req.user.role))return
    AuditLog.create({
      userId:req.user.id,request_id:req.id,
      action:`${req.method} ${req.route?.path||req.path}`.slice(0,255),
      method:req.method,path:req.path.slice(0,255),status:res.statusCode,
      duration_ms:Date.now()-started,ip:String(req.ip||'').slice(0,45),
      user_agent:String(req.get('user-agent')||'').slice(0,255),metadata:{params:req.params}
    }).catch(error=>console.error('Journalisation Admin impossible :',error.message))
  })
  next()
}
