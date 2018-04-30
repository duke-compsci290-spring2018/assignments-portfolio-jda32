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
        <div id = "adminControls" v-if="currentUser.admin">
            <b-dropdown id="ddown1" text="Delete a user">
                <b-dropdown-item v-for="user in users" v-if="user.username != currentUser.name">{{user.username}}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="ddown1" text="Make a User an Admin">
                <b-dropdown-item v-for="user in users" v-if="user.username != currentUser.name">{{user.username}}</b-dropdown-item>
            </b-dropdown>
            <button id="export" type="button" @click="exportData()">Export Data</button>
        </div>
        <br>
        <br>
    </div>
    <div id="view_official">
        <b-dropdown id="ddown1" text="View Official Brackets" >
            <b-dropdown-item v-for="official in officials" v-on:click="sample(official.year, 1)">{{official.year}}</b-dropdown-item>
        </b-dropdown> 
        <br>
        <br>
        <p v-if="currentUser.signedIn"> Create a randomized bracket for any given year. Input a bracket name and then click on the year you want. </p>
        <input v-if="currentUser.signedIn" class="create-bracket" placeholder="Custom Bracket Name" v-model="customBracketName">
        <b-dropdown id="ddown1" text="Create A Bracket" v-if="currentUser.signedIn">
            <b-dropdown-item v-for="official in officials" v-on:click="sample(official.year, 0)">{{official.year}}</b-dropdown-item>
        </b-dropdown>
        <br>
        <br>
        <b-dropdown id="ddown1" text="Make An Official Bracket" v-if="currentUser.admin">
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
    <div class="createBracket">
        <div class="newleft 64 bracket newwest">
        </div>
        <div class="newleft 32 bracket newwest">
        </div>
        <div class="newleft 16 bracket newwest">
        </div>
        <div class="newleft 8 bracket newwest">
        </div>
        <div class="newleft 4 bracket newwest">
        </div>
        <div class="newleft 2 bracket">
        </div>
        <div class="newleft 4 bracket neweast">
        </div>
        <div class="newleft 8 bracket neweast">
        </div>
        <div class ="newleft 16 bracket neweast">
        </div>
        <div class = "newleft 32 bracket neweast">
        </div>
        <div class="newleft 64 bracket neweast">
        </div>
    </div>
    <br>
    <div class="statistics">
        <table id="winloss">
        </table>
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
        customBracketName: '',
        
        signinUser: '',
        signinEmail: '',
        oldPassword: '',
        oldPasswordEmail: '',
        
        probArray: '',
        
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
  mounted: function(){
    var ref = this
    this.$nextTick(function(){
        var sDataArray = this.MultiDimensionalArray(16,16)
        db.ref("Years/").once('value', function(snap){
            snap.forEach(function(yearSnap){
                yearSnap.forEach(function(finalSnap){
                    if(finalSnap.key !== "year"){
                        finalSnap.forEach(function(childSnap){
                            childSnap.forEach(function(grandChildSnap){
                                if(grandChildSnap.child('0').child('seed').val() !== null && grandChildSnap.child('1').child('seed').val() !== null){
                                    if(Number(grandChildSnap.child('0').child('score').val()) >     Number(grandChildSnap.child('1').child('score').val())){
                                        sDataArray[Number(grandChildSnap.child('0').child('seed').val()) - 1][Number(grandChildSnap.child('1').child('seed').val()) - 1] = Number(sDataArray[Number(grandChildSnap.child('0').child('seed').val()) - 1][Number(grandChildSnap.child('1').child('seed').val()) - 1]) + 1
                                    }
                                    else{
                                        sDataArray[Number(grandChildSnap.child('1').child('seed').val()) - 1][Number(grandChildSnap.child('0').child('seed').val()) - 1] = Number(sDataArray[Number(grandChildSnap.child('1').child('seed').val()) - 1][Number(grandChildSnap.child('0').child('seed').val()) - 1]) + 1
                                    }
                                    
                                    
                                }
                                else{
                                    grandChildSnap.forEach(function(champSnap){
                                        if(Number(champSnap.child('0').child('score').val()) >     Number(champSnap.child('1').child('score').val())){
                                        sDataArray[Number(champSnap.child('0').child('seed').val()) - 1][Number(champSnap.child('1').child('seed').val()) - 1] = Number(sDataArray[Number(champSnap.child('0').child('seed').val()) - 1][Number(champSnap.child('1').child('seed').val()) - 1]) + 1
                                    }
                                    else{
                                        sDataArray[Number(champSnap.child('1').child('seed').val()) - 1][Number(champSnap.child('0').child('seed').val()) - 1] = Number(sDataArray[Number(champSnap.child('1').child('seed').val()) - 1][Number(champSnap.child('0').child('seed').val()) - 1]) + 1
                                    }
                                    })
                                }  
                            })
                        })
                    }
                })
            })
            
        }).then(function onSuccess(res){
            var i = 0
            var j = 0
            var row, cell
            var table = $('#winloss')
            ref.probArray = sDataArray
            table.append($('<caption>Historic wins and losses between seedings.</caption>'))
            for(i=0; i<17; i++){
                row = $( '<tr />' )
                table.append(row)
                for(j = 0; j<17; j++){
                    if(i===0){
                        if(j===0){
                            cell = $('<td>' + "Seeds" + '</td>')
                        }
                        else{
                            cell = $('<td>' + j + " losses" + '</td>')
                        }
                    }
                    else if(j===0){
                        cell = $('<td>' + i + " wins" + '</td>')
                    }
                    else{
                        cell = $('<td>' + sDataArray[i-1][j-1] + '</td>')
                    }
                    row.append(cell)
                }
            }
            
        })
        
    })
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
            if($('.newleft').length > 0){
                $('.newleft').remove()
            }
        },
