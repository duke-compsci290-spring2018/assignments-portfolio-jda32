// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
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

Vue.use(VueFire);

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
        
        currentUser:{
            name: "No One",
            email: "None",
            photo: "./data/no_pic.jpg",
            id: -1
        }
    },
    firebase: {
        items: itemsRef,
        users: userRef
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
        
    }
})

/*var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// app Vue instance
var app = new Vue({
  // app initial state
  data: {
    todos: todoStorage.fetch(),
    newTodo: '',
    editedTodo: null,
    visibility: 'all'
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp') */
