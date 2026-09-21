import crypto from 'crypto'
import {Invoice,Order,Payment,User} from '../models/index.js'
import * as gateway from './paymentGatewayService.js'
const fail=(message,status)=>Object.assign(new Error(message),{status})
export async function createOrder({userId,type,sourceId,titre,montant,voyageurs}){const [order]=await Order.findOrCreate({where:{type,source_id:sourceId},defaults:{userId,type,source_id:sourceId,titre,montant,voyageurs,reference:`HT-${type.toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`}});return order}
export const mine=userId=>Order.findAll({where:{userId},include:[Payment,Invoice],order:[['createdAt','DESC']]})
export async function pay(userId,id,method){
  if(!['stripe','paypal','agence'].includes(method))throw fail('Méthode invalide',400)
  if(method!=='agence'&&!gateway.configured(method))throw fail(`${method==='stripe'?'Stripe':'PayPal'} n'est pas configuré. Choisissez le paiement en agence.`,503)
  const order=await Order.findOne({where:{id,userId}})
  if(!order||['annulee','payee','confirmee'].includes(order.statut))throw fail('Dossier non payable',409)
  let payment=await Payment.findOne({where:{orderId:order.id}})
  if(payment&&payment.method!==method){
    if(payment.status!=='en_attente'||payment.provider_payment_id)throw fail('Un autre mode de paiement est déjà associé à ce dossier',409)
    await payment.update({method,idempotency_key:crypto.randomUUID(),failure_reason:null})
  }
  if(!payment)payment=await Payment.create({orderId:order.id,method,amount:order.montant,status:'en_attente',date:new Date(),idempotency_key:crypto.randomUUID()})
  await order.update({statut:'paiement_en_attente'})
  return method==='agence'?{paymentId:payment.id,method,status:payment.status}:gateway.initiate(order,payment)
}
export async function confirm(id){const order=await Order.findByPk(id,{include:[Payment]});if(!order)return null;if(!order.Payment)throw fail('Aucun paiement',409);if(order.Payment.method!=='agence')throw fail('Stripe et PayPal sont confirmés uniquement par leurs webhooks sécurisés',409);const payment=await gateway.finalize(order.Payment);return {order:await Order.findByPk(id),payment,invoice:await Invoice.findOne({where:{orderId:order.id}})}}
export const getForUser=(id,user)=>Order.findOne({where:{id,...(user.role==='client'?{userId:user.id}:{})},include:[User,Payment,Invoice]})
