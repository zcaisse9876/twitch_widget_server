<template lang="html">
  <div class="noti-cont">
    <div class="text-box">
      <div class="text stroke">{{infuseMessage(uName)}}</div>
    </div>
    <div class="text-box">
      <div class="text">{{infuseMessage(uName)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    uName: {
      type: String,
      default: undefined
    }
  },
  methods: {
    infuseMessage(name) {
      return `${name} followed the channel!`;
    }
  }
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Rubik");

.noti-cont {
  width: 100%;
  background-color: transparent;
  position: relative;
  width: 100%;
  height: 100%;
}

.text-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stroke {
  -webkit-text-stroke: .22em black;
}

.text {
  color: white;
  font-weight: 900;
  font-size: 4em;
  font-family: 'Rubik';
  letter-spacing: 1px;
  display: flex;
  align-items: flex-start;
}
</style>
