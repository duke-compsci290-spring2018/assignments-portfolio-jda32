<template>
  <div id="app">
    <div id="minimal" v-on:click="sample($event)">
        <button>Yeet!</button>
    </div>
    <div id="bracket"></div>
    <div class="bracketology">
        <div class="left second bracket">
        </div>
        <div class="left third bracket">
        </div>
        <div class="left fourth bracket">
        </div>
        <div class="left fifth bracket">
        </div>
        <div class="left sixth bracket">
        </div>
        <div class="left fifth bracket">
        </div>
        <div class ="left fourth bracket">
        </div>
        <div class = "left third bracket">
        </div>
        <div class="left second bracket">
        </div>
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
        var i
        for(i = 1; i<=16; i++){
            if(i % 2 === 0){
                $(".second").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".second").append($('<div class="odd">' + i + '</div>'))
            }
        }
        for(i = 1; i<=8; i++){
            if(i % 2 === 0){
                $(".third").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".third").append($('<div class="odd">' + i + '</div>'))
            }
        }
        for(i = 1; i<=4; i++){
            if(i % 2 === 0){
                $(".fourth").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".fourth").append($('<div class="odd">' + i + '</div>'))
            }
        }
        for(i = 1; i<=2; i++){
            if(i % 2 === 0){
                $(".fifth").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".fifth").append($('<div class="odd">' + i + '</div>'))
            }
        }
        for(i = 1; i<=2; i++){
            if(i % 2 === 0){
                $(".sixth").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".sixth").append($('<div class="odd">' + i + '</div>'))
            }
        }
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
.bracketology{
    display:flex;
    align-items: center;
}
.bracket {
  display: flex;
  background-color: Purple;
  flex-direction: column;
  width: 10%;
}
.left{
    float: left;
}
.right{
    float: right;
}


.bracket > div {
  margin: 10px;
  padding: 20px;
  font-size: 30px;
}
.even{
    background-color: green;
}
.odd{
    background-color: red;
}
</style>
