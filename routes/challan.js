const express = require('express');
const router  = express.Router();
const { UserVehicle, VehicleChallan } = require('../models');
const { parsePagination, buildMeta } = require('../utils/pagination');

/**
 * GET /api/challan-data?page=1&limit=300
 * Returns challan data for ACTIVE vehicles of the authenticated client.
 * Pagination is over the client's active vehicles (max 300 per page).
 */
router.get('/', async (req, res) => {
  try {
    const clientId = req.client?.client_id ?? req.client?.id;
    if (!clientId) return res.status(401).json({ error: 'INVALID_TOKEN', message: 'client_id missing in token' });

    const { page, limit, offset } = parsePagination(req.query);

    const { count: total, rows: vehicles } = await UserVehicle.findAndCountAll({
      where: { client_id: clientId, status: 'active' },
      attributes: ['vehicle_number'],
      order: [['id', 'ASC']],
      limit,
      offset,
    });

    const vehicleNumbers = vehicles.map(v => v.vehicle_number).filter(Boolean);

    let data = [];
    if (vehicleNumbers.length) {
      data = await VehicleChallan.findAll({
        where: { client_id: clientId, vehicle_number: vehicleNumbers },
        order: [['vehicle_number', 'ASC']],
      });
    }

    res.json({
      meta: buildMeta({ page, limit, total }),
      data,
    });
  } catch (err) {
    console.error('[api/challan-data] error:', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
