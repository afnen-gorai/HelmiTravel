import axios from 'axios'

export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',timeout:10000})
export const apiOrigin=api.defaults.baseURL.replace(/\/api\/?$/,'')
export const assetUrl=path=>path?.startsWith('http')?path:`${apiOrigin}${path?.startsWith('/')?'':'/'}${path||''}`

api.interceptors.request.use(config=>{
  const token=localStorage.getItem('helmi_token')
  if(token) config.headers.Authorization=`Bearer ${token}`
  return config
})

let refreshRequest=null
api.interceptors.response.use(response=>response,async error=>{
  const original=error.config
  const refreshToken=localStorage.getItem('helmi_refresh_token')
  if(error.response?.status===401&&refreshToken&&!original?._retry&&!original?.url?.includes('/auth/refresh')){
    original._retry=true
    try{refreshRequest??=axios.post(`${api.defaults.baseURL}/auth/refresh`,{refreshToken}).finally(()=>{refreshRequest=null});const {data}=await refreshRequest;localStorage.setItem('helmi_token',data.token);localStorage.setItem('helmi_refresh_token',data.refreshToken);original.headers.Authorization=`Bearer ${data.token}`;return api(original)}catch{localStorage.removeItem('helmi_token');localStorage.removeItem('helmi_refresh_token');localStorage.removeItem('helmi_user')}
  }
  return Promise.reject(error)
})

