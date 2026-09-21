import {Router} from 'express'
import {auth,permit} from '../middleware/auth.js'
import {createBooking,myBookings,userBookings,updateBookingStatus,adminBookings,bookingConfirmation} from '../controllers/bookingController.js'
const r=Router()
r.post('/bookings',auth,createBooking)
r.get('/bookings/me',auth,myBookings)
r.get('/bookings/user/:id',auth,userBookings)
r.patch('/bookings/:id/status',auth,permit('admin','agent'),updateBookingStatus)
r.get('/admin/bookings',auth,permit('admin','agent'),adminBookings)
r.get('/bookings/:id/confirmation.pdf',auth,bookingConfirmation)
export default r
