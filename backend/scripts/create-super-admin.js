import 'dotenv/config'
import bcrypt from 'bcryptjs'
import {sequelize,User} from '../models/index.js'

const email=process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase()
const password=process.env.SUPER_ADMIN_PASSWORD
if(!email||!/^\S+@\S+\.\S+$/.test(email)||!password||password.length<14||!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/[0-9]/.test(password)||!/[^A-Za-z0-9]/.test(password)){
  console.error('SUPER_ADMIN_EMAIL valide et SUPER_ADMIN_PASSWORD (14+ caractères, majuscule, minuscule, chiffre, symbole) requis.')
  process.exit(1)
}
try{
  await sequelize.authenticate()
  const [user,created]=await User.findOrCreate({where:{email},defaults:{nom:process.env.SUPER_ADMIN_LAST_NAME||'Administrateur',prenom:process.env.SUPER_ADMIN_FIRST_NAME||'Super',password:await bcrypt.hash(password,12),role:'admin',email_verifie:true}})
  if(!created){await user.update({password:await bcrypt.hash(password,12),role:'admin',email_verifie:true});await user.reload()}
  console.log(`Super administrateur ${created?'créé':'mis à jour'} : ${user.email}`)
}finally{await sequelize.close()}
