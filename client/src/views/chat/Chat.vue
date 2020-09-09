<template lang="html">
  <div class="chat-cont">
    <div class="comment" v-for='(message, index) in messages' :key="`${index}-todo`">
      <message
        :u-color="message.context.color"
        :u-name="message.context['display-name']"
        :msg="message.msg"
        :badge-list="Object.keys(message.context.badges)">
      </message>
    </div>
  </div>
</template>

<script>
import Message from './components/Message';
const io = require('socket.io-client');
let socket;
let interval;
export default {
  components: {Message},
  data () {
    return {
      messages: []
    };
  },
  mounted () {
    // Init watcher to remove comments if they become too old
    console.log('hello!');
    interval = setInterval(() => {
      this.clearMessage();
    }, 1000);

    // Connect to socket at local server
    console.log(`Connecting to SocketIO server: ${process.env.SERVER}`);
    socket = io.connect(process.env.SERVER);
    socket.on('connect', (data) => {
      // Join chat room
      socket.emit('join', 'chat');
    });

    // listen to messages coming into chat
    socket.on('message', (data) => {
      console.log(data);
      data.ttl = this.getEpoch();
      this.appendMessage(data);
    });
  },
  beforeDestroy() {
    // Clear interval that checks for old messages
    clearInterval(interval);
  },
  methods: {
    // Display a new message in the bottom of the chat window!
    appendMessage(data) {
      data.msg.trim();
      // Don't allow messages longer than 60 characters, trim and add ... at the end
      if (data.msg.length > 60) data.msg = data.msg.substring(0, 100) + '...';
      // Don't allow more than 9 messages to be displayed at a time. remove the oldest
      if (this.messages.length > 9) this.messages.shift();
      // Display new message
      this.messages.push(data);
    },
    // Function called by interval
    clearMessage() {
      if (!this.messages.length) return;
      // If the oldest displayed message is older than 5 seconds, remove it
      if (this.getEpoch() - this.messages[0].ttl > 5) this.messages.shift();
    },
    // returns current time in epoch
    getEpoch() {
      return Math.round(Date.now() / 1000);
    }
  }
};
</script>

<style lang="css">

.chat-cont {
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  padding: 2em;
}

.comment {
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