// --- Function to change Username ---
        updateUsername(){

        },
// --- Function to change email ---
        updateEmail(){
        },
        exportData(){
            var myWindow = window.open("", "", "width=200, height=200")
            db.ref().on('value', function(snap){
                myWindow.document.write(JSON.stringify(snap))
            })
        },
    sample: function(event, crea){
        var access = this
        var second = []
        var third = []
        var fourth = []
        var fifth = []
        var sixth = []
        var winner = []
        var count = 0
        var countThird = 0
        var countFourth = 0
        var countFifth = 0
        var countSixth = 0
        if(crea === 0){
            if($('.loser').length>0){
                $('.loser').remove()
            }
            if($('.winner').length>0){
                $('.winner').remove()
            }
        db.ref("Years/" + event + "/regions").on('value', function(snap){
            snap.forEach(function(childSnapshot){
                childSnapshot.forEach(function(grandChildSnap){
                    grandChildSnap.forEach(function(roundSnap){
                        var firstTeam = roundSnap.child('0').child('team').val()
                        var secondTeam = roundSnap.child('1').child('team').val()
                        var round = roundSnap.child('0').child('round_of').val()
                        var firstScore = roundSnap.child('0').child('score').val()
                        var secondScore = roundSnap.child('1').child('score').val()
                        var firstSeed = roundSnap.child('0').child('seed').val()
                        var secondSeed = roundSnap.child('1').child('seed').val()
                        var firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                        var secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                        var fp
                        var sp
                        var random_num = Math.random()
                        
                        if(firstP !== "" && secondP !== ""){
                            fp = firstP/(firstP + secondP)
                            sp = secondP/(firstP + secondP)
                        }
                        if(firstP !== "" && secondP === ""){
                            fp = 1
                            sp = 0
                        }
                        if(firstP === "" && secondP !== ""){
                            fp = 0
                            sp = 1
                        }
                        if(firstP === "" && secondP === ""){
                            fp = 0.5
                            sp = 0.5
                        }
                        
                        if(random_num <= fp){
                            if(Number(round) === 64){
                                
                                if(Number(childSnapshot.key) === 0 || Number(childSnapshot.key) === 1){
                                    second.push([roundSnap.child('0'),0])
                                    $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                               }
                                else{
                                    second.push([roundSnap.child('0'),2])
                                    $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                }
                                
                            }
                        }
                        
                        else{
                            if(Number(round) === 64){
                                
                                if(Number(childSnapshot.key) === 0 || Number(childSnapshot.key) === 1){
                                    second.push([roundSnap.child('1'),0])
                                    $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                }
                            else{
                                    second.push([roundSnap.child('1'),2])
                                    $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                }
                            }
                        }
                        if(second.length === 32 && count === 0){
                            count++
                            var i = 0
                            for(i = 0; i < 32; i++){
                                if(i % 2 === 0){
                                    var a = second[i][0]
                                    var b = second[i+1][0]
                                    var region = second[i][1]
                                    firstTeam = a.child('team').val()
                                    secondTeam = b.child('team').val()
                                    round = 32
                                    
                                    firstSeed = a.child('seed').val()
                                    secondSeed = b.child('seed').val()
                                    firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                                    secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                                    
                                    random_num = Math.random()
                        
                                    if(firstP !== "" && secondP !== ""){
                                        fp = firstP/(firstP + secondP)
                                        sp = secondP/(firstP + secondP)
                                    }
                                    if(firstP !== "" && secondP === ""){
                                        fp = 1
                                        sp = 0
                                    }
                                    if(firstP === "" && secondP !== ""){
                                        fp = 0
                                        sp = 1
                                    }
                                    if(firstP === "" && secondP === ""){
                                        fp = 0.5
                                        sp = 0.5
                                    }
                                    if(random_num <= fp){
                                        if(Number(round) === 32){
                                            if(region === 0 || region === 1){
                                                third.push([a,0])
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                third.push([a,2])
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                
                                        }
                                    }
                        
                                    else{
                                        if(Number(round) === 32){
                                            
                                            if(region === 0 || region === 1){
                                                third.push([b,0])
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                third.push([b,2])
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                        if(third.length === 16 && countThird === 0){
                            countThird++
                            var i = 0
                            for(i = 0; i < 16; i++){
                                if(i % 2 === 0){
                                    var a = third[i][0]
                                    var b = third[i+1][0]
                                    
                                    var region = third[i][1]
                                    firstTeam = a.child('team').val()
                                    secondTeam = b.child('team').val()
                                    round = 16
                                    
                                    firstSeed = a.child('seed').val()
                                    secondSeed = b.child('seed').val()
                                    firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                                    secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                                    
                                    random_num = Math.random()
                        
                                    if(firstP !== "" && secondP !== ""){
                                        fp = firstP/(firstP + secondP)
                                        sp = secondP/(firstP + secondP)
                                    }
                                    if(firstP !== "" && secondP === ""){
                                        fp = 1
                                        sp = 0
                                    }
                                    if(firstP === "" && secondP !== ""){
                                        fp = 0
                                        sp = 1
                                    }
                                    if(firstP === "" && secondP === ""){
                                        fp = 0.5
                                        sp = 0.5
                                    }
                                    if(random_num <= fp){
                                        if(Number(round) === 16){
                                            if(region === 0 || region === 1){
                                                fourth.push([a,0])
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                fourth.push([a,2])
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                
                                        }
                                    }
                        
                                    else{
                                        if(Number(round) === 16){
                                            
                                            if(region === 0 || region === 1){
                                                fourth.push([b,0])
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                fourth.push([b,2])
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                        if(fourth.length === 8 && countFourth === 0){
                            countFourth++
                            var i = 0
                            for(i = 0; i < 8; i++){
                                if(i % 2 === 0){
                                    var a = fourth[i][0]
                                    var b = fourth[i+1][0]
                                   
                                    var region = fourth[i][1]
                                    firstTeam = a.child('team').val()
                                    secondTeam = b.child('team').val()
                                    round = 8
                                    
                                    firstSeed = a.child('seed').val()
                                    secondSeed = b.child('seed').val()
                                    firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                                    secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                                    
                                    random_num = Math.random()
                        
                                    if(firstP !== "" && secondP !== ""){
                                        fp = firstP/(firstP + secondP)
                                        sp = secondP/(firstP + secondP)
                                    }
                                    if(firstP !== "" && secondP === ""){
                                        fp = 1
                                        sp = 0
                                    }
                                    if(firstP === "" && secondP !== ""){
                                        fp = 0
                                        sp = 1
                                    }
                                    if(firstP === "" && secondP === ""){
                                        fp = 0.5
                                        sp = 0.5
                                    }
                                    if(random_num <= fp){
                                        if(Number(round) === 8){
                                            if(region === 0 || region === 1){
                                                fifth.push([a,0])
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                fifth.push([a,2])
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                
                                        }
                                    }
                        
                                    else{
                                        if(Number(round) === 8){
                                            
                                            if(region === 0 || region === 1){
                                                fifth.push([b,0])
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                fifth.push([b,2])
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                        if(fifth.length === 4 && countFifth === 0){
                            countFifth++
                            var i = 0
                            for(i = 0; i < 4; i++){
                                if(i % 2 === 0){
                                    var a = fifth[i][0]
                                    var b = fifth[i+1][0]
                                   
                                    var region = fifth[i][1]
                                    firstTeam = a.child('team').val()
                                    secondTeam = b.child('team').val()
                                    round = 4
                                    
                                    firstSeed = a.child('seed').val()
                                    secondSeed = b.child('seed').val()
                                    firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                                    secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                                    
                                    random_num = Math.random()
                        
                                    if(firstP !== "" && secondP !== ""){
                                        fp = firstP/(firstP + secondP)
                                        sp = secondP/(firstP + secondP)
                                    }
                                    if(firstP !== "" && secondP === ""){
                                        fp = 1
                                        sp = 0
                                    }
                                    if(firstP === "" && secondP !== ""){
                                        fp = 0
                                        sp = 1
                                    }
                                    if(firstP === "" && secondP === ""){
                                        fp = 0.5
                                        sp = 0.5
                                    }
                                    if(random_num <= fp){
                                        if(Number(round) === 4){
                                            if(region === 0 || region === 1){
                                                sixth.push([a,0])
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                sixth.push([a,2])
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                
                                        }
                                    }
                        
                                    else{
                                        if(Number(round) === 4){
                                            
                                            if(region === 0 || region === 1){
                                                sixth.push([b,0])
                                                $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                sixth.push([b,2])
                                                $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                        if(sixth.length === 2 && countSixth === 0){
                            countSixth++
                            var i = 0
                            for(i = 0; i < 2; i++){
                                if(i % 2 === 0){
                                    var a = sixth[i][0]
                                    var b = sixth[i+1][0]
                                   
                                    var region = sixth[i][1]
                                    firstTeam = a.child('team').val()
                                    secondTeam = b.child('team').val()
                                    round = 2
                                    
                                    firstSeed = a.child('seed').val()
                                    secondSeed = b.child('seed').val()
                                    firstP = access.probArray[firstSeed - 1][secondSeed - 1]
                                    secondP = access.probArray[secondSeed - 1][firstSeed - 1]
                                    
                                    random_num = Math.random()
                        
                                    if(firstP !== "" && secondP !== ""){
                                        fp = firstP/(firstP + secondP)
                                        sp = secondP/(firstP + secondP)
                                    }
                                    if(firstP !== "" && secondP === ""){
                                        fp = 1
                                        sp = 0
                                    }
                                    if(firstP === "" && secondP !== ""){
                                        fp = 0
                                        sp = 1
                                    }
                                    if(firstP === "" && secondP === ""){
                                        fp = 0.5
                                        sp = 0.5
                                    }
                                    if(random_num <= fp){
                                        if(Number(round) === 2){
                                            if(region === 0 || region === 1){
                                                winner.push([a,0])
                                                $('.' + round + '.newleft').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newleft').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                winner.push([a,2])
                                                $('.' + round + '.newleft').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newleft').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                            }
                                
                                        }
                                    }
                        
                                    else{
                                        if(Number(round) === 2){
                                            
                                            if(region === 0 || region === 1){
                                                winner.push([b,0])
                                                $('.' + round + '.newleft').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newleft').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                            else{
                                                winner.push([b,2])
                                                $('.' + round + '.newleft').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                                $('.' + round + '.newleft').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                        
                        /*
                        if(Number(round) === 64){
                            if(Number(childSnapshot.key) === 0 || Number(childSnapshot.key) === 1){
                        
                                if(Number(firstScore) > Number(secondScore)){
                                    $('.' + round + '.newwest').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.newwest').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                    }
                                else{
                                    $('.' + round + '.newwest').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.newwest').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                }
                            }
                            else{
                                if(Number(firstScore) > Number(secondScore)){
                                    $('.' + round + '.neweast').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.neweast').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                                }
                                else{
                                    $('.' + round + '.neweast').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                    $('.' + round + '.neweast').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                                }
                            }
                        } */
                    })
                })
            })
        })
            
        }
        if(crea === 1){
        var i
        if($('.loser').length>0){
            $('.loser').remove()
        }
        if($('.winner').length>0){
            $('.winner').remove()
        }
        db.ref("Years/" + event + "/finalfour").on('value', function(snap){
            snap.forEach(function(childSnapshot){
                childSnapshot.forEach(function(grandChildSnap){
                        var firstTeam = grandChildSnap.child('0').child('team').val()
                        var secondTeam = grandChildSnap.child('1').child('team').val()
                        var round = grandChildSnap.child('0').child('round_of').val()
                        var firstScore = grandChildSnap.child('0').child('score').val()
                        var secondScore = grandChildSnap.child('1').child('score').val()
                        if(Number(childSnapshot.key) === 0){
                        
                            if(Number(firstScore) > Number(secondScore) && Number(grandChildSnap.key) === 0){
                                $('.' + round + '.west').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.west').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                            }
                            else if(Number(firstScore) > Number(secondScore) && Number(grandChildSnap.key) === 1){
                                $('.' + round + '.east').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.east').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                            }
                            else if(Number(firstScore) < Number(secondScore) && Number(grandChildSnap.key) === 0){
                                $('.' + round + '.west').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.west').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                            }
                            else if(Number(firstScore) < Number(secondScore) && Number(grandChildSnap.key) === 1){
                                $('.' + round + '.east').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.east').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                            } 
                            
                        }
                        else{
                            if(Number(firstScore) > Number(secondScore)){
                                $('.' + round + '.left').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.left').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                            }
                            else{
                                $('.' + round + '.left').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.left').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                            }
                        }
                    })
                })
            })
        db.ref("Years/" + event + "/regions").on('value', function(snap){
            snap.forEach(function(childSnapshot){
                childSnapshot.forEach(function(grandChildSnap){
                    grandChildSnap.forEach(function(roundSnap){
                        var firstTeam = roundSnap.child('0').child('team').val()
                        var secondTeam = roundSnap.child('1').child('team').val()
                        var round = roundSnap.child('0').child('round_of').val()
                        var firstScore = roundSnap.child('0').child('score').val()
                        var secondScore = roundSnap.child('1').child('score').val()
                        console.log(round)
                        if(Number(childSnapshot.key) === 0 || Number(childSnapshot.key) === 1){
                            if(Number(firstScore) > Number(secondScore)){
                                $('.' + round + '.west').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.west').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                            }
                            else{
                                $('.' + round + '.west').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.west').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                            }
                        }
                        else{
                            if(Number(firstScore) > Number(secondScore)){
                                $('.' + round + '.east').append($('<div class="winner"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.east').append($('<div class="loser"><p>' + secondTeam + '</p></div>'))
                            }
                            else{
                                $('.' + round + '.east').append($('<div class="loser"><p>' + firstTeam + '</p></div>'))
                                $('.' + round + '.east').append($('<div class="winner"><p>' + secondTeam + '</p></div>'))
                            }
                        }
                    })
                })
            })
        })
        d3.select("body").style("background-color", "yellow").transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("yellow", "cyan")}).duration(5000)
        }
        
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
    },
    MultiDimensionalArray: function(iRows, jCols){
        var i
        var j
        var a = new Array(iRows)
        for(i = 0; i < iRows; i++){
            a[i] = new Array(jCols)
            for(j=0; j< jCols; j++){
                a[i][j] = ""
            }
        }
        return(a)
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
.newleft{
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
.winner{
    background-color: #eed653;
}
.loser{
    background-color: #D3D3D3;
}
table, th, td {
    border: 1px solid black;
}
.statistics{
    display: inline-block;
}
table{
    margin: 10px;
    padding: 20px;
}
</style>