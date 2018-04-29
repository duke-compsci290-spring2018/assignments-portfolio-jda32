<template>
  <div id="app">
    <div id="view_official">
        <b-dropdown id="ddown1" text="View Official Brackets" >
            <b-dropdown-item v-for="official in officials" v-on:click="sample(official.year)">{{official.year}}</b-dropdown-item>
        </b-dropdown>
        
    </div>
    <div id="minimal" v-on:click="sample($event)">
        <button>Yeet!</button>
    </div>
    <div id="bracket"></div>
    <div class="bracketology">
        <div class="left 64 bracket west">
        </div>
        <div class="left 32 bracket west">
        </div>
        <div class="left 16 bracket west">
        </div>
        <div class="left 8 bracket west">
        </div>
        <div class="left 4 bracket west">
        </div>
        <div class="left 2 bracket">
        </div>
        <div class="left 4 bracket east">
        </div>
        <div class="left 8 bracket east">
        </div>
        <div class ="left 16 bracket east">
        </div>
        <div class = "left 32 bracket east">
        </div>
        <div class="left 64 bracket east">
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
var officialRef = db.ref('Years')

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
  firebase:{
    officials: officialRef
  },
  methods: {
    sample: function(event){
        var i
        /*db.ref("users/Yeet").child('username').on('value', function(snap){
            console.log(snap.val())
        })
        db.ref("Years/2014").child('year').on('value', function(snap){
            console.log(snap.val())
        })*/
        db.ref("Years/" + event + "/finalfour").on('value', function(snap){
            snap.forEach(function(childSnapshot){
                childSnapshot.forEach(function(grandChildSnap){
                    grandChildSnap.forEach(function(championSnap){
                    var round = championSnap.child('round_of').val()
                        if(Number(grandChildSnap.key) === 0){
                            if(Number(championSnap.child('round_of').val()) === 4){
                                if(Number(championSnap.key) === 0){
                        
                                    $('.' + round + '.west').append($('<div class="even"><p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                                else{
                                    $('.' + round + '.west').append($('<div class="odd"><p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                            }
                            else{
                                if(Number(championSnap.key) === 0){
                                    
                                    $('.' + round).append($('<div class="even"<p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                                else{
                                    $('.' + round).append($('<div class="odd"><p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                            }
                        }
                        else{
                            if(Number(championSnap.key) === 0){
                                    $('.' + round + '.east').append($('<div class="even"><p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                                else{
                                    $('.' + round + '.east').append($('<div class="odd"><p>' + championSnap.child('team').val() + '</p></div>'))
                                }
                        }
                    })
                    
                })
            })
        })
        db.ref("Years/" + event + "/regions").on('value', function(snap){
            snap.forEach(function(childSnapshot){
                childSnapshot.forEach(function(grandChildSnap){
                    grandChildSnap.forEach(function(roundSnap){
                        roundSnap.forEach(function(gameSnap){
                            var round = gameSnap.child('round_of').val()
                            if(Number(childSnapshot.key) === 0 || Number(childSnapshot.key) === 1){
                                if(Number(gameSnap.key) === 0){
                                    $('.' + round + '.west').append($('<div class="even"><p>' + gameSnap.child('team').val() + '</p></div>'))
                                }
                                else{
                                    $('.' + round + '.west').append($('<div class="odd"><p>' + gameSnap.child('team').val() + '</p></div>'))
                                }
                            }
                            else{
                                if(Number(gameSnap.key) === 0){
                                    $('.' + round + '.east').append($('<div class="even"><p>' + gameSnap.child('team').val() + '</p></div>'))
                                }
                                else{
                                    $('.' + round + '.east').append($('<div class="odd"><p>' + gameSnap.child('team').val() + '</p></div>'))
                                }
                            }
                        })
                    })
                })
            })
        })
        /*
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
        /*for(i = 1; i<=2; i++){
            if(i % 2 === 0){
                $(".fifth").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".fifth").append($('<div class="odd">' + i + '</div>'))
            }
        }
        /*for(i = 1; i<=2; i++){
            if(i % 2 === 0){
                $(".sixth").append($('<div class="even">' + i + '</div>'))
            }
            else{
                $(".sixth").append($('<div class="odd">' + i + '</div>'))
            }
        }*/
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
}
.even{
    background-color: green;
}
.odd{
    background-color: red;
}
</style>
