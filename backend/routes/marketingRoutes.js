import {Router} from 'express'
import {auth,permit} from '../middleware/auth.js'
import * as c from '../controllers/marketingController.js'
import * as notification from '../controllers/notificationController.js'
const r=Router()
r.get('/home',c.home)
r.get('/promotions',c.promotions);r.post('/promotions/validate',c.validatePromotion)
r.get('/admin/promotions',auth,permit('admin','agent'),c.adminPromotions);r.post('/admin/promotions',auth,permit('admin'),c.createPromotion);r.put('/admin/promotions/:id',auth,permit('admin'),c.updatePromotion);r.delete('/admin/promotions/:id',auth,permit('admin'),c.deletePromotion)
r.get('/admin/reviews',auth,permit('admin','agent'),c.adminReviews);r.post('/reviews',auth,c.createReview);r.delete('/admin/reviews/:id',auth,permit('admin'),c.deleteReview)
r.post('/newsletter',c.subscribe);r.get('/admin/newsletters',auth,permit('admin','agent'),c.newsletters);r.delete('/admin/newsletters/:id',auth,permit('admin'),c.deleteNewsletter)
r.post('/contacts',c.createContact);r.get('/admin/contacts',auth,permit('admin','agent'),c.contacts);r.patch('/admin/contacts/:id/status',auth,permit('admin','agent'),c.updateContactStatus);r.delete('/admin/contacts/:id',auth,permit('admin'),c.deleteContact)
r.get('/notifications/me',auth,c.myNotifications);r.patch('/notifications/:id/read',auth,c.readNotification);r.get('/admin/notifications',auth,permit('admin','agent'),c.adminNotifications);r.post('/admin/notifications',auth,permit('admin','agent'),c.createNotification);r.delete('/admin/notifications/:id',auth,permit('admin'),c.deleteNotification)
r.get('/notifications/preferences',auth,notification.preferences);r.put('/notifications/preferences',auth,notification.updatePreferences);r.patch('/notifications/read-all',auth,notification.readAll)
export default r
