import {DataTypes} from 'sequelize'
export async function up({queryInterface}){
  const columns=await queryInterface.describeTable('payments')
  const additions={provider_payment_id:{type:DataTypes.STRING,allowNull:true},provider_capture_id:{type:DataTypes.STRING,allowNull:true},provider_amount:{type:DataTypes.DECIMAL(12,2),allowNull:true},provider_currency:{type:DataTypes.STRING(3),allowNull:true},idempotency_key:{type:DataTypes.STRING,allowNull:true},refunded_amount:{type:DataTypes.DECIMAL(12,2),allowNull:false,defaultValue:0},refund_status:{type:DataTypes.ENUM('aucun','partiel','total','echec'),allowNull:false,defaultValue:'aucun'},failure_reason:{type:DataTypes.TEXT,allowNull:true},provider_metadata:{type:DataTypes.JSON,allowNull:true}}
  for(const [name,definition] of Object.entries(additions))if(!columns[name])await queryInterface.addColumn('payments',name,definition)
  const indexes=await queryInterface.showIndex('payments')
  for(const [field,name] of [['provider_payment_id','uq_payments_provider_id'],['provider_capture_id','uq_payments_capture_id'],['idempotency_key','uq_payments_idempotency']])if(!indexes.some(x=>x.name===name))await queryInterface.addIndex('payments',[field],{name,unique:true})
}
