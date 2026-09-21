import {Router} from 'express';import * as c from '../controllers/tripController.js';import {auth,permit} from '../middleware/auth.js'
const r=Router();r.get('/',c.list);r.get('/:id/programme.pdf',c.programPdf);r.get('/:id',c.get);r.post('/',auth,permit('admin','agent'),c.create);r.put('/:id',auth,permit('admin','agent'),c.update);r.delete('/:id',auth,permit('admin'),c.remove);export default r
