import * as s from '../services/orderService.js';import {orderConfirmationPdf,orderInvoicePdf} from '../utils/pdf.js';import {Invoice,Order,Payment,User} from '../models/index.js'
export const mine=async(req,res,next)=>{try{res.json(await s.mine(req.user.id))}catch(e){next(e)}}
export const all=async(req,res,next)=>{try{res.json(await Order.findAll({include:[User,Payment,Invoice],order:[['createdAt','DESC']]}))}catch(e){next(e)}}
export const pay=async(req,res,next)=>{try{res.status(201).json(await s.pay(req.user.id,req.params.id,req.body.method))}catch(e){next(e)}}
export const confirm=async(req,res,next)=>{try{const x=await s.confirm(req.params.id);x?res.json(x):res.sendStatus(404)}catch(e){next(e)}}
export const confirmation=async(req,res,next)=>{try{const x=await s.getForUser(req.params.id,req.user);x?await orderConfirmationPdf(res,x):res.sendStatus(404)}catch(e){next(e)}}
export const invoice=async(req,res,next)=>{try{const x=await Invoice.findByPk(req.params.id,{include:{model:Order,include:[User,Payment]}});if(!x||!x.Order||(req.user.role==='client'&&x.Order.userId!==req.user.id))return res.sendStatus(404);await orderInvoicePdf(res,x)}catch(e){next(e)}}
