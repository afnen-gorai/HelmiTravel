import {Op} from 'sequelize'
import {sequelize} from '../config/database.js'
import {User,Hotel,Room,Trip,Booking,Payment} from '../models/index.js'
import {confirmationPdf} from '../utils/pdf.js'
const fail=(message,status=400)=>Object.assign(new Error(message),{status})

export async function createBooking(req,res,next){let transaction;try{
  const people=Math.max(1,Number(req.body.nombre_personnes)||1),hotelId=req.body.hotelId?Number(req.body.hotelId):null,tripId=req.body.tripId?Number(req.body.tripId):null
  const bookingUserId=['admin','agent'].includes(req.user.role)&&req.body.userId?Number(req.body.userId):req.user.id
  if(!await User.findByPk(bookingUserId))throw fail('Client introuvable',404)
  if((hotelId&&!tripId)===(!hotelId&&tripId))throw fail('Choisissez un hôtel ou un voyage')
  transaction=await sequelize.transaction();let booking
  if(hotelId){
    const roomId=Number(req.body.roomId),date_arrivee=req.body.date_arrivee,date_depart=req.body.date_depart,nombre_chambres=Math.max(1,Number(req.body.nombre_chambres)||1),arrival=new Date(date_arrivee),departure=new Date(date_depart)
    if(!roomId||!(arrival<departure))throw fail('Chambre et période de séjour valides requises',422)
    const hotel=await Hotel.findByPk(hotelId,{transaction,lock:transaction.LOCK.UPDATE});if(!hotel||!hotel.disponibilite)throw fail('Cet hôtel n’est pas disponible',409)
    const room=await Room.findOne({where:{id:roomId,hotelId,disponible:true},transaction,lock:transaction.LOCK.UPDATE});if(!room||room.capacite*nombre_chambres<people)throw fail('Cette chambre ne convient pas au nombre de voyageurs',409)
    const reserved=await Booking.sum('nombre_chambres',{where:{roomId,status:{[Op.ne]:'annulee'},date_arrivee:{[Op.lt]:date_depart},date_depart:{[Op.gt]:date_arrivee}},transaction})||0;if(reserved+nombre_chambres>room.quantite)throw fail('Plus assez de chambres pour cette période',409)
    booking=await Booking.create({userId:bookingUserId,hotelId,roomId,date:req.body.date||new Date(),date_arrivee,date_depart,nombre_personnes:people,nombre_chambres,prix_total:Number(room.prix)*Math.ceil((departure-arrival)/86400000)*nombre_chambres,status:'en_attente'},{transaction})
  }else{
    const trip=await Trip.findByPk(tripId,{transaction,lock:transaction.LOCK.UPDATE});if(!trip||trip.statut!=='publie'||trip.places<people)throw fail('Nombre de places insuffisant',409)
    await trip.decrement('places',{by:people,transaction});if(trip.places-people===0)await trip.update({statut:'complet'},{transaction})
    booking=await Booking.create({userId:bookingUserId,tripId,date:req.body.date||new Date(),nombre_personnes:people,nombre_chambres:1,prix_total:Number(trip.prix)*people,status:'en_attente'},{transaction})
  }
  await transaction.commit();transaction=null;res.status(201).json(await Booking.findByPk(booking.id,{include:[Hotel,Trip]}))
}catch(e){if(transaction)await transaction.rollback();next(e)}}
export async function myBookings(req,res,next){try{res.json(await Booking.findAll({where:{userId:req.user.id},include:[Hotel,Trip,Payment],order:[['createdAt','DESC']]}))}catch(e){next(e)}}
export async function userBookings(req,res,next){try{if(req.user.role==='client'&&req.user.id!==+req.params.id)return res.sendStatus(403);res.json(await Booking.findAll({where:{userId:req.params.id},include:[Hotel,Trip,Payment]}))}catch(e){next(e)}}
export async function updateBookingStatus(req,res,next){let transaction;try{if(!['en_attente','confirmee','annulee','terminee'].includes(req.body.status))return res.status(400).json({message:'Statut invalide'});transaction=await sequelize.transaction();const b=await Booking.findByPk(req.params.id,{transaction,lock:transaction.LOCK.UPDATE});if(!b){await transaction.rollback();return res.sendStatus(404)}if(req.body.status==='annulee'&&b.status!=='annulee'&&b.tripId){const trip=await Trip.findByPk(b.tripId,{transaction,lock:transaction.LOCK.UPDATE});if(trip)await trip.update({places:trip.places+b.nombre_personnes,statut:trip.statut==='complet'?'publie':trip.statut},{transaction})}await b.update({status:req.body.status},{transaction});await transaction.commit();transaction=null;res.json(b)}catch(e){if(transaction)await transaction.rollback();next(e)}}
export async function adminBookings(req,res,next){try{res.json(await Booking.findAll({include:[{model:User,attributes:['id','nom','prenom','email','telephone']},Hotel,Trip,Payment],order:[['createdAt','DESC']]}))}catch(e){next(e)}}
export async function bookingConfirmation(req,res,next){try{const booking=await Booking.findByPk(req.params.id,{include:[User,Hotel,Trip,Payment]});if(!booking)return res.sendStatus(404);if(booking.userId!==req.user.id&&!['admin','agent'].includes(req.user.role))return res.sendStatus(403);await confirmationPdf(res,booking)}catch(e){next(e)}}
