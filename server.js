require('dotenv').config();
const fs      = require('fs');
const http    = require('http');
const https   = require('https');
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');

const { sequelize } = require('./models');
const validateClient = require('./middleware/validateClient');

const authRouter    = require('./routes/auth');
const rtoRouter     = require('./routes/rto');
const challanRouter = require('./routes/challan');

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://server.driveinnovate.in' }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/ping', (_req, res) => res.json({ status: 'ok', service: 'sc-api-server' }));

app.use('/auth', authRouter);

app.use('/api', validateClient);
app.use('/api/rto-data',     rtoRouter);
app.use('/api/challan-data', challanRouter);

app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

const PORT = process.env.PORT || 4001;

sequelize.authenticate()
  .then(() => console.log('[db] connected'))
  .catch(err => console.error('[db] connection failed:', err.message));

const { SSL_KEY, SSL_CERT, SSL_CA } = process.env;

function loadSslOptions() {
  if (!SSL_KEY || !SSL_CERT) return null;
  try {
    const options = {
      key:  fs.readFileSync(SSL_KEY),
      cert: fs.readFileSync(SSL_CERT),
    };
    if (SSL_CA) options.ca = fs.readFileSync(SSL_CA);
    return options;
  } catch (err) {
    console.error('[ssl] failed to load certificates, falling back to HTTP:', err.message);
    return null;
  }
}

const sslOptions = loadSslOptions();

if (sslOptions) {
  https.createServer(sslOptions, app)
    .listen(PORT, () => console.log(`sc-api-server listening on ${PORT} (https)`));
} else {
  http.createServer(app)
    .listen(PORT, () => console.log(`sc-api-server listening on ${PORT} (http)`));
}
