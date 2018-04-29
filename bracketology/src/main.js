import Vue from 'vue'

import VueFire from 'VueFire'
import App from './App.vue'
import * as d3 from 'd3'
import Flexbox from 'flexbox-vue'

import * as firebase from 'firebase'

Vue.use(Flexbox)

import 'expose-loader?$!expose-loader?jQuery!jquery'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.use(VueFire)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
    el: '#app',
    components:{
        App
    },
    template: '<App/>',
    render: h => h(App),
})

