import React from 'react'

export default function Chart({type,data}){
  const labels=Array.isArray(data?.labels)?data.labels:[]
  const values=Array.isArray(data?.datasets?.[0]?.data)?data.datasets[0].data.map(value=>Number(value)||0):[]
  const max=Math.max(...values,1)

  if(type==='doughnut'){
    const total=values.reduce((sum,value)=>sum+value,0)
    return <div className="simple-chart simple-chart-doughnut">{labels.map((label,index)=><div key={`${label}-${index}`}><span style={{'--chart-color':['#0b3154','#d8ad5f','#4f829b','#8d6b40'][index%4]}}/><b>{label}</b><strong>{values[index]||0}{total?` (${Math.round((values[index]||0)*100/total)} %)`:''}</strong></div>)}</div>
  }

  return <div className={`simple-chart simple-chart-${type||'bar'}`}>{labels.map((label,index)=><div className="simple-chart-column" key={`${label}-${index}`}><strong>{values[index]||0}</strong><span><i style={{height:`${Math.max(2,(values[index]||0)*100/max)}%`}}/></span><small>{label}</small></div>)}</div>
}
