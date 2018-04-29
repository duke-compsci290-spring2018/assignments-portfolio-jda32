<template>
  <div id="app">
    <div id = "userdisplay">
        <h3>Current User: {{ currentUser.name}}</h3>
        <h3 v-if="currentUser.signedIn"> Current Email: {{ currentUser.email }}</h3>
        <h3 v-if="currentUser.admin"> You are an admin of this website. </h3>
    </div>
    <div id = "userControl">
        <div id = "newUserControl" v-if="!currentUser.signedIn">
            <input class="add-new-user" placeholder="New Username" v-model="newuser">
            <input class="add-new-user-email" placeholder="New Email" v-model="newemail">
            <input class="add-new-user-password" type="password" placeholder="New User Password" v-model="newpassword">
            <input class="add-new-user-password" type="password" placeholder="Confirm Password" v-model="confirmNewPassword">
            <button id="new-user" class="user-button" type="button" @click="newUser()">Sign Up</button>
            <p>Our website is currently unsecure. Do not use any passwords that contain sensitive information. AKA THIS PASSWORD CAN BE STOLEN</p>
        </div>
        <div id = "SignIn" v-if="!currentUser.signedIn">
            <input class="sign-in" placeholder="Sign In w/ Username" v-model="signinUser">
            <input class="sign-in" placeholder="Password" type="password" v-model="oldPassword">
            <button id="old-user" class="old-user-button" type="button" @click="signIn()">Sign In</button>
        </div>
        <div id = "SignIn" v-if="!currentUser.signedIn">
            <input class="sign-in" placeholder="Sign In w/ Email" v-model="signinEmail">
            <input class="sign-in" placeholder="Password" type="password" v-model="oldPasswordEmail">
            <button id="old-user" class="old-user-button" type="button" @click="signInEmail()">Sign In</button>
        </div>
        <div id = "SignOut" v-if="currentUser.signedIn">
            <button id="sign-out" class="sign-out" type="button" @click="signOut()">Sign Out</button>
        </div>
        <br>
        <br>
    </div>
    <div id="view_official">
        <b-dropdown id="ddown1" text="View Official Brackets" >
            <b-dropdown-item v-for="official in officials" v-on:click="sample(official.year)">{{official.year}}</b-dropdown-item>
        </b-dropdown>
        
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
var userRef = db.ref('users')
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
        },
        visibility: 'true',
        newitem: '',
        completed: 'false',
        
        neWcard: '',
        neWcardDueDate: '',
        neWcardDesc: '',
        newCardCat: '',
        updDueDate: '',
        newCateg:'',
        newCardPic:'',
        
        newuser: '',
        newemail: '',
        newpic: '',
        newpassword: '',
        confirmNewPassword: '',
        
        signinUser: '',
        signinEmail: '',
        oldPassword: '',
        oldPasswordEmail: '',
        
        changeUsername: '',
        changeEmail: '',
        
        color: "#ff0000",
        image: "",
        catColor: "#ff0000",
        
        oldCardPic:'',
        oldCardDesc:'',
        oldCardCat:'',
        
        newTask:'',
        newTaskItem:'',
        
        lists:'',
        moveThisCard:'',
        
        categorize:'Uncategorized',
        category:'All',
        
        
        currentUser:{
            name: "No one is logged in",
            email: "None",
            photo: "./data/no_pic.jpg",
            signedIn: false,
            id: -1,
            admin: false
        }
    }
  },
  firebase:{
    officials: officialRef,
    users: userRef
  },
  methods: {
    newUser(){
            var newU = this.newuser
            var newE = this.newemail
            var badpassword = 0
            var bademail = 0
            var baduser = 0
            if(this.newpassword !== this.confirmNewPassword){
                alert("Passwords do not match, re-enter passwords.")
                badpassword = 1
                return 0
            }
            if(this.newpassword === "" || this.newuser === "" || this.newemail === ""){
                alert("Please fill in all signup fields.")
                badpassword = 1
                return 0
            }
            if(this.isAlphaNumeric(this.newpassword) !== true || this.isAlphaNumeric(this.newuser) !== true){
                alert("Either password or username contains non-alphanumerics, please try again")
                badpassword = 1
                return 0
            }
            if(this.validateEmail(this.newemail) !== true){
                alert("Invalid Email Address")
                bademail = 1
                return 0
            }
            userRef.once('value', function(snap){
                snap.forEach(function(childSnap){
                    if(newU === childSnap.key){
                        baduser = 1
                        alert("This username already exists.")
                        return 0
                    }
                    if(newE === childSnap.child('email').val()){
                        bademail = 1
                        alert("This email is already registered under another user.")
                        return 0
                    }
                })
            })
            if(badpassword === 0 && bademail === 0 && baduser === 0){
                db.ref("users/" + newU).set({
                    username: this.newuser,
                    email: this.newemail,
                    password: this.newpassword,
                    admin: false
                })
                this.currentUser.name = this.newuser
                this.currentUser.email = this.newemail
                this.currentUser.signedIn = true
            }
        },
        // --- Function to sign in w/ username ---
        signIn(){
            var oldU = this.signinUser
            var oldP = this.oldPassword
            var found = 0
            var data = this
            userRef.once('value', function(snap){
                snap.forEach(function(childSnap){
                    if(oldU === childSnap.key && oldP === childSnap.child('password').val()){
                        console.log("Found")
                        found = 1
                        data.currentUser.name = childSnap.key
                        data.currentUser.email = childSnap.child('email').val()
                        data.currentUser.signedIn = 1
                        data.currentUser.admin = childSnap.child('admin').val()
                        return 0
                    }
                    else if(oldU === childSnap.key && oldP !== childSnap.child('password').val()){
                        alert("The password you entered is not the one listed in our files.")
                        found = 1
                        return 0
                    }
                })
            })
            if(found === 0){
                alert("We do not have the specified username in our files, please try again.")
                return 0
            }
            
        },
// --- Function to sign in w/ email ---
        signInEmail(){
            var oldU = this.signinEmail
            var oldP = this.oldPasswordEmail
            var found = 0
            var data = this
            userRef.once('value', function(snap){
                snap.forEach(function(childSnap){
                    if(oldU === childSnap.child('email').val() && oldP === childSnap.child('password').val()){
                        found = 1
                        data.currentUser.name = childSnap.key
                        data.currentUser.email = childSnap.child('email').val()
                        data.currentUser.signedIn = 1
                        data.currentUser.admin = childSnap.child('admin').val()
                        return 0
                    }
                    else if(oldU === childSnap.child('email').val() && oldP !== childSnap.child('password').val()){
                        alert("The password you entered is not the one listed in our files.")
                        found = 1
                        return 0
                    }
                })
            })
            if(found === 0){
                alert("We do not have the specified email associated with any registered username, please try again.")
                return 0
            }
        },
// --- Function to sign out ---
        signOut(){
            this.currentUser.name = "No one is logged in."
            this.currentUser.email = "None."
            this.currentUser.signedIn = false
            this.currentUser.admin = false
            this.oldPassword = ''
            this.oldPasswordEmail = ''
            this.signinUser = ''
            this.siginEmail = ''
        },
// --- Function to change Username ---
        updateUsername(){

        },
// --- Function to change email ---
        updateEmail(){
        },
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
        d3.select("body").style("background-color", "yellow").transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("yellow", "cyan")}).duration(5000)
        
    },
    
    //AlphaNumeric Code: https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript USER: Michael Martin-Smucker
    isAlphaNumeric: function(str) {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true
    },
    validateEmail: function(email){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
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
  font-size: 15px;
}
.even{
    background-color: green;
}
.odd{
    background-color: red;
}
</style>