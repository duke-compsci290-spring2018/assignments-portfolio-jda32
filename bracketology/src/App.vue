<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <div id="minimal" v-on:click="sample($event)">
        <button>Yeet!</button>
    </div>
    <div id="bracket"></div>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <div class="flex-container">
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>

  </div>
</template>


<script>
var firebase = require('firebase')
// Load expose-loader such that I can use jQuery within vue
console.log()
var config = {
    apiKey: "AIzaSyCVzFAh--3WNTrUmR21C-TsxdhUdBp6PIk",
    authDomain: "bracketology-dd459.firebaseapp.com",
    databaseURL: "https://bracketology-dd459.firebaseio.com",
    projectId: "bracketology-dd459",
    storageBucket: "bracketology-dd459.appspot.com",
    messagingSenderId: "48478220972"
  }
var db = firebase.initializeApp(config).database()
export default {
  name: 'app',
  data () {
    return {
        msg: 'Welcome to Your Vue.js App',
        minimalData: {
            teams : [
            ["Team 1", "Team 2"], /* first matchup */
            ["Team 3", "Team 4"]  /* second matchup */
            ],
            results : [
            [[1,2], [3,4]],       /* first round */
            [[4,6], [2,1]]        /* second round */
            ]
        }
    }
  },
  methods: {
    sample: function(event){
        
        d3.select("body").style("background-color", "yellow").transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("yellow", "cyan")}).duration(5000)
        
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.flex-container {
  display: flex;
  background-color: Purple;
  flex-direction: column;
}

.flex-container > div {
  background-color: #f1f1f1;
  margin: 10px;
  padding: 20px;
  font-size: 30px;
}
</style>
