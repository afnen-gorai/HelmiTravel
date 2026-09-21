import path from 'path'
import {fileURLToPath} from 'url'

export const backendDirectory=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
export const uploadsDirectory=process.env.UPLOAD_DIR?path.resolve(process.env.UPLOAD_DIR):path.join(backendDirectory,'uploads')
