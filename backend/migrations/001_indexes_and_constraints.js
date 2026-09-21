const indexes=[
  ['hotels',['destination_id'],'idx_hotels_destination'],['rooms',['hotel_id'],'idx_rooms_hotel'],['trips',['destination_id'],'idx_trips_destination'],
  ['bookings',['user_id'],'idx_bookings_user'],['bookings',['hotel_id'],'idx_bookings_hotel'],['bookings',['trip_id'],'idx_bookings_trip'],['bookings',['room_id','date_arrivee','date_depart'],'idx_bookings_availability'],['bookings',['status'],'idx_bookings_status'],
  ['payments',['booking_id'],'uq_payments_booking',true],['reviews',['user_id','hotel_id'],'uq_reviews_user_hotel',true],['reviews',['user_id','trip_id'],'uq_reviews_user_trip',true],
  ['favorites',['user_id','type','item_id'],'uq_favorites_user_item',true],['notifications',['user_id','lue'],'idx_notifications_user_read'],['auth_tokens',['user_id','type','revoked_at'],'idx_auth_tokens_session'],['audit_logs',['user_id','created_at'],'idx_audit_user_date']
]

export async function up({queryInterface}){
  const tables=new Set((await queryInterface.showAllTables()).map(x=>typeof x==='string'?x:x.tableName))
  for(const [table,fields,name,unique=false] of indexes){if(!tables.has(table))continue;const current=await queryInterface.showIndex(table);if(!current.some(x=>x.name===name))await queryInterface.addIndex(table,fields,{name,unique})}
}
