import * as authService from '../services/authService.js'

export const register=async(req,res,next)=>{try{res.status(201).json(await authService.register(req.body,req))}catch(e){next(e)}}
export const login=async(req,res,next)=>{try{res.json(await authService.login(req.body,req))}catch(e){next(e)}}
export const refresh=async(req,res,next)=>{try{res.json(await authService.refresh(req.body.refreshToken,req))}catch(e){next(e)}}
export const logout=async(req,res,next)=>{try{await authService.logout(req.body.refreshToken);res.status(204).end()}catch(e){next(e)}}
export const forgotPassword=async(req,res,next)=>{try{res.json(await authService.forgotPassword(req.body.email,req))}catch(e){next(e)}}
export const resetPassword=async(req,res,next)=>{try{res.json(await authService.resetPassword(req.body.token,req.body.password))}catch(e){next(e)}}
export const verifyEmail=async(req,res,next)=>{try{res.json(await authService.verifyEmail(req.body.token))}catch(e){next(e)}}
export const resendVerification=async(req,res,next)=>{try{res.json(await authService.resendVerification(req.body.email,req))}catch(e){next(e)}}
export const changePassword=async(req,res,next)=>{try{res.json(await authService.changePassword(req.user.id,req.body.currentPassword,req.body.password))}catch(e){next(e)}}
