import {Router} from 'express'
import * as c from '../controllers/userController.js'
import {auth} from '../middleware/auth.js'
import {uploadImage} from '../middleware/upload.js'
const r=Router();r.use(auth);r.get('/me',c.profile);r.put('/me',c.updateProfile);r.post('/me/photo',uploadImage.single('photo'),c.photo);r.get('/me/favorites',c.favorites);r.post('/me/favorites',c.addFavorite);r.delete('/me/favorites/:id',c.removeFavorite);r.get('/me/reviews',c.reviews);export default r
