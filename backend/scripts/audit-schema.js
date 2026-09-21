import {sequelize} from '../config/database.js'
import '../models/index.js'

try{
  await sequelize.authenticate()
  const qi=sequelize.getQueryInterface();const tables=(await qi.showAllTables()).sort();let columns=0,indexes=0
  console.log(`Base : ${sequelize.getDatabaseName()}`)
  for(const table of tables){const definition=await qi.describeTable(table);const tableIndexes=await qi.showIndex(table);columns+=Object.keys(definition).length;indexes+=tableIndexes.length;console.log(`${table.padEnd(22)} ${String(Object.keys(definition).length).padStart(2)} colonnes | ${String(tableIndexes.length).padStart(2)} index`)}
  const [foreignKeys]=await sequelize.query(`SELECT COUNT(*) total FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()`)
  console.log(`Total : ${tables.length} tables, ${columns} colonnes, ${indexes} index, ${foreignKeys[0].total} clés étrangères.`)
}catch(error){console.error('Audit impossible :',error.message);process.exitCode=1}finally{await sequelize.close()}
