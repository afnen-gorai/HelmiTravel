import nodemailer from 'nodemailer'

const enabled=Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASSWORD)
const transporter=enabled?nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}}):null

export async function sendEmail({to,subject,html}){
  if(!transporter){console.log(`[Email dev] ${subject} -> ${to}`);return {sent:false,development:true}}
  const info=await transporter.sendMail({from:process.env.SMTP_FROM||'Helmi Travel <no-reply@helmitravel.tn>',to,subject,html})
  return {sent:true,messageId:info.messageId}
}

export const bookingEmail=(user,booking)=>sendEmail({to:user.email,subject:`Réservation HT-${String(booking.id).padStart(5,'0')} enregistrée`,html:`<h2>Merci ${user.prenom}</h2><p>Votre réservation a bien été enregistrée.</p><p>Montant : <strong>${Number(booking.prix_total).toFixed(2)} DT</strong></p><p>Statut : en attente</p>`})
export const paymentEmail=(user,booking,status)=>sendEmail({to:user.email,subject:`Paiement ${status} — HT-${String(booking.id).padStart(5,'0')}`,html:`<h2>Bonjour ${user.prenom}</h2><p>Le statut de votre paiement est désormais : <strong>${status}</strong>.</p><p>Votre facture est disponible dans votre espace Client.</p>`})
export const orderEmail=(user,order)=>sendEmail({to:user.email,subject:`Dossier ${order.reference} enregistré`,html:`<h2>Bonjour ${user.prenom}</h2><p>Votre dossier <strong>${order.reference}</strong> pour ${order.titre} est enregistré.</p><p>Montant : <strong>${Number(order.montant).toFixed(2)} DT</strong></p><p>Vous pouvez maintenant choisir votre paiement dans votre espace Client.</p>`})
