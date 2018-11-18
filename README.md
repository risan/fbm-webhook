# Facebook Messenger Webhook

[![Build Status](https://flat.badgen.net/travis/risan/fbm-webhook)](https://travis-ci.org/risan/fbm-webhook)
[![Test Coverage](https://flat.badgen.net/codeclimate/coverage/risan/fbm-webhook)](https://codeclimate.com/github/risan/fbm-webhook)
[![Maintainability](https://flat.badgen.net/codeclimate/maintainability/risan/fbm-webhook)](https://codeclimate.com/github/risan/fbm-webhook)
[![Latest Stable Version](https://flat.badgen.net/npm/v/fbm-webhook)](https://www.npmjs.com/package/fbm-webhook)
[![Node Version](https://flat.badgen.net/npm/node/fbm-webhook)](https://www.npmjs.com/package/fbm-webhook)
[![Code Style: Prettier](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/prettier/prettier)
[![License](https://flat.badgen.net/npm/license/fbm-webhook)](https://github.com/risan/fbm-webhook/blob/master/LICENSE)

Facebook Messenger webhook middleware for Express.

## Installation

```bash
$ npm install fbm-webhook

# Or if you use Yarn
$ yarn add fbm-webhook
```

## Quick Start

Add `fbm-webhook` middleware into your existing Express app:

```js
const express = require("express");
const fbmWebhook = require("fbm-webhook");

const app = express();
const webhook = fbmWebhook({
  appSecret: "Your Facebook App Secret",
  verifyToken: "Your Predefined Verify Token"
});

app.use("/webhook", webhook);

// Listen to the message received event.
webhook.on("message", event => {
  console.log(`Sender id: ${event.sender.id}`);
  console.log(`Message: ${event.message}`);
});

// Listen to the message read event.
webhook.on("read", event => console.log(event));

app.listen(3000, () => console.log("Server is running on port: 3000"));
```

The `fbm-webhook` middleware will register two endpoints:

* `GET /webhook`: For webhook URL verification.
* `POST /webhook`: The actual webhook that will receive events data from the Facebook Messenger.

The `verifyToken` is your own predefined secret. It's the one that will be used by Facebook to verify your webhook URL.

Check all supported [webhook events](#webhook-events).

## Recipe

### Store App Secret and Verify Token as Environment Variables

By default, `fbm-webhook` will look for `FB_APP_SECRET` and `FB_VERIFY_TOKEN` on the environment variables. If you set these environment variable, you don't have to pass anything:

```js
const fbmWebhook = require("fbm-webhook");

const webhook = fbmWebhook();

// Is equal to
const webhook = fbmWebhook({
  appSecret = process.env.FB_APP_SECRET,
  verifyToken = process.env.FB_VERIFY_TOKEN
});
```

And if you use another name:

```js
const fbmWebhook = require("fbm-webhook");

const webhook = fbmWebhook({
  appSecret = process.env.MY_APP_SECRET,
  verifyToken: process.env.MY_VERIFY_TOKEN
});
```

### Use Different Endpoints

```js
const express = require("express");
const fbmWebhook = require("fbm-webhook");

const app = express();
const webhook = fbmWebhook();

app.use("/foobar", webhook);
```

Your webhook endpoints will be:

* `GET /foobar`: For webhook verification.
* `POST /foobar`: The actual webhook handler.

### Listen to All Types of Event

```js
const express = require("express");
const fbmWebhook = require("fbm-webhook");

const app = express();
const webhook = fbmWebhook();

app.use("/webhook", webhook);

// Listen to all types of event.
webhook.on("data", event => console.log(event));

app.listen(3000, () => console.log("Server is running on port: 3000"));
```

### Disable Request Signature Verification

By default, `fbm-webhook` will look for the `X-Hub-Signature` header on all incoming webhook. It will verify this request signature using your `appSecret`. You can disable this verification process by passing a false value to `appSecret` (it's not recommended though).

```js
const fbmWebhook = require("fbm-webhook");

const webhook = fbmWebhook({ appSecret: false });
```

### Run as Standalone Express Application

You can instantiate `fbm-webhook` as an Express application too:

```js
const fbmWebhook = require("fbm-webhook");

const webhook = fbmWebhook({ path: "/webhook" });

// Listen to the message received event.
webhook.on("message", event => {
  console.log(`Sender id: ${event.sender.id}`);
  console.log(`Message: ${event.message}`);
});

webhook.listen(3000, () => console.log("Server is running on port: 3000"));
```

## Webhook Events

| Event Type | Messenger Subscription Field | Documentation |
| -- | -- | -- |
| `message` | `messages` | [Message recevied events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received) |
| `echo` | `message_echoes` | [Message Echo events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo) |
| `account-linking` | `messaging_account_linking` | [Account Linking events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking) |
| `checkout-update` | `messaging_checkout_updates` | [Checkout Update events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/checkout-update) |
| `delivered` | `message_deliveries` | [Message Delivered events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered) |
| `game-play` | `messaging_game_plays` | [Instant Game events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_game_plays/) |
| `optin` | `messaging_optins` | [Plugin Opt-in events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_optins) |
| `payment` | `messaging_payments` | [Payment events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/payment) |
| `policy-enforcement` | `messaging_policy_enforcement` | [Policy Enforcement events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/policy-enforcement) |
| `postback` | `messaging_postbacks` | [Postback Received events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received) |
| `pre-checkout` | `messaging_pre_checkouts` | [Payment Pre-checkout events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_pre_checkouts) |
| `read` | `message_reads` | [Message Read events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read) |
| `referral` | `messaging_referrals` | [Referral events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/referral) |
| `standby` | `standby` | [Handover Protocol Standby Channel events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/standby) |
| `handover.app-roles` | `messaging_handovers` | [Handover Protocol assign app roles events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_handovers#app_roles) |
| `handover.pass-thread-control` | `messaging_handovers` | [Handover Protocol pass thread control events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_handovers#pass_thread_control) |
| `handover.take-thread-control` | `messaging_handovers` | [Handover Protocol take thread control events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_handovers#take_thread_control) |
| `handover.request-thread-control` | `messaging_handovers` | [Handover Protocol request thread control events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_handovers#request_thread_control) |
| `unknown` | | Other event types not listed above |
| `data` | | Listen to all type of events |

## API

### `fbmWebhook`

```js
fbmWebhook([{
  path = "/",
  appSecret = process.env.FB_APP_SECRET,
  verifyToken = process.env.FB_VERIFY_TOKEN
}])
```

#### Parameters

* `path` (optional `String`): The webhook route prefix, default to `/`.
* `appSecret` (optional `String`): Your Facebook App Secret, default to `process.env.FB_APP_SECRET`.
* `verifyToken` (optional `String`): Your own predefined verify token. Used by Facebook to verify webhook URL, default to `process.env.FB_VERIFY_TOKEN`.

#### Return

It returns an [Express application](https://expressjs.com/en/4x/api.html#app) instance.

### `fbmWebhook.on`

Listen to a webhook event.

```js
fbmWebhook.on(eventType, callback);
```

#### Parameters

* `eventType` (`String`): The [webhook event](#webhook-events) to listen to.
* `callback` (`Function`): The callback function to call, it will receive the `event` payload sent by the Messenger platform.

## Related

* [fbm-send](https://github.com/risan/fbm-send): Module for sending message through Facebook Messenger Send API.

## License

MIT © [Risan Bagja Pradana](https://bagja.net)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
