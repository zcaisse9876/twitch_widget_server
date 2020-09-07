<template lang="html">
  <div class="message-cont">
      <div class="badge" v-for="(b, i) of badgeList" :key="`${i}-badge`">
        <img class="icon" :src="badges[b.toLowerCase()]"/>
      </div>
      <div class="msg-title-cont">
        <div class="msg-title text stroke" :style="{'color': this.uColor}">{{`${this.uName}:`}}</div>
        <div style="position: absolute;" class="msg-title text" :style="{'color': this.uColor}">{{`${this.uName}:`}}</div>
      </div>
      <div class="msg-body-cont">
        <div class="msg-body text stroke">{{` ${this.msg}`}}</div>
        <div style="position: absolute;" class="msg-body text">{{` ${this.msg}`}}</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    uColor: {
      type: String,
      default: '#000000'
    },
    mColor: {
      type: String,
      default: '#000000'
    },
    uName: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    },
    badgeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      badges: {
        premium: 'https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/3',
        broadcaster: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3',
        staff: 'https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/3',
        moderator: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3',
        verified: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3',
        vip: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3',
        admin: 'https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/3',
        turbo: 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/3'
      }
    };
  }
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Rubik");

.message-cont {
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: row;
}

.text {
  font-weight: 900;
  font-size: 4em;
  font-family: 'Rubik';
  letter-spacing: 1px;
  display: flex;
  align-items: flex-start;
}

.badge {
  display: flex;
  align-items: flex-start;
  padding: .5em;
}

.icon {
  width: 4.4em;
  height: auto;
}

.msg-title {
  border-radius: .3em;
  padding-left: .5em;
  padding-right: .5em;
}

.msg-title-cont {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.msg-body-cont {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.stroke {
  -webkit-text-stroke: .22em black;
}

.msg-body {
  color: white;
  word-wrap: break-word;
  word-break: break-all;
  padding-right: 1em;
}
</style>
