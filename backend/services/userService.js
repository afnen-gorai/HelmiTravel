import {Favorite,Hotel,Review,Trip,User} from '../models/index.js'
export const profile=id=>User.findByPk(id,{attributes:{exclude:['password']}})
export async function updateProfile(id,data){const user=await User.findByPk(id);if(!user)return null;await user.update({nom:data.nom??user.nom,prenom:data.prenom??user.prenom,telephone:data.telephone??user.telephone});const json=user.toJSON();delete json.password;return json}
export async function updatePhoto(id,path){const user=await User.findByPk(id);await user.update({photo:path});return {photo:path}}
export async function favorites(userId){
  const rows=await Favorite.findAll({where:{userId},order:[['createdAt','DESC']]})
  return Promise.all(rows.map(async row=>({
    ...row.toJSON(),
    item:row.type==='hotel'?await Hotel.findByPk(row.item_id):await Trip.findByPk(row.item_id)
  })))
}
export async function addFavorite(userId,type,itemId){if(!['hotel','trip'].includes(type)){const e=new Error('Type de favori invalide');e.status=400;throw e}const exists=type==='hotel'?await Hotel.findByPk(itemId):await Trip.findByPk(itemId);if(!exists){const e=new Error('Offre introuvable');e.status=404;throw e}const [favorite]=await Favorite.findOrCreate({where:{userId,type,item_id:itemId}});return favorite}
export const removeFavorite=(userId,id)=>Favorite.destroy({where:{id,userId}})
export const reviews=userId=>Review.findAll({where:{userId},include:[Hotel,Trip],order:[['createdAt','DESC']]})
