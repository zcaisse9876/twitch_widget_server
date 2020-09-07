import Vue from 'vue';
import Router from 'vue-router';
import Chat from '@/views/chat/Chat';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chat',
      component: Chat
    }
  ]
});
