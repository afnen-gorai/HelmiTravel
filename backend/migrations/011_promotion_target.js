import {DataTypes} from 'sequelize'

export async function up({queryInterface,transaction}){
  const columns=await queryInterface.describeTable('Promotions')
  if(!columns.cible)await queryInterface.addColumn('Promotions','cible',{type:DataTypes.ENUM('tous','hotel','trip','flight','car'),allowNull:false,defaultValue:'tous'},{transaction})
}
