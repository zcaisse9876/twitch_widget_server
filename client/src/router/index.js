import Vue from 'vue';
import Router from 'vue-router';
import Chat from '@/views/chat/Chat';
import Follower from '@/views/follower_notification/Follower';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/chat',
      component: Chat
    },
    {
      path: '/follower',
      component: Follower
    }
  ]
});
