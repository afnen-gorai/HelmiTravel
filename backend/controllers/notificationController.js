import * as service from '../services/notificationService.js'
export async function preferences(req,res,next){try{res.json(await service.preferences(req.user.id))}catch(e){next(e)}}
export async function updatePreferences(req,res,next){try{res.json(await service.updatePreferences(req.user.id,req.body))}catch(e){next(e)}}
export async function readAll(req,res,next){try{res.json(await service.readAll(req.user.id))}catch(e){next(e)}}
