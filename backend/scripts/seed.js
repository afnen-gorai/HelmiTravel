import bcrypt from 'bcryptjs'
import {sequelize} from '../config/database.js'
import {User,Destination,Hotel,Room,Trip,Promotion,Setting,CarCategory,Car,Flight} from '../models/index.js'

const images={djerba:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85',istanbul:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85',maldives:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85'}

try {
  await sequelize.authenticate()
  await sequelize.sync()
  const adminPassword=await bcrypt.hash('admin123',12)
  const [admin]=await User.findOrCreate({where:{email:'admin@helmitravel.tn'},defaults:{nom:'Travel',prenom:'Helmi',password:adminPassword,telephone:'+216 71 000 700',role:'admin',email_verifie:true}});if(!admin.email_verifie)await admin.update({email_verifie:true})
  const clientPassword=await bcrypt.hash('client123',12)
  const [client]=await User.findOrCreate({where:{email:'client@helmitravel.tn'},defaults:{nom:'Mansour',prenom:'Amira',password:clientPassword,telephone:'+216 20 123 456',role:'client',email_verifie:true}});if(!client.email_verifie)await client.update({email_verifie:true})
  const [djerba]=await Destination.findOrCreate({where:{nom:'Djerba'},defaults:{pays:'Tunisie',ville:'Djerba',description:'Plages de sable fin, patrimoine et douceur méditerranéenne.',image:images.djerba}})
  const [istanbul]=await Destination.findOrCreate({where:{nom:'Istanbul'},defaults:{pays:'Turquie',ville:'Istanbul',description:'Une ville fascinante entre Europe et Asie.',image:images.istanbul}})
  const [maldives]=await Destination.findOrCreate({where:{nom:'Maldives'},defaults:{pays:'Maldives',ville:'Malé',description:'Lagons turquoise et villas sur pilotis.',image:images.maldives}})
  await djerba.update({latitude:33.8076,longitude:10.8451,galerie:[images.djerba]});await istanbul.update({latitude:41.0082,longitude:28.9784,galerie:[images.istanbul]});await maldives.update({latitude:4.1755,longitude:73.5093,galerie:[images.maldives]})
  const [hotel]=await Hotel.findOrCreate({where:{nom:'Hasdrubal Prestige Thalassa & Spa'},defaults:{destinationId:djerba.id,description:'Un refuge cinq étoiles en bord de mer avec plage privée et spa.',etoiles:5,adresse:'Zone touristique, Djerba',prix_nuit:289,images:[images.djerba],disponibilite:true}})
  await hotel.update({destinationId:djerba.id,images:[images.djerba,'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85'],equipements:['Wi-Fi gratuit','Piscine extérieure','Spa & hammam','Restaurant','Parking gratuit','Plage privée'],latitude:33.8245,longitude:11.0409})
  const [deluxe]=await Room.findOrCreate({where:{hotelId:hotel.id,type:'Chambre Deluxe'},defaults:{prix:289,capacite:2,quantite:8,disponible:true}});if(deluxe.quantite<2)await deluxe.update({quantite:8})
  const [suite]=await Room.findOrCreate({where:{hotelId:hotel.id,type:'Suite vue mer'},defaults:{prix:469,capacite:3,quantite:4,disponible:true}});if(suite.quantite<2)await suite.update({quantite:4})
  const [trip]=await Trip.findOrCreate({where:{titre:'Istanbul, entre deux continents'},defaults:{destinationId:istanbul.id,description:'Mosquées impériales, Bosphore et saveurs orientales.',prix:1890,date_depart:'2026-08-12',date_retour:'2026-08-19',places:24,programme:[{jour:1,titre:'Arrivée et installation'},{jour:2,titre:'Vieille ville et Sainte-Sophie'},{jour:3,titre:'Croisière sur le Bosphore'}],image:images.istanbul,statut:'publie'}});await trip.update({destinationId:istanbul.id,type_voyage:'Culture & découverte',transport:'Vol Tunisair et autocar climatisé',hotel_inclus:'Hôtel 4★ au centre d’Istanbul',repas_inclus:['Petit-déjeuner','2 dîners'],galerie:[images.istanbul,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85'],programme:[{jour:1,titre:'Arrivée et installation',description:'Accueil à l’aéroport, transfert et installation à l’hôtel.'},{jour:2,titre:'Vieille ville et Sainte-Sophie',description:'Découverte de Sultanahmet, Sainte-Sophie et la Mosquée Bleue.'},{jour:3,titre:'Croisière sur le Bosphore',description:'Navigation entre Europe et Asie puis temps libre au Grand Bazar.'},{jour:4,titre:'Palais de Topkapi',description:'Visite guidée du palais et des quartiers historiques.'},{jour:5,titre:'Journée libre',description:'Suggestions personnalisées et shopping.'},{jour:6,titre:'Istanbul moderne',description:'Taksim, Galata et les rives animées du Bosphore.'},{jour:7,titre:'Retour à Tunis',description:'Transfert vers l’aéroport et vol retour.'}]})
  await Promotion.findOrCreate({where:{code:'HELMI10'},defaults:{titre:'Bienvenue chez Helmi Travel',type:'pourcentage',valeur:10,date_debut:new Date('2026-01-01'),date_fin:new Date('2026-12-31'),utilisations_max:500,active:true}})
  await Setting.findOrCreate({where:{cle:'agence_nom'},defaults:{valeur:'Helmi Travel'}})
  await Setting.findOrCreate({where:{cle:'devise'},defaults:{valeur:'TND'}})
  const [economy]=await CarCategory.findOrCreate({where:{nom:'Économique'},defaults:{description:'Citadines pratiques et économiques.'}});const [suv]=await CarCategory.findOrCreate({where:{nom:'SUV'},defaults:{description:'Confort et espace pour les longs trajets.'}})
  await Car.findOrCreate({where:{marque:'Renault',modele:'Clio 5'},defaults:{categoryId:economy.id,transmission:'Manuelle',carburant:'Essence',places:5,bagages:2,prix_jour:95,images:['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85'],lieu:'Aéroport Tunis-Carthage',disponible:true}})
  await Car.findOrCreate({where:{marque:'Hyundai',modele:'Tucson'},defaults:{categoryId:suv.id,transmission:'Automatique',carburant:'Diesel',places:5,bagages:4,prix_jour:185,images:['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85'],lieu:'Tunis Centre',disponible:true}})
  await Flight.findOrCreate({where:{numero_vol:'TU-216'},defaults:{compagnie:'Tunisair',origine:'Tunis (TUN)',destination:'Istanbul (IST)',depart:new Date('2026-08-12T07:30:00+01:00'),arrivee:new Date('2026-08-12T11:15:00+03:00'),prix:640,places:42,classe:'Économique',escales:0,source:'simulation',statut:'programme'}})
  await Flight.findOrCreate({where:{numero_vol:'AF-1185'},defaults:{compagnie:'Air France',origine:'Tunis (TUN)',destination:'Paris (CDG)',depart:new Date('2026-08-12T10:20:00+01:00'),arrivee:new Date('2026-08-12T13:00:00+02:00'),prix:790,places:28,classe:'Économique',escales:0,source:'simulation',statut:'programme'}})
  await Flight.findOrCreate({where:{numero_vol:'EK-748'},defaults:{compagnie:'Emirates',origine:'Tunis (TUN)',destination:'Dubaï (DXB)',depart:new Date('2026-08-12T14:55:00+01:00'),arrivee:new Date('2026-08-13T04:10:00+04:00'),prix:1280,places:35,classe:'Économique',escales:1,source:'simulation',statut:'programme'}})
  console.log('Données de démonstration créées sans doublons.')
  console.log('Admin : admin@helmitravel.tn / admin123')
  console.log('Client : client@helmitravel.tn / client123')
} catch (error) {
  console.error('Échec du seeding :',error.message)
  process.exitCode=1
} finally {
  await sequelize.close()
}
