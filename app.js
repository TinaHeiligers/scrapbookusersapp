var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('scrapbookusersapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

//MIDDLEWARE-must come before routing
// var logger = (req, res, next) => {
//   console.log('Logging...');
//   next();
// }
// app.use(logger);

// MIDDLEWARE View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//MIDDLEWARE Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//GLOBAL VARS
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
});

//MIDDLEWARE for Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//parsing JSON
// var people = [
//   {
//     name: 'Tina',
//     age: 40
//   },
//   {
//     name: 'Marc',
//     age: 41
//   },
//   {
//     name: 'Michael',
//     age: 8
// }
// ]

//PARSING JSON through routing
// app.get('/', (req, res) => {
//   res.json(people);
// });

// these are static, we replace this with the stuff in mongojs
// var users = [
//   {
//     id: 1,
//     first_name: 'Tina',
//     last_name: 'Heiligers',
//     email: 'tina.heiligers@gmail.com'
//   },
//   {
//     id: 2,
//     first_name: 'Marc',
//     last_name: 'Heiligers',
//     email: 'marc.heiligers@gmail.com'
//   },
//   {
//     id: 3,
//     first_name: 'Bella',
//     last_name: 'Heiligers',
//     email: 'bella.heiligers@gmail.com'
//   }
// ]

//ROUTER
app.get('/', (req, res) => {
//Inserting mongojs stuff from github repo:
  // find everything
  db.users.find(function (err, docs) {
      // docs is an array of all the documents in users
      // console.log(docs);
      res.render('index', {
        title: 'ScrapBook Users',
        users: docs
    });
  })
});

app.post('/users/add', (req, res) => {
  //1. npm install express-validator, requrie at top
  //2. using express validator: set validation checks
  req.checkBody('first_name', 'First Name is required').notEmpty();
  req.checkBody('last_name', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  //3. create variable to hold errors:
  var errors = req.validationErrors();
  
  if(errors){
    //rerender the same page if there are errors with the forms submission
    res.render('index', {
      title: 'ScrapBook Users',
      users: users,
      errors: errors
    });
  } else {
      var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }  

    db.users.insert(newUser, function(err, result) {
      if(err){
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

app.delete('/users/delete/:id', function(req, res){
  
  db.users.remove({_id: ObjectId(req.params.id)}, function(err) {
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  })
  
  // console.log(req.params.id);
});

app.listen(3000, function() {
  console.log('Server started on Port 3000...');
});