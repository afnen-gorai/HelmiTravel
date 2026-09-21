import * as gateway from '../services/paymentGatewayService.js'
export async function stripe(req,res,next){try{res.json(await gateway.stripeWebhook(req.body.toString('utf8'),req.headers['stripe-signature']))}catch(e){next(e)}}
export async function paypal(req,res,next){try{res.json(await gateway.paypalWebhook(req.headers,req.body))}catch(e){next(e)}}
export async function capturePaypal(req,res,next){try{res.json(await gateway.capturePaypal(req.user.id,req.params.providerOrderId))}catch(e){next(e)}}
export async function refund(req,res,next){try{res.json(await gateway.refund(req.params.id,req.body.amount))}catch(e){next(e)}}
