const base=(process.env.SMOKE_API_URL||'http://localhost:5000/api').replace(/\/$/,'')
const checks=[['liveness','/health/live'],['database readiness','/health'],['destinations','/destinations'],['hotels','/hotels'],['trips','/trips']]
let failed=0
for(const [name,path] of checks){
  const started=performance.now()
  try{const response=await fetch(`${base}${path}`,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);console.log(`PASS ${name} ${Math.round(performance.now()-started)}ms`)}
  catch(error){failed++;console.error(`FAIL ${name}: ${error.message}`)}
}
if(failed)process.exit(1)
