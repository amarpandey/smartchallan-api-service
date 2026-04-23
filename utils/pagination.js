require('dotenv').config();

const MAX_LIMIT     = parseInt(process.env.MAX_PAGE_LIMIT, 10)     || 300;
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 100;

/**
 * Parses page/limit from req.query and clamps to safe bounds.
 * limit is capped at MAX_LIMIT (default 300). page starts at 1.
 */
function parsePagination(query) {
  let page  = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page)  || page  < 1) page  = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildMeta({ page, limit, total }) {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
}

module.exports = { parsePagination, buildMeta, MAX_LIMIT, DEFAULT_LIMIT };
