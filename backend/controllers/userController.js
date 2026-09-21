import * as service from '../services/userService.js'
import {saveImage} from '../middleware/upload.js'
export const profile=async(req,res,next)=>{try{const user=await service.profile(req.user.id);user?res.json(user):res.sendStatus(404)}catch(e){next(e)}}
export const updateProfile=async(req,res,next)=>{try{res.json(await service.updateProfile(req.user.id,req.body))}catch(e){next(e)}}
export const photo=async(req,res,next)=>{try{if(!req.file)return res.status(400).json({message:'Image requise'});const image=await saveImage(req.file);res.json(await service.updatePhoto(req.user.id,image.url))}catch(e){next(e)}}
export const favorites=async(req,res,next)=>{try{res.json(await service.favorites(req.user.id))}catch(e){next(e)}}
export const addFavorite=async(req,res,next)=>{try{res.status(201).json(await service.addFavorite(req.user.id,req.body.type,Number(req.body.item_id)))}catch(e){next(e)}}
export const removeFavorite=async(req,res,next)=>{try{const n=await service.removeFavorite(req.user.id,req.params.id);res.status(n?204:404).end()}catch(e){next(e)}}
export const reviews=async(req,res,next)=>{try{res.json(await service.reviews(req.user.id))}catch(e){next(e)}}
