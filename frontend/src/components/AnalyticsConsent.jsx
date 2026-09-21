import {useEffect,useState} from 'react'

const storageKey='helmi_cookie_consent'
const addScript=(id,src,content)=>{if(document.getElementById(id))return;const script=document.createElement('script');script.id=id;if(src){script.async=true;script.src=src}else script.text=content;document.head.appendChild(script)}

function enableAnalytics(){
  const gtm=import.meta.env.VITE_GTM_ID
  const ga=import.meta.env.VITE_GA_MEASUREMENT_ID
  const pixel=import.meta.env.VITE_META_PIXEL_ID
  if(gtm){window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});addScript('helmi-gtm',`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`)}
  else if(ga){window.dataLayer=window.dataLayer||[];window.gtag=(...args)=>window.dataLayer.push(args);window.gtag('js',new Date());window.gtag('config',ga,{anonymize_ip:true});addScript('helmi-ga',`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`)}
  if(pixel)addScript('helmi-meta-pixel',null,`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`)
}

export default function AnalyticsConsent(){
  const [choice,setChoice]=useState(()=>localStorage.getItem(storageKey))
  useEffect(()=>{if(choice==='accepted')enableAnalytics()},[choice])
  const decide=value=>{localStorage.setItem(storageKey,value);setChoice(value)}
  if(choice)return null
  return <aside className="cookie-consent" role="dialog" aria-label="Consentement aux cookies"><div><b>Votre vie privée</b><p>Les cookies nécessaires assurent le fonctionnement du site. Les mesures d’audience et outils marketing ne sont activés qu’avec votre accord.</p></div><button className="btn btn-outline" onClick={()=>decide('refused')}>Refuser</button><button className="btn btn-gold" onClick={()=>decide('accepted')}>Accepter</button></aside>
}
