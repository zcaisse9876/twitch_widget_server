// import dependencies
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import chatListener from './services/ChatListener';
import subManager from './services/SubscriptionManager';

// create express app;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// set up app to use dependencies
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

const rooms = {
  chat: 'chat',
  follower: 'follower'
};

app.post('/followershook', (req, res) => {
  if (!req.body.data || !req.body.data.length) return res.sendStatus(200);
  console.log(`received a follow notification! ${JSON.stringify(req.body.data[0])}`);
  const notifications = req.body.data;
  io.to(rooms.follower).emit('New Follower', { follower: notifications });
  return res.sendStatus(200);
});

app.get('/followershook', (req, res) => {
  console.log(`Received request for subscription: ${JSON.stringify(req.query)}`);
  if (!req.query['hub.challenge']) return res.sendStatus(404);
  return res.status(200).send(req.query['hub.challenge']);
});

// set up twitch stuff
chatListener.configure({room: rooms.chat, io: io});
subManager.getSubscriptions()
  .then(async () => {
    try {
      await subManager.subscribe('https://api.twitch.tv/helix/users/follows?first=1&to_id=578847433' ,'http://justservicestho.com/followershook');
    } catch (err) {
      console.log(err);
    }
  })
  .catch((err) => {
    console.log('Failed to get subscriptions', err);
  });

// set up socket connection behavior
io.on('connection', (client) => {
  client.on('join', (room) => {
    console.log(`External application joining room: ${room}`);
    client.join(room);
  });
});

// client is listening on port 8080
server.listen(process.env.PORT || 8081);