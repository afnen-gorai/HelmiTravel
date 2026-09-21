import {DataTypes} from 'sequelize'

export async function up({queryInterface,transaction}){
  const columns=await queryInterface.describeTable('audit_logs')
  if(!columns.request_id)await queryInterface.addColumn('audit_logs','request_id',{type:DataTypes.UUID,allowNull:true},{transaction})
  if(!columns.duration_ms)await queryInterface.addColumn('audit_logs','duration_ms',{type:DataTypes.INTEGER,allowNull:true},{transaction})
  const indexes=await queryInterface.showIndex('audit_logs')
  if(!indexes.some(index=>index.name==='idx_audit_logs_request_id'))await queryInterface.addIndex('audit_logs',['request_id'],{name:'idx_audit_logs_request_id',transaction})
}
