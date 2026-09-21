import {Router} from 'express'
import {rateLimit} from 'express-rate-limit'
import * as controller from '../controllers/authController.js'
import {auth} from '../middleware/auth.js'
import {changePasswordRules,emailRule,loginRules,passwordRules,refreshRules,registerRules,tokenRules} from '../middleware/validation.js'

const router=Router()
const loginLimiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-7',legacyHeaders:false,skipSuccessfulRequests:true,message:{message:'Trop de tentatives de connexion, réessayez dans 15 minutes.'}})
const recoveryLimiter=rateLimit({windowMs:60*60*1000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:{message:'Trop de demandes, réessayez plus tard.'}})
router.post('/register',registerRules,controller.register)
router.post('/login',loginLimiter,loginRules,controller.login)
router.post('/refresh',refreshRules,controller.refresh)
router.post('/logout',controller.logout)
router.post('/forgot-password',recoveryLimiter,emailRule,controller.forgotPassword)
router.post('/reset-password',tokenRules,passwordRules,controller.resetPassword)
router.post('/verify-email',tokenRules,controller.verifyEmail)
router.post('/resend-verification',recoveryLimiter,emailRule,controller.resendVerification)
router.put('/change-password',auth,changePasswordRules,controller.changePassword)
export default router
