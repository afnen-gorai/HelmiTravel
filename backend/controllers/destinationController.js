import * as service from '../services/destinationService.js'
import {paginate} from '../utils/pagination.js'
export const list=async(req,res,next)=>{try{res.json(paginate(await service.list(req.query),req.query))}catch(e){next(e)}}
export const get=async(req,res,next)=>{try{const item=await service.get(req.params.id);item?res.json(item):res.status(404).json({message:'Destination introuvable'})}catch(e){next(e)}}
export const create=async(req,res,next)=>{try{res.status(201).json(await service.create(req.body))}catch(e){next(e)}}
export const update=async(req,res,next)=>{try{const item=await service.update(req.params.id,req.body);item?res.json(item):res.sendStatus(404)}catch(e){next(e)}}
export const remove=async(req,res,next)=>{try{const result=await service.remove(req.params.id);if(result.missing)return res.sendStatus(404);if(result.conflict)return res.status(409).json({message:'Cette destination contient encore des offres'});res.status(204).end()}catch(e){next(e)}}
