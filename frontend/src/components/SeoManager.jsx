import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

const pages={
  '/':['Helmi Travel — Agence de voyage en Tunisie','Réservez hôtels, voyages, vols et voitures avec Helmi Travel.'],
  '/hotels':['Hôtels en Tunisie et à l’étranger | Helmi Travel','Comparez les hôtels, chambres, prix et disponibilités par date.'],
  '/voyages':['Voyages organisés et circuits | Helmi Travel','Découvrez nos voyages organisés, circuits et programmes jour par jour.'],
  '/destinations':['Destinations touristiques | Helmi Travel','Explorez les destinations proposées par Helmi Travel.'],
  '/voitures':['Location de voitures | Helmi Travel','Réservez une voiture selon vos dates et votre destination.'],
  '/vols':['Recherche de vols | Helmi Travel','Recherchez et réservez votre prochain vol.'],
  '/promotions':['Promotions voyage | Helmi Travel','Profitez des offres et codes promotionnels Helmi Travel.'],
  '/contact':['Contactez Helmi Travel','Contactez notre agence et préparez votre prochain voyage.']
}

const setHead=(selector,tag,attributes)=>{let node=document.head.querySelector(selector);if(!node){node=document.createElement(tag);document.head.appendChild(node)}for(const [key,value] of Object.entries(attributes))node.setAttribute(key,value)}

export default function SeoManager(){const {pathname}=useLocation();useEffect(()=>{const [title,description]=pages[pathname]||[pathname.startsWith('/offre/')?'Détail de l’offre | Helmi Travel':'Helmi Travel','Votre plateforme de réservation touristique.'];const url=`https://helmitravel.tn${pathname}`;document.title=title;setHead('meta[name="description"]','meta',{name:'description',content:description});setHead('meta[property="og:title"]','meta',{property:'og:title',content:title});setHead('meta[property="og:description"]','meta',{property:'og:description',content:description});setHead('meta[property="og:url"]','meta',{property:'og:url',content:url});setHead('meta[name="twitter:title"]','meta',{name:'twitter:title',content:title});setHead('meta[name="twitter:description"]','meta',{name:'twitter:description',content:description});setHead('link[rel="canonical"]','link',{rel:'canonical',href:url});let schema=document.head.querySelector('#helmi-schema');if(!schema){schema=document.createElement('script');schema.id='helmi-schema';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'TravelAgency',name:'Helmi Travel',url:'https://helmitravel.tn',email:'contact@helmitravel.tn',telephone:'+21671000700',address:{'@type':'PostalAddress',streetAddress:'12, Avenue Habib Bourguiba',addressLocality:'Tunis',addressCountry:'TN'}})},[pathname]);return null}
