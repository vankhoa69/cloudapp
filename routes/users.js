var express = require('express');
var router = express.Router();
const authenticate = require('../models/authenticator');
const table_display = require('../models/table_display');
const crud = require('../models/db_crud');
const select_form = require('../models/dropdown_list');
const authen = require('../models/authenticator');
const regis = require('../models/signup');
const { signedCookie } = require('cookie-parser');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title: "User Page"});
});
/* GET the login page */
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: "Login Page", 
    warn_message: ""});
});
router.get('/signup', function(req, res, next) {
  res.render('signup', {
    title: "Signup Page", 
    warn_message: ""});
});
/* GET the logout link */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/users/login')
});
/* POST by the login form */
router.post('/login', async function(req, res, next) {
  let uname = req.body.uname;
  let pword = req.body.pword; 
  // if correct username and password, then redirect the profile page
  authen_result = await authenticate(uname, pword);
  console.log(authen_result.auth);
  if (authen_result.auth) {
    req.session.username = uname;
    req.session.role = authen_result.role;
    req.session.department_id = authen_result.department_id;
    if (req.session.role == "director"){
      res.redirect('/users/director');
    } else if (req.session.role == "admin"){
      res.redirect('/users/admin');
    } else {
      res.redirect('/users/profile');
    }
  }
  else {
    res.render('login', {
      title: "Login Page", 
      warn_message: "Wrong username or password, please try again!"})
  }
});

router.post('/signup', async function(req, res, next){
  let req_body = req.body;
  signup_result = await regis(req_body);
  
  console.log(signup_result.auth);
  if (signup_result.auth){
  res.render('login', {
    title: "Login Page", 
    warn_message: "Registration succesfull. Please login"})
  }
  else{
    res.render('signup', {
      title: "Signup Page", 
      warn_message: "Password and repeat password don't match!!!"})
    }
  });

router.get('/profile', async function(req, res, next) {
  // check username in session to make sure that user logged in.
  if (req.session.username){
    let table_string = await table_display('products', req.session.role, req.session.department_id);
    res.render('profile', {title: req.session.role, product_cells: table_string, user: req.session.username});
  } else {
    res.redirect('/users/login')
  }
});

router.get('/admin', async function(req, res, next) {
  if (req.session.username){
    let table_string = await table_display('products', req.session.role, req.session.department_id);
    res.render('profile', {title: req.session.role, product_cells: table_string, user: req.session.username});
  } else {
    res.redirect('/users/login')
  }
});

/* GET users/director. */
router.get('/director', async function(req, res, next) {
  // check username in session to make sure that user logged in.
  let uname = req.session.username;
  let role = req.session.role;
  let deparment_id = (req.session.shop_id)? req.session.shop_id : 0;
  let interval = (req.session.interval)? req.session.interval*1000 : 5000;
  let table_string = await table_display('products', role, deparment_id);
  let form_string = await select_form(deparment_id);
  // console.log(table_string)
  if (uname){
    res.render('director', {title: "Director",
      user: uname, 
      product_cells: table_string, 
      select_form: form_string,
      interval: interval})
  } else {
    res.redirect('/users/login')
  }
});

/* Router for shop selection, POST */
router.post('/director', async function(req, res, next) {
  // Save selected shop_id into session
  req.session.shop_id = req.body.shop_selected;
  res.redirect('/users/director');
});
/* Routerfor /users/crud, POST */
router.post('/crud', async function(req, res, next) {
  let req_body = req.body;
  await crud(req_body);
  res.redirect('/users/admin');
});
/* Router for /refreshtime, POST */
router.post('/refreshtime', async function(req, res, next) {
  // Save selected interval into session
  req.session.interval = req.body.interval;
  res.redirect('/users/director');
});
module.exports = router;
