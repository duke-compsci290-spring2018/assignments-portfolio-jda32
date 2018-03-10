// ---- AUTHOR: JASON AKERS ----
 
// ---- Set up the FireBase Database ----
var config = {
    apiKey: "AIzaSyAc9LoMFzA086q2X7ypextZwgHdA-Fm8ZQ",
    authDomain: "project-manager-d054d.firebaseapp.com",
    databaseURL: "https://project-manager-d054d.firebaseio.com",
    projectId: "project-manager-d054d",
    storageBucket: "project-manager-d054d.appspot.com",
    messagingSenderId: "934519984245"
  };
var stor = firebase.initializeApp(config).database();
var itemsRef = stor.ref('items');
var userRef = stor.ref('users');
var colorRef = stor.ref('color');

Vue.use(VueFire);

// ---- Function to Get the Date that the function was called
function getDate(){
    var now = new Date();
    console.log ("now " + now);
    var hr = now.getHours();
    var min = now.getMinutes();
    var dd = now.getDate();
    console.log("getDate dd "+ dd);
    var mm = now.getMonth() + 1;
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    console.log(mm);
    var yy = now.getFullYear();
    return (hr+":"+min+" "+yy+"-"+mm+"-"+dd);
}

// ---- Function to get Today's date
function getToday(){
    var now = new Date();
    var hr = now.getHours();
    var min = now.getMinutes();
    var dd = now.getDate();
    var mm = now.getMonth() + 1;
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var yy = now.getFullYear();
    return (+yy+"-"+mm+"-"+dd);
}
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("datefield").setAttribute("min", today);
document.getElementById("datef").setAttribute("min", today);

// --- Function to always have the background be the current background in the database.
var storRefColor = stor.ref().child('color');
storRefColor.on('value', function (snap){
    console.log(snap.val());
    $('html').css({
                'background-color':snap.val()
            });
});
// --- Vue stuff
var app = new Vue({
    el: '#app',
    data: {
        visibility: 'true',
        newitem: '',
        completed: 'false',
        
        neWcard: '',
        neWcardDueDate: '',
        neWcardDesc: '',
        updDueDate: '',
        
        newuser: '',
        newemail: '',
        
        color: "",
        
        currentUser:{
            name: "No One",
            email: "None",
            photo: "./data/no_pic.jpg",
            id: -1
        }
    },
    firebase: {
        items: itemsRef,
        users: userRef,
        colors: colorRef
    },
    methods: {
        newItem(){
            var id = app.newitem;
            if(id === ""){
                alert("Please enter a valid name for the list");
                return 0
            }
            for (var item in this.items){
                if(this.items[item].id === app.newitem){
                    alert("This List Name Is Already Taken");
                    return 0
                }
            }
            stor.ref("items/"+ id).set({
                id: id,
                title: id,
                cards: [],
                hide: false,
                completed: false,
                visibility: true
            });
        },
        removeItem(it){
            var id = it.id;
            stor.ref("items/"+ id).set(
                null
            );
        },
        newcard(it){
            var now = getDate();
            console.log(now);
            var tod = getToday();
            var b = new Date(tod);
            var due = app.neWcardDueDate;
            var a = new Date(due);
            console.log("a " + a);
            console.log("b " + b);
            var timeDiff = Math.abs(a.getTime() - b.getTime());
            var diffDays = Math.ceil(timeDiff / (1000*3600*24));
            console.log(diffDays);
            var id = it.id;
            stor.ref("items/"+ id+ "/cards/" + app.neWcard).set({
                task: app.neWcard,
                date: now,
                visibility: true,
                desc: app.neWcardDesc,
                dueDate: app.neWcardDueDate,
                diffDays: diffDays
            })
        },
        removeCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task).set(
                null
            );
        },
        hideCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task).set({
                task: car.task,
                date: car.date,
                visibility: false,
                desc: car.desc,
                dueDate: car.dueDate,
                diffDays: car.diffDays
            });
        },
        expandCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task).set({
                task: car.task,
                date: car.date,
                visibility: true,
                desc: car.desc,
                dueDate: car.dueDate,
                diffDays: car.diffDays
            })
        },
        hideList(it){
            var id = it.id;
            stor.ref("items/"+ id +"/visibility").set(false)
        },
        expandList(it){
            var id = it.id;
            stor.ref("items/" + id+ "/visibility").set(true)
        },
        updateDue(it, car){
            var old = car.dueDate;
            var upd = app.updDueDate;
            var a = new Date(getToday());
            var b = new Date(upd);
            var timeDiff = Math.abs(a.getTime() - b.getTime());
            var diffDays = Math.ceil(timeDiff / (1000*3600*24));
            stor.ref("items/"+ it.id +"/cards/" + car.task +"/dueDate").set(upd);
            stor.ref("items/"+ it.id +"/cards/" + car.task +"/diffDays").set(diffDays);
            
        },
// --- create a new username, password
        newUser(){
            var usn = app.newuser;
            var emai = app.newemail;
            if(usn === "" && emai === ""){
                alert("Please Enter A Valid Username and Email")
            }
            else if(usn === "" && emai !== ""){
                alert("Please Enter A Valid Username")
            }
            else if(emai === "" && usn !== ""){
                alert("Please Enter A Valid Email")
            }
            stor.ref("users/" + app.newuser).set({
                username: usn,
                email: emai   
            })
        },
// --- Function to sign in will go here ---
// --- Change color in the database
        background(){
            stor.ref("color/").set(app.color);
        },
        
// --- Function to order the Cards by Due Date: WiP
        orderDue(it){
            var id = it.id;
            stor.ref('items/' + it.id + "/cards").orderByChild('dueDate');
        }
        
    }
})
