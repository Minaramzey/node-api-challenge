const express = require('express');
const helmet = require('helmet');

// Routing
const projectRouter = require('./router/projectRouter');
const actionRouter = require('./router/actionRouter');
// const { logger } = require('./middleware/middleware');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(logger);
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);


server.get('/', (req, res) => {
    res.send(`<h1>Welcome To The Jungle</h1>`);
});

function logger(req, res, next) {
    console.log(`Method: ${req.method} 
    URL: ${req.originalUrl}`);
    next();
  }
module.exports = server;