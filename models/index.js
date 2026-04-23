const sequelize = require('../config/db');

const User           = require('./user')(sequelize);
const UserVehicle    = require('./userVehicle')(sequelize);
const VehicleRTOData = require('./vehicleRtoData')(sequelize);
const VehicleChallan = require('./vehicleChallan')(sequelize);

module.exports = { sequelize, User, UserVehicle, VehicleRTOData, VehicleChallan };
