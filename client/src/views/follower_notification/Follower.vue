<template lang="html">
  <div class="follower-cont">
    <transition name="fade" @after-leave="pullNextUser" @after-enter="hideNotification">
      <Notification v-if="current" :u-name="current"/>
    </transition>
  </div>
</template>

<script>
import Notification from './components/Notification';
import { Howl, Howler } from 'howler'; // eslint-disable-line
const io = require('socket.io-client');
let socket;
export default {
  components: {Notification},
  data () {
    return {
      current: undefined,
      followers: []
    };
  },
  mounted () {
    // Begin interval to pull users from queue
    this.pullNextUser();
    // Connect to socket at local server
    console.log(`Connecting to SocketIO server: ${process.env.SERVER}`);
    socket = io.connect(process.env.SERVER);
    socket.on('connect', (data) => {
      // Join follower room
      socket.emit('join', 'follower');
    });

    // listen to messages coming into chat
    socket.on('New Follower', (data) => {
      if (!data.follower) return;
      console.log(data);
      this.enqueueFollowers(data.follower);
    });

    this.test();
  },
  methods: {
    // Display a new message in the bottom of the chat window!
    enqueueFollowers(data) {
      this.followers = this.followers.concat(data.map(e => e.from_name));
    },
    async pullNextUser() {
      if (!this.followers.length) {
        await this.sleep(2000);
        return this.pullNextUser();
      }

      this.current = this.followers.shift();
      this.playSound('http://soundbible.com/mp3/Metroid_Door-Brandino480-995195341.mp3');
    },
    async hideNotification() {
      await this.sleep(2000);
      this.current = undefined;
    },
    sleep(time) {
      return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, time) });
    },
    async test() {
      await this.sleep(2000);
      this.followers = ['joe', 'sam', 'test'];
      await this.sleep(2000);
      this.followers = this.followers.concat(['1', '2', '3', '4', '5']);
      await this.sleep(30000);
      this.followers = this.followers.concat(['done1', 'done2']);
    },
    playSound(sound) {
      const audio = new Howl({
        src: [require('../../assets/sounds/Music_Box-Big_Daddy-1389738694.wav')]
      });
      audio.play();
    }
  }
};
</script>

<style lang="css">

.follower-cont {
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
