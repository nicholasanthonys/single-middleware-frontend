import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router/routes'


/* for form validation */
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate';

import store from './store'
import {email, required} from "vee-validate/dist/rules";
import './quasar'

import VJsoneditor from 'v-jsoneditor'
Vue.component('ValidationObserver', ValidationObserver)

Vue.component('ValidationProvider', ValidationProvider)

Vue.use(Vuex);


Vue.use(VJsoneditor)

Vue.config.productionTip = false

extend('email', email)

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'The password confirmation does not match.',
  params: [{ name: 'other', isTarget: true }],
})

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('min', {
  validate(value, args) {
    return value.length >= args.length;
  },
  params: ['length']
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
