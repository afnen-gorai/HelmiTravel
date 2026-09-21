import {Router} from 'express'
import {auth,permit} from '../middleware/auth.js'
import {users,createEmployee,updateUser,deleteUser,auditLogs,dashboard} from '../controllers/adminController.js'
import * as settings from '../controllers/settingController.js'
const r=Router()
r.get('/admin/users',auth,permit('admin','agent'),users)
r.post('/admin/employees',auth,permit('admin'),createEmployee)
r.put('/admin/users/:id',auth,permit('admin'),updateUser)
r.delete('/admin/users/:id',auth,permit('admin'),deleteUser)
r.get('/admin/audit-logs',auth,permit('admin'),auditLogs)
r.get('/dashboard',auth,permit('admin','agent'),dashboard)
r.get('/admin/settings',auth,permit('admin'),settings.list)
r.post('/admin/settings',auth,permit('admin'),settings.create)
r.put('/admin/settings/:id',auth,permit('admin'),settings.update)
r.delete('/admin/settings/:id',auth,permit('admin'),settings.remove)
export default r
