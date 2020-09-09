import 'dotenv/config';
import helixAuth from './HelixAuthenticator';
import axios from 'axios';

class SubscriptionManager {
  constructor() {
    this.resubIntervalDays = 0.5;
    this.subLeaseDays = 10;
    this.subapi = "https://api.twitch.tv/helix/webhooks/subscriptions?first=100";
    this.webhook = "https://api.twitch.tv/helix/webhooks/hub";
  }

  async getSubscriptions() {
    const opts = {
      method: 'get',
      url: this.subapi,
      headers: {
        Authorization: `Bearer ${await helixAuth.oAuthToken()}`,
        'Client-ID': `${process.env.CLIENTID}`
      }
    };
    try {
      const { data } = await axios(opts);
      this.subs = data.data || [];
      this.autoSubscriber();
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  autoSubscriber() {
    setInterval(async () => {
      console.log(`current topics: ${JSON.stringify(this.subs)}`);
      await this.checkAllSubscriptions();
    }, this.resubIntervalDays * 86400000);
  }

  async checkAllSubscriptions() {
    for (let i = 0; i < this.subs.length; i++) {
      if (this.shouldRenew(this.subs[i].expires_at)) {
        try {
          await this.renewSubscription(this.subs[i].topic, this.subs[i].callback);
          i = 0;
        } catch (err) {
          console.log(`SubscriptionManager: Failed to Renew subscription: ${this.subs[i].topic}`);
        }
      } else {
        console.log(`SubscriptionManager: Topic does not need renewal: ${this.subs[i].topic}`);
      }
    }
  }

  async renewSubscription(topic, callback) {
    console.log(`SubscriptionManager: Renewing topic ${topic}`);
    await this.unsubscribe(topic, callback);
    await new Promise((resolve, reject) => { setTimeout(() => { resolve() }, 2000) });
    await this.subscribe(topic, callback);
  }

  async unsubscribe(topic, callback) {
    const opts = {
      method: 'post',
      url: this.webhook,
      data: JSON.stringify({
        'hub.callback': callback,
        'hub.mode': 'unsubscribe',
        'hub.topic': topic,
        'hub.lease_seconds': this.subLeaseDays * 86400,
        'hub.secret': process.env.WEBHOOKSECRET
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await helixAuth.oAuthToken()}`,
        'Client-ID': `${process.env.CLIENTID}`
      }
    };
    try {
      await axios(opts);
      this.subs = this.subs.filter(el => el.topic != topic);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async subscribe(topic, callback) {
    if (!this.subs) return Promise.reject(new Error('Must call getSubscriptions prior to subscribing'));
    if (this.alreadySubscribed(topic)) return Promise.resolve();
    const opts = {
      method: 'post',
      url: this.webhook,
      data: JSON.stringify({
        'hub.callback': callback,
        'hub.mode': 'subscribe',
        'hub.topic': topic,
        'hub.lease_seconds': this.subLeaseDays * 86400,
        'hub.secret': process.env.WEBHOOKSECRET
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await helixAuth.oAuthToken()}`,
        'Client-ID': `${process.env.CLIENTID}`
      }
    };

    console.log(opts);
    try {
      await axios(opts);
      let expDate = new Date();
      expDate.setDate(expDate.getDate() + this.subLeaseDays);
      this.subs.push({
        topic,
        callback,
        expires_at: expDate.toISOString()
      });
      console.log(`SubscriptionManager: Subscribed to ${topic}`);
      return Promise.resolve();
    } catch (err) {
      console.log(`SubscriptionManager: failed to subscribe to topic ${topic}`);
      return Promise.reject(err);
    }
  }

  alreadySubscribed(topic) {
    for (const sub of this.subs) {
      if (sub.topic == topic) {
        console.log(`SubscriptionManager: Already Subscribed: ${topic}`)
        return true;
      }
    }
    return false;
  }

  shouldRenew(expDate) {
    // renew if half of the 10 day subscription period has expired
    let plusTen = new Date();
    plusTen.setDate(plusTen.getDate() + this.subLeaseDays);
    const timeLeftForRenewal = (plusTen - new Date()) / 2;
    return (new Date(expDate) - new Date() < timeLeftForRenewal);
  }
}

const subManager = new SubscriptionManager();
export default subManager;