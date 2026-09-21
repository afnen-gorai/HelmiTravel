import {Hotel,Room} from '../models/index.js'
export const list=hotelId=>Room.findAll({where:hotelId?{hotelId}:{},include:[Hotel],order:[['createdAt','DESC']]})
export async function create(data){if(!await Hotel.findByPk(data.hotelId)){const error=new Error('Hôtel invalide');error.status=400;throw error}return Room.create(data)}
export async function update(id,data){const item=await Room.findByPk(id);if(!item)return null;return item.update(data)}
export const remove=id=>Room.destroy({where:{id}})
