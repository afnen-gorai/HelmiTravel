import {Router} from 'express'
import {auth,permit} from '../middleware/auth.js'
import {createPayment,myPayments,adminPayments,updatePaymentStatus,invoiceDocument} from '../controllers/paymentController.js'
const r=Router()
r.post('/payment',auth,createPayment)
r.get('/payments/me',auth,myPayments)
r.get('/admin/payments',auth,permit('admin','agent'),adminPayments)
r.patch('/payments/:id/status',auth,permit('admin'),updatePaymentStatus)
r.get('/invoices/:id/pdf',auth,invoiceDocument)
export default r
