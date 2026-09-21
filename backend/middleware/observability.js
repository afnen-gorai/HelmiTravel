const redact=(key,value)=>/password|token|secret|authorization|cookie/i.test(key)?'[REDACTED]':value

export function log(level,event,data={}){
  const entry={timestamp:new Date().toISOString(),level,event,...data}
  const line=JSON.stringify(entry,redact)
  ;(level==='error'?console.error:level==='warn'?console.warn:console.log)(line)
}

export function requestLogger(req,res,next){
  const started=performance.now()
  res.on('finish',()=>log(res.statusCode>=500?'error':res.statusCode>=400?'warn':'info','http_request',{
    request_id:req.id,method:req.method,path:req.originalUrl.split('?')[0],status:res.statusCode,
    duration_ms:Math.round(performance.now()-started),ip:req.ip,user_id:req.user?.id
  }))
  next()
}

export function runtimeMetrics(req,res){
  const memory=process.memoryUsage()
  res.json({status:'ok',uptime_seconds:Math.floor(process.uptime()),memory:{rss_bytes:memory.rss,heap_used_bytes:memory.heapUsed},timestamp:new Date().toISOString()})
}
