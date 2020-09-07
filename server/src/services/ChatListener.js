import 'dotenv/config';
import tmi from 'tmi.js';

const opts = {
  identity: {
    username: process.env.CHAT_USERNAME,
    password: process.env.CHAT_OATH
  },
  channels: [
    process.env.STREAM
  ]
};

/**
 * Class for establishing open connection with twitch and listen for all incoming chat messages for a stream
 */
class ChatListener {
  constructor() {
    this.client = new tmi.client(opts);
    this.client.on('message', (target, context, msg, self) => { this.broadcastMessageHandler(target, context, msg, self); });
    this.client.on('connected', this.onConnectedHandler);
    this.client.connect();
  }

  /**
   * prints info about the connection established with twitch
   * @param {String} addr
   * @param {Number} port
   */
  onConnectedHandler(addr, port) {
    console.log(`Chat listener connected to ${addr}:${port}`);
  }

  /**
   * configure: sets up the listener to communicate over socketIO
   * @param {Object} info with members room and io. io is the socket io object for sending messages. room is the chat room to send messages to. 
   */
  configure(info) {
    if (!info.room || !info.io) return;
    this.io = info.io;
    this.room = info.room;
  }

  /**
   * receives message and broadcasts it to all connected sockets in a room.
   * @param {String} target who the chat message was intended for
   * @param {Object} context an object containing all relevant information about the chat message
   * @param {String} msg the message received in chat
   * @param {Boolean} self if the message is from the current user set with TMI.
   */
  broadcastMessageHandler(target, context, msg, self) {
    if (self || !this.io || !this.room) return;
    this.io.to(this.room).emit('message', {msg, context});
  }
}

const chatListener = new ChatListener();
// Export single instance of class. This sends messages to a websocket "room".
// Any application can receive the chat messages through the room after this is set up by joining the room that this is broadcasting to.
export default chatListener;
