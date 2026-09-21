import {sequelize} from '../config/database.js'
import '../models/index.js'
import * as migration001 from '../migrations/001_indexes_and_constraints.js'
import * as migration002 from '../migrations/002_destination_geo_gallery.js'
import * as migration003 from '../migrations/003_hotel_features_geo.js'
import * as migration004 from '../migrations/004_trip_details.js'
import * as migration005 from '../migrations/005_car_rental.js'
import * as migration006 from '../migrations/006_flight_simulation.js'
import * as migration007 from '../migrations/007_unified_orders.js'
import * as migration008 from '../migrations/008_payment_gateways.js'
import * as migration009 from '../migrations/009_notification_preferences.js'
import * as migration010 from '../migrations/010_security_hardening.js'
import * as migration011 from '../migrations/011_promotion_target.js'

const migrations=[['001_indexes_and_constraints',migration001],['002_destination_geo_gallery',migration002],['003_hotel_features_geo',migration003],['004_trip_details',migration004],['005_car_rental',migration005],['006_flight_simulation',migration006],['007_unified_orders',migration007],['008_payment_gateways',migration008],['009_notification_preferences',migration009],['010_security_hardening',migration010],['011_promotion_target',migration011]]
try{
  await sequelize.authenticate()
  await sequelize.sync()
  const qi=sequelize.getQueryInterface()
  await sequelize.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(190) NOT NULL PRIMARY KEY,
    executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  const [rows]=await sequelize.query('SELECT name FROM schema_migrations')
  const completed=new Set(rows.map(x=>x.name))
  for(const [name,migration] of migrations){
    if(completed.has(name)){console.log(`Migration déjà appliquée : ${name}`);continue}
    const transaction=await sequelize.transaction()
    try{await migration.up({queryInterface:qi,sequelize,transaction});await sequelize.query('INSERT INTO schema_migrations (name) VALUES (?)',{replacements:[name],transaction});await transaction.commit();console.log(`Migration appliquée : ${name}`)}catch(error){await transaction.rollback();throw error}
  }
  const tables=await qi.showAllTables()
  console.log(`Schéma synchronisé : ${tables.length} tables disponibles.`)
}catch(error){console.error('Échec de la migration :',error.message);process.exitCode=1}finally{await sequelize.close()}
