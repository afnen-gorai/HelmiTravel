import crypto from 'crypto'
import {sequelize} from '../config/database.js'
import {Flight,FlightBooking,User} from '../models/index.js'
import {providerName,searchFlights} from './flightProvider.js'
export const search=async query=>({provider:providerName,results:await searchFlights(query)})
export const get=id=>Flight.findByPk(id)
export async function book(userId,data){let transaction;try{transaction=await sequelize.transaction();const flight=await Flight.findByPk(data.flightId,{transaction,lock:transaction.LOCK.UPDATE}),passengers=Array.isArray(data.passagers)?data.passagers:[],count=passengers.length;if(!flight||flight.statut!=='programme'||count<1||flight.places<count)throw Object.assign(new Error('Vol ou nombre de places indisponible'),{status:409});const booking=await FlightBooking.create({userId,flightId:flight.id,passagers:passengers,nombre_passagers:count,prix_total:Number(flight.prix)*count,reference:`VOL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,statut:'en_attente'},{transaction});await flight.decrement('places',{by:count,transaction});if(flight.places-count===0)await flight.update({statut:'complet'},{transaction});await transaction.commit();transaction=null;return FlightBooking.findByPk(booking.id,{include:[Flight]})}catch(e){if(transaction)await transaction.rollback();throw e}}
export const mine=userId=>FlightBooking.findAll({where:{userId},include:[Flight],order:[['createdAt','DESC']]})
export const adminList=()=>Flight.findAll({order:[['depart','ASC']]})
export const create=data=>Flight.create({...data,source:'simulation'})
export const bookings=()=>FlightBooking.findAll({include:[Flight,{model:User,attributes:['id','nom','prenom','email']}],order:[['createdAt','DESC']]})
export async function status(id,statut){if(!['en_attente','confirmee','annulee'].includes(statut))throw Object.assign(new Error('Statut invalide'),{status:400});const item=await FlightBooking.findByPk(id);return item?item.update({statut}):null}