export const authApi={register:data=>api.post('/auth/register',data).then(r=>r.data),login:credentials=>api.post('/auth/login',credentials).then(r=>r.data),refresh:refreshToken=>api.post('/auth/refresh',{refreshToken}).then(r=>r.data),logout:refreshToken=>api.post('/auth/logout',{refreshToken}),forgot:email=>api.post('/auth/forgot-password',{email}).then(r=>r.data),reset:data=>api.post('/auth/reset-password',data).then(r=>r.data),verify:token=>api.post('/auth/verify-email',{token}).then(r=>r.data),resendVerification:email=>api.post('/auth/resend-verification',{email}).then(r=>r.data),changePassword:data=>api.put('/auth/change-password',data).then(r=>r.data)}
export const userApi={profile:()=>api.get('/users/me').then(r=>r.data),update:data=>api.put('/users/me',data).then(r=>r.data),photo:file=>{const data=new FormData();data.append('photo',file);return api.post('/users/me/photo',data,{headers:{'Content-Type':'multipart/form-data'}}).then(r=>r.data)},favorites:()=>api.get('/users/me/favorites').then(r=>r.data),addFavorite:(type,item_id)=>api.post('/users/me/favorites',{type,item_id}).then(r=>r.data),removeFavorite:id=>api.delete(`/users/me/favorites/${id}`),reviews:()=>api.get('/users/me/reviews').then(r=>r.data)}
export const catalogApi={destinations:params=>api.get('/destinations',{params}).then(r=>r.data),destination:id=>api.get(`/destinations/${id}`).then(r=>r.data),hotels:params=>api.get('/hotels',{params}).then(r=>r.data),trips:params=>api.get('/trips',{params}).then(r=>r.data)}
export const homeApi={content:()=>api.get('/home').then(r=>r.data),newsletter:email=>api.post('/newsletter',{email}).then(r=>r.data)}
export const adminApi={dashboard:()=>api.get('/dashboard').then(r=>r.data)}
export const settingsApi={list:()=>api.get('/admin/settings').then(r=>r.data),create:data=>api.post('/admin/settings',data).then(r=>r.data),update:(id,data)=>api.put(`/admin/settings/${id}`,data).then(r=>r.data),remove:id=>api.delete(`/admin/settings/${id}`)}
export const crudApi={
  destinations:{list:params=>api.get('/destinations',{params}).then(r=>r.data),create:data=>api.post('/destinations',data).then(r=>r.data),update:(id,data)=>api.put(`/destinations/${id}`,data).then(r=>r.data),remove:id=>api.delete(`/destinations/${id}`)},
  hotels:{list:()=>api.get('/hotels').then(r=>r.data),create:data=>api.post('/hotels',data).then(r=>r.data),update:(id,data)=>api.put(`/hotels/${id}`,data).then(r=>r.data),remove:id=>api.delete(`/hotels/${id}`)},
  rooms:{list:()=>api.get('/rooms').then(r=>r.data),create:data=>api.post('/rooms',data).then(r=>r.data),update:(id,data)=>api.put(`/rooms/${id}`,data).then(r=>r.data),remove:id=>api.delete(`/rooms/${id}`)},
  trips:{list:()=>api.get('/trips').then(r=>r.data),create:data=>api.post('/trips',data).then(r=>r.data),update:(id,data)=>api.put(`/trips/${id}`,data).then(r=>r.data),remove:id=>api.delete(`/trips/${id}`)}
}
export const detailApi={hotel:(id,params)=>api.get(`/hotels/${id}`,{params}).then(r=>r.data),trip:id=>api.get(`/trips/${id}`).then(r=>r.data),tripProgram:id=>download(`/trips/${id}/programme.pdf`,`programme-voyage-${id}.pdf`)}
export const bookingApi={create:payload=>api.post('/bookings',payload).then(r=>r.data),mine:()=>api.get('/bookings/me').then(r=>r.data)}
const download=async(url,filename)=>{const response=await api.get(url,{responseType:'blob'});const href=URL.createObjectURL(response.data);const link=document.createElement('a');link.href=href;link.download=filename;link.click();URL.revokeObjectURL(href)}
export const financeApi={mine:()=>api.get('/payments/me').then(r=>r.data),pay:(booking_id,method)=>api.post('/payment',{booking_id,method}).then(r=>r.data),confirmation:id=>download(`/bookings/${id}/confirmation.pdf`,`confirmation-HT-${String(id).padStart(5,'0')}.pdf`),invoice:invoice=>download(`/invoices/${invoice.id}/pdf`,`facture-${invoice.numero}.pdf`)}
export const carApi={categories:()=>api.get('/car-categories').then(r=>r.data),list:params=>api.get('/cars',{params}).then(r=>r.data),get:id=>api.get(`/cars/${id}`).then(r=>r.data),book:data=>api.post('/car-bookings',data).then(r=>r.data),mine:()=>api.get('/car-bookings/me').then(r=>r.data),contract:id=>download(`/car-bookings/${id}/contract.pdf`,`contrat-location-${id}.pdf`),adminCars:()=>api.get('/admin/cars').then(r=>r.data),adminBookings:()=>api.get('/admin/car-bookings').then(r=>r.data),createCategory:data=>api.post('/admin/car-categories',data).then(r=>r.data),createCar:data=>api.post('/admin/cars',data).then(r=>r.data),updateCar:(id,data)=>api.put(`/admin/cars/${id}`,data).then(r=>r.data),removeCar:id=>api.delete(`/admin/cars/${id}`),updateStatus:(id,statut)=>api.patch(`/admin/car-bookings/${id}/status`,{statut}).then(r=>r.data)}
export const flightApi={search:params=>api.get('/flights',{params}).then(r=>r.data),get:id=>api.get(`/flights/${id}`).then(r=>r.data),book:data=>api.post('/flight-bookings',data).then(r=>r.data),mine:()=>api.get('/flight-bookings/me').then(r=>r.data),admin:()=>api.get('/admin/flights').then(r=>r.data),bookings:()=>api.get('/admin/flight-bookings').then(r=>r.data),create:data=>api.post('/admin/flights',data).then(r=>r.data),status:(id,statut)=>api.patch(`/admin/flight-bookings/${id}/status`,{statut}).then(r=>r.data)}
export const orderApi={mine:()=>api.get('/orders/me').then(r=>r.data),all:()=>api.get('/admin/orders').then(r=>r.data),pay:(id,method)=>api.post(`/orders/${id}/payment`,{method}).then(r=>r.data),capturePaypal:id=>api.post(`/payments/paypal/${id}/capture`).then(r=>r.data),refund:(id,amount)=>api.post(`/admin/payments/${id}/refund`,{amount}).then(r=>r.data),confirm:id=>api.patch(`/admin/orders/${id}/confirm`).then(r=>r.data),confirmation:id=>download(`/orders/${id}/confirmation.pdf`,`confirmation-dossier-${id}.pdf`),invoice:id=>download(`/order-invoices/${id}/pdf`,`facture-${id}.pdf`)}
export const operationsApi={
  bookings:()=>api.get('/admin/bookings').then(r=>r.data),
  updateBooking:(id,status)=>api.patch(`/bookings/${id}/status`,{status}).then(r=>r.data),
  payments:()=>api.get('/admin/payments').then(r=>r.data),
  updatePayment:(id,status)=>api.patch(`/payments/${id}/status`,{status}).then(r=>r.data),
  users:role=>api.get('/admin/users',{params:{role}}).then(r=>r.data),
  createEmployee:data=>api.post('/admin/employees',data).then(r=>r.data),
  updateUser:(id,data)=>api.put(`/admin/users/${id}`,data).then(r=>r.data),
  removeUser:id=>api.delete(`/admin/users/${id}`)
}
export const publicMarketingApi={newsletter:email=>api.post('/newsletter',{email}).then(r=>r.data),contact:data=>api.post('/contacts',data).then(r=>r.data),validatePromo:code=>api.post('/promotions/validate',{code}).then(r=>r.data),review:data=>api.post('/reviews',data).then(r=>r.data)}
export const marketingApi={
  promotions:()=>api.get('/admin/promotions').then(r=>r.data),createPromotion:data=>api.post('/admin/promotions',data).then(r=>r.data),updatePromotion:(id,data)=>api.put(`/admin/promotions/${id}`,data).then(r=>r.data),removePromotion:id=>api.delete(`/admin/promotions/${id}`),
  reviews:()=>api.get('/admin/reviews').then(r=>r.data),removeReview:id=>api.delete(`/admin/reviews/${id}`),
  newsletters:()=>api.get('/admin/newsletters').then(r=>r.data),removeNewsletter:id=>api.delete(`/admin/newsletters/${id}`),
  contacts:()=>api.get('/admin/contacts').then(r=>r.data),updateContact:(id,statut)=>api.patch(`/admin/contacts/${id}/status`,{statut}).then(r=>r.data),removeContact:id=>api.delete(`/admin/contacts/${id}`),
  notifications:()=>api.get('/admin/notifications').then(r=>r.data),createNotification:data=>api.post('/admin/notifications',data).then(r=>r.data),removeNotification:id=>api.delete(`/admin/notifications/${id}`),mine:()=>api.get('/notifications/me').then(r=>r.data),read:id=>api.patch(`/notifications/${id}/read`).then(r=>r.data),readAll:()=>api.patch('/notifications/read-all').then(r=>r.data),preferences:()=>api.get('/notifications/preferences').then(r=>r.data),updatePreferences:data=>api.put('/notifications/preferences',data).then(r=>r.data)
}

export const toHotelOffer=h=>({id:h.id,type:'Hôtel',title:h.nom,location:[h.Destination?.ville,h.Destination?.pays].filter(Boolean).join(', ')||h.adresse,stars:h.etoiles||0,rating:h.Reviews?.length?Math.round(h.Reviews.reduce((s,r)=>s+r.rating,0)/h.Reviews.length*2*10)/10:0,reviews:h.Reviews?.length||0,price:Number(h.prix_nuit),image:h.images?.[0]||'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',tag:`${h.etoiles} étoiles`,description:h.description})
export const toTripOffer=t=>({id:t.id,type:'Circuit',title:t.titre,location:[t.Destination?.ville,t.Destination?.pays].filter(Boolean).join(', ')||'Destination à découvrir',stars:4,rating:t.Reviews?.length?Math.round(t.Reviews.reduce((s,r)=>s+r.rating,0)/t.Reviews.length*2*10)/10:0,reviews:t.Reviews?.length||0,price:Number(t.prix),image:t.image||'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=85',tag:`${t.places} places`,description:t.description})
