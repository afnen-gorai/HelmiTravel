import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import {mkdir,writeFile} from 'fs/promises'
import {uploadsDirectory as uploadDirectory} from '../config/paths.js'

const signatures=[
  {extension:'.jpg',mime:'image/jpeg',matches:b=>b.length>=3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff},
  {extension:'.png',mime:'image/png',matches:b=>b.length>=8&&b.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))},
  {extension:'.webp',mime:'image/webp',matches:b=>b.length>=12&&b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'}
]

export const uploadImage=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:5*1024*1024,files:1,fields:5},
  fileFilter:(req,file,cb)=>file.mimetype.startsWith('image/')?cb(null,true):cb(Object.assign(new Error('Format autorisé : JPG, PNG ou WebP'),{status:422}))
})

export async function saveImage(file){
  const type=signatures.find(item=>item.matches(file?.buffer||Buffer.alloc(0)))
  if(!type)throw Object.assign(new Error('Le contenu du fichier ne correspond pas à une image JPG, PNG ou WebP valide'),{status:422})
  const filename=`${Date.now()}-${crypto.randomBytes(16).toString('hex')}${type.extension}`
  await mkdir(uploadDirectory,{recursive:true})
  await writeFile(path.join(uploadDirectory,filename),file.buffer,{flag:'wx',mode:0o640})
  return {filename,mime:type.mime,url:`/uploads/${filename}`}
}
