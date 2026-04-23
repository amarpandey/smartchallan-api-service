const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  parent_id:       { type: DataTypes.BIGINT,  allowNull: false, defaultValue: 0 },
  name:            { type: DataTypes.STRING,  allowNull: false },
  email:           { type: DataTypes.STRING,  allowNull: false, unique: true },
  password:        { type: DataTypes.STRING,  allowNull: false },
  status:          { type: DataTypes.STRING,  defaultValue: 'active' },
  account_type:    { type: DataTypes.STRING,  allowNull: false, defaultValue: 'trial' },
  last_login_at:   { type: DataTypes.DATE,    allowNull: true },
  created_at:      { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
  updated_at:      { type: DataTypes.DATE,    defaultValue: DataTypes.NOW },
}, {
  tableName: 'di_user',
  timestamps: false,
});
