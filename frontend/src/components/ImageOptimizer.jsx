import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

export default function ImageOptimizer(){const {pathname}=useLocation();useEffect(()=>{const optimize=()=>document.querySelectorAll('img:not([loading])').forEach(image=>{image.loading='lazy';image.decoding='async'});optimize();const root=document.getElementById('root'),observer=new MutationObserver(optimize);observer.observe(root,{childList:true,subtree:true});return()=>observer.disconnect()},[pathname]);return null}
