// import dependencies
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import chatListener from './services/ChatListener';

// create express app;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// set up app to use dependencies
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.get('/todo', (req, res) => {
    res.send([
        'Thing 1',
        'Thing 2',
    ]);
});

// set up twitch stuff
chatListener.configure({room: 'chat', io: io});

// set up socket connection behavior
io.on('connection', (client) => {
  client.on('join', (room) => {
    console.log(`External application joining room: ${room}`);
    client.join(room);
  });
});

// client is listening on port 8080
server.listen(process.env.PORT || 8081);