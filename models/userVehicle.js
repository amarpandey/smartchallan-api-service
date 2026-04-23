const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('UserVehicle', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vehicle_number: { type: DataTypes.STRING,  allowNull: true },
  chasis_number:  { type: DataTypes.STRING,  allowNull: true },
  engine_number:  { type: DataTypes.STRING,  allowNull: true },
  client_id:      { type: DataTypes.INTEGER, allowNull: false },
  parent_id:      { type: DataTypes.INTEGER, allowNull: false },
  status:         { type: DataTypes.ENUM('active', 'inactive', 'deleted'), allowNull: false, defaultValue: 'active' },
  rto_data:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  challan_data:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  registered_at:  { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
  updated_at:     { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
}, {
  tableName: 'di_user_vehicle',
  timestamps: false,
});
