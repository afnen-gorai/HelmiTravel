import * as service from '../services/roomService.js'
export const list=async(req,res,next)=>{try{res.json(await service.list(req.query.hotelId))}catch(e){next(e)}}
export const create=async(req,res,next)=>{try{res.status(201).json(await service.create(req.body))}catch(e){next(e)}}
export const update=async(req,res,next)=>{try{const item=await service.update(req.params.id,req.body);item?res.json(item):res.sendStatus(404)}catch(e){next(e)}}
export const remove=async(req,res,next)=>{try{const count=await service.remove(req.params.id);res.status(count?204:404).end()}catch(e){next(e)}}
