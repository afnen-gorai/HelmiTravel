import {Op} from 'sequelize'
import {Flight} from '../models/index.js'
export const providerName=process.env.FLIGHT_PROVIDER||'simulation'
export async function searchFlights(query={}){const where={statut:'programme'};if(query.origine)where.origine={[Op.like]:`%${query.origine}%`};if(query.destination)where.destination={[Op.like]:`%${query.destination}%`};if(query.date){where.depart={[Op.gte]:new Date(`${query.date}T00:00:00`),[Op.lt]:new Date(`${query.date}T23:59:59`)}}if(query.passagers)where.places={[Op.gte]:Number(query.passagers)};if(query.classe)where.classe=query.classe;return Flight.findAll({where,order:[[query.tri==='prix'?'prix':'depart','ASC']]})}
