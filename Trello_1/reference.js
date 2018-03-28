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
var catRef = stor.ref('categories');

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

// The following is a function to take a snapshot of old record 
// and move it to a new record
// Credit: katowulf at https://gist.github.com/katowulf/6099042
function moveFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  { 
          newRef.set( snap.val(), function(error) {  
               if( !error ) {  oldRef.remove(); }
          });
     });
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
    $('html').css({
                'background-color':snap.val()
            });
});

// --- Vue stuff
var app = new Vue({
    el: '#app',
// -------------------------- DATA DATA DATA DATA DATA --------------------
    data: {
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
        
        signinUser: '',
        signinEmail: '',
        
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
            id: -1
        }
    },
    firebase: {
        items: itemsRef,
        users: userRef,
        colors: colorRef,
        categories: catRef
    },
// ------------------------------------------ FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS ----------------------
    methods: {
// ----------- LIST STUFF -------------
// --- New List ---
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
// --- Remove List ---
        removeItem(it){
            var id = it.id;
            stor.ref("items/"+ id).set(
                null
            );
        },
// --- Creates a new card within a list ---
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
                diffDays: diffDays,
                picture: app.newCardPic,
                category: "Uncategorized",
                color: 'beige'
            });
        },
// --- Delete the card ---
        removeCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task).set(
                null
            );
        },
// --- VISIBILITY FUNCTIONS FOR CARD AND LIST ---
        hideCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task + "/visibility").set(false);
        },
        expandCard(it, car){
            var id = it.id;
            var carid = car.task;
            stor.ref("items/"+ id +"/cards/" + car.task + "/visibility").set(true);
        },
        hideList(it){
            var id = it.id;
            stor.ref("items/"+ id +"/visibility").set(false);
        },
        expandList(it){
            var id = it.id;
            stor.ref("items/" + id+ "/visibility").set(true);
        },
// --- Update Due Date for the card ---
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
            var pic = app.newpic;
            if(usn === "" && emai === ""){
                alert("Please Enter A Valid Username and Email");
            }
            else if(usn === "" && emai !== ""){
                alert("Please Enter A Valid Username");
            }
            else if(emai === "" && usn !== ""){
                alert("Please Enter A Valid Email");
            }
            stor.ref("users/" + app.newuser).set({
                username: usn,
                email: emai,
                photo: pic
            })
            this.currentUser.photo = pic;
            this.currentUser.email = emai;
            this.currentUser.name = usn;
            this.currentUser.signedIn = true;
        },
// --- Function to sign in w/ username ---
        signIn(){
            var usn = app.signinUser;
            stor.ref('users/').child(usn).once('value', function(snapshot){
                if(snapshot.exists()){
                    app.currentUser.name = usn;
                    app.currentUser.email = snapshot.val().email;
                    app.currentUser.photo = snapshot.val().photo;
                    app.currentUser.signedIn = true;
                }
                else{
                    alert('Username Does Not Exist');
                }
            })
        },
// --- Function to sign in w/ email ---
        signInEmail(){
            var emai = app.signinEmail;
            stor.ref('users/').orderByChild("email").equalTo(emai).once('value', function(snapshot){
                if(!snapshot.val()){
                    alert("Email Does Not Exist In Our Records");
                }
            })
            var query = stor.ref("users").orderByKey();
            query.once("value").then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key
                    var childDataEmail = childSnapshot.child("email").val()
                    if(childDataEmail === emai){
                        app.currentUser.email = childDataEmail;
                        app.currentUser.name = childSnapshot.child("name").val();
                        app.currentUser.photo = childSnapshot.child("photo").val();
                        app.currentUser.signedIn = true;
                        
                        return true;
                    }
                })
            })
        },
// --- Function to sign out ---
        signOut(){
            this.currentUser.photo = "./data/no_pic.jpg";
            this.currentUser.name = "No one is logged in";
            this.currentUser.email = "None";
            this.currentUser.signedIn = false;
        },
// --- Function to change Username ---
        updateUsername(){
            var newusn = app.changeUsername;
            stor.ref('users/').child(app.currentUser.name).once('value', function(snapshote){
                stor.ref('users/' + newusn).set({
                    username: newusn,
                    email: app.currentUser.email,
                    photo: app.currentUser.photo
                })
            });
            stor.ref('users/' + app.currentUser.name).remove();
            app.currentUser.name = newusn;
        },
// --- Function to change email ---
        updateEmail(){
            stor.ref('users/' + app.currentUser.name + '/email').set(app.changeEmail);
            app.currentUser.email = app.changeEmail;
        },
// --- Change Background color in the database
        backgroundColor(){
            stor.ref("color/").set(app.color);
            $('html').css('background-image', 'none');
        },
// --- Change Background image in the database
        backgroundIm(){
            stor.ref("image/").set(app.image);
            stor.ref().child('image').on('value', function(snap){
                $('html').css('background-image','url(' + snap.val() +')');
            });
        },
        
// ----------------- UPDATE CARD STUFF ---------------------------
        
// --- Update Card Picture ---
        
        updateCardPic(it, car){
            stor.ref('items/' + it.id + "/cards/" + car.task +"/picture").set(app.oldCardPic);
        },
        
// --- Function to order the Cards by Due Date: WiP
        orderDue(it){
            var id = it.id;
            stor.ref('items/' + it.id + "/cards").orderByChild('dueDate');
        },
        
// --- Function to add tasks ---
        newEvent(it, car){
            stor.ref('items/' + it.id + "/cards/" + car.task + "/events/" +app.newTaskItem).set({
                name: app.newTaskItem,
                visibility: true
            });
            
        },
        updateCardDesc(it, car){
            console.log(app.oldCardDesc);
            stor.ref('items/' + it.id + "/cards/" + car.task + "/desc").set(app.oldCardDesc);
        },
// --- Function to delete a task to the Todo List of a specific card ---
        deleteTask(it, car, eve){
            stor.ref('items/' +it.id + "/cards/" + car.task + "/events/" + eve.name).set(null)
        },
// --- Function to change the list the card is in ---
// --- Function I want to implement but probably wont have the time by 3/28/19 ----
/*        changeCardList(it, car){
            var curCar = stor.ref("items/" + it.id + "/cards/" + car);
            console.log(curCar);
            var place;
            for (var child in app.items){
                place = app.items[child];
                if(place.title === app.moveThisCard){
                    break;
                }
            };
            var newCar = stor.ref("items/" + place.id + "/cards/" + car);
            moveFbRecord(curCar, newCar); 
        },
*/
// --- Function to categorize each card and update its color ---
        categorizeCard(it, car){
            stor.ref('categories').child(app.categorize).once('value', function(snapshot){
                if(snapshot.exists()){
                    stor.ref('items/' + it.id + "/cards/" + car.task + "/category").set(snapshot.val().name);
                    stor.ref('items/' + it.id + "/cards/" + car.task + "/color").set(snapshot.val().color);
                    $('#'+app.categorize).css({
                        'background-color': snapshot.val().color
                    });
                }
                else{
                    stor.ref('items/' + it.id + "/cards/" + car.task + "/category").set("Uncategorized");
                    stor.ref('items/' + it.id + "/cards/" + car.task + "/color").set(null);
                    $('#'+"Uncategorized").css({
                        'background-color': 'beige'
                    });
                };
            });
            
            
        },
// --- Create a new category with color ---
        newCategory(){
            var cat = app.newCateg;
            var catColor = app.catColor;
            stor.ref('categories/' + cat).set({
                name: cat,
                color: catColor
            })
        } 
    }
});

