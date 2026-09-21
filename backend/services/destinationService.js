import {Op} from 'sequelize'
import {Destination,Hotel,Trip,Room,Review} from '../models/index.js'
const normalize=data=>({...data,galerie:Array.isArray(data.galerie)?data.galerie:String(data.galerie||'').split(/[,\n]/).map(x=>x.trim()).filter(Boolean),latitude:data.latitude===''?null:data.latitude,longitude:data.longitude===''?null:data.longitude})
export const list=(filters={})=>{const where={};if(filters.q)where[Op.or]=['nom','pays','ville'].map(field=>({[field]:{[Op.like]:`%${filters.q}%`}}));if(filters.pays)where.pays=filters.pays;if(filters.ville)where.ville={[Op.like]:`%${filters.ville}%`};return Destination.findAll({where,include:[{model:Hotel,attributes:['id']},{model:Trip,attributes:['id']}],order:[['nom','ASC']]})}
export const get=id=>Destination.findByPk(id,{include:[{model:Hotel,include:[Room,Review]},{model:Trip,include:[Review]}]})
export const create=data=>Destination.create(normalize(data))
export async function update(id,data){const item=await Destination.findByPk(id);if(!item)return null;return item.update(normalize(data))}
export async function remove(id){const item=await Destination.findByPk(id);if(!item)return {missing:true};if(await Hotel.count({where:{destinationId:id}})||await Trip.count({where:{destinationId:id}}))return {conflict:true};await item.destroy();return {deleted:true}}
