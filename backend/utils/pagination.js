const positive=(value,fallback,max)=>{const number=Number.parseInt(value,10);return Number.isFinite(number)&&number>0?Math.min(number,max):fallback}

export function paginate(rows,query={}){
  if(query.page===undefined&&query.limit===undefined)return rows
  const page=positive(query.page,1,100000)
  const limit=positive(query.limit,12,100)
  const total=rows.length
  const pages=Math.max(1,Math.ceil(total/limit))
  const current=Math.min(page,pages)
  const offset=(current-1)*limit
  return {items:rows.slice(offset,offset+limit),pagination:{page:current,limit,total,pages,hasNext:current<pages,hasPrevious:current>1}}
}
