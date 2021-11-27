# Freemius Node SDK
This SDK is a wrapper for accessing the [Freemius API](https://freemius.docs.apiary.io/). It handles the endpoint's path and authorization signature generation.

As a plugin or theme developer using Freemius, you can access your data via the `app`, `developer`, `plugin`, or `user` scope. 
If you only need to access one product, we recommend using the `plugin` scope. You can get the product's credentials in *SETTINGS -> Keys*.
If you need to access multiple products, use the `developer` scope. To get your credentials, click on *My Profile* at the top right menu and you'll find it in the *Keys* section.

Run `npm i https://github.com/Freemius/freemius-node-sdk` to install dependencies.

Basic SDK usage.

```javascript
  const Freemius = require('./Freemius');
  const FS__API_SCOPE = 'developer';
  const FS__API_DEV_ID = 1234;
  const FS__API_PUBLIC_KEY = 'pk_YOUR_PUBLIC_KEY';
  const FS__API_SECRET_KEY = 'sk_YOUR_SECRET_KEY';

  // Init SDK
  const developer = new Freemius(FS__API_SCOPE, FS__API_DEV_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

  // Get specific plugin details
  developer.Api('/plugins/' + plugin_id + '.json', 'GET', [], [], function (e) {
    console.log('Request URL: ' + developer.requestURL);
    console.log(JSON.parse(e));
  });
```

This will output a response from the Freemius API: (specific data removed for security reasons)

```
Request URL: /v1/developers/1234/plugins/1234.json
 {
  parent_plugin_id: null,
  developer_id: '1234',
  install_id: '1234567',
  slug: 'my-plugin-slug',
  title: 'Plugin Title',
  environment: 0,
  icon: '',
  default_plan_id: '1234',
  plans: '1234,5678',
  features: '1234, 1234, 1234',
  money_back_period: 15,
  refund_policy: 'strict',
  annual_renewals_discount: null,
  renewals_discount_type: '',
  is_released: true,
  is_pricing_visible: true,
  is_wp_org_compliant: true,
  is_off: false,
  is_only_for_new_installs: false,
  installs_limit: null,
  installs_count: 100,
  active_installs_count: 96,
  free_releases_count: 1,
  premium_releases_count: 1,
  total_purchases: 0,
  total_subscriptions: 0,
  total_renewals: 0,
  earnings: 0,
  commission: '',
  accepted_payments: 0,
  plan_id: '0',
  type: 'plugin',
  secret_key: 'sk_*****************************',
  public_key: 'pk_*****************************',
  id: '1234',
  created: '2019-12-22 10:52:11',
  updated: '2020-01-14 16:14:41',
  helpscout_secret_key: '123456789012345678901234567890912'
}
```

There are a series of examples for all API scopes to help you get started in `./examples`. Before these can be run you'll need to enter your Freemius IDs and keys in `./examples/keys.js`. Then the examples can be run by entering:

```javascript
  node ./examples/app-examples.js
  node ./examples/developer-examples.js
  node ./examples/plugin-examples.js
  node ./examples/user-examples.js
```

Not all the examples are run by default. Open up each example file and enable the ones you want to run.

Note: Only `developer-examples.js` currently contain working examples.
