import * as service from '../services/carService.js'
import {carContractPdf} from '../utils/pdf.js'
export const categories=async(req,res,next)=>{try{res.json(await service.categories())}catch(e){next(e)}}
export const createCategory=async(req,res,next)=>{try{res.status(201).json(await service.createCategory(req.body))}catch(e){next(e)}}
export const cars=async(req,res,next)=>{try{res.json(await service.cars(req.query))}catch(e){next(e)}}
export const car=async(req,res,next)=>{try{const x=await service.car(req.params.id);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
export const adminCars=async(req,res,next)=>{try{res.json(await service.adminCars())}catch(e){next(e)}}
export const createCar=async(req,res,next)=>{try{res.status(201).json(await service.createCar(req.body))}catch(e){next(e)}}
export const updateCar=async(req,res,next)=>{try{const x=await service.updateCar(req.params.id,req.body);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
export const deleteCar=async(req,res,next)=>{try{const n=await service.deleteCar(req.params.id);res.status(n?204:404).end()}catch(e){next(e)}}
export const book=async(req,res,next)=>{try{const userId=['admin','agent'].includes(req.user.role)&&req.body.userId?Number(req.body.userId):req.user.id;res.status(201).json(await service.book(userId,req.body))}catch(e){next(e)}}
export const mine=async(req,res,next)=>{try{res.json(await service.mine(req.user.id))}catch(e){next(e)}}
export const adminBookings=async(req,res,next)=>{try{res.json(await service.adminBookings())}catch(e){next(e)}}
export const status=async(req,res,next)=>{try{const x=await service.status(req.params.id,req.body.statut);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
export const contract=async(req,res,next)=>{try{const x=await service.booking(req.params.id);if(!x)return res.sendStatus(404);if(x.userId!==req.user.id&&!['admin','agent'].includes(req.user.role))return res.sendStatus(403);await carContractPdf(res,x)}catch(e){next(e)}}
