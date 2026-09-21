import * as s from '../services/flightService.js'
export const search=async(req,res,next)=>{try{res.json(await s.search(req.query))}catch(e){next(e)}}
export const get=async(req,res,next)=>{try{const x=await s.get(req.params.id);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
export const book=async(req,res,next)=>{try{res.status(201).json(await s.book(req.user.id,req.body))}catch(e){next(e)}}
export const mine=async(req,res,next)=>{try{res.json(await s.mine(req.user.id))}catch(e){next(e)}}
export const adminList=async(req,res,next)=>{try{res.json(await s.adminList())}catch(e){next(e)}}
export const create=async(req,res,next)=>{try{res.status(201).json(await s.create(req.body))}catch(e){next(e)}}
export const bookings=async(req,res,next)=>{try{res.json(await s.bookings())}catch(e){next(e)}}
export const status=async(req,res,next)=>{try{const x=await s.status(req.params.id,req.body.statut);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
