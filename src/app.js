/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import routes from './routes/index';
import socketEvents from './controllers/socketController';
import workerService from './services/workerService';
import mailingService from './services/mailingService';

// import logger from '../logger';

require('dotenv').config();

const app = express();

const corsOptions = {
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));
// Parse incoming requests data
app.use('/api/v1/jobs/promote/stripe-webhook', bodyParser.raw({ type: '*/*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
const port = process.env.PORT || 4040;
const http = require('http');

workerService.runBulkRegistration();
// workerService.runBulkWeeklyJobs();
const server = http.createServer(app);

const cron = require('node-cron');

// cron.schedule('0 10 * * THU', () => {
// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
//   mailingService.sendActiveJobs();
// });

// Socket setup
global.io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]  
  },
});
socketEvents();

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});

export default app;
