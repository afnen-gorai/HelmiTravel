import * as service from '../services/hotelService.js'
import {paginate} from '../utils/pagination.js'
export const list=async(req,res,next)=>{try{res.json(paginate(await service.list(req.query),req.query))}catch(e){next(e)}}
export const get=async(req,res,next)=>{try{const item=await service.get(req.params.id,req.query);item?res.json(item):res.status(404).json({message:'Hôtel introuvable'})}catch(e){next(e)}}
export const create=async(req,res,next)=>{try{res.status(201).json(await service.create(req.body))}catch(e){next(e)}}
export const update=async(req,res,next)=>{try{const item=await service.update(req.params.id,req.body);item?res.json(item):res.sendStatus(404)}catch(e){next(e)}}
export const remove=async(req,res,next)=>{try{const count=await service.remove(req.params.id);res.status(count?204:404).end()}catch(e){next(e)}}
