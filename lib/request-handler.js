var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({})
    .then(function(links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({'url': uri})
    .then(function(found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save().then(function(newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
};


exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username})
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        console.log('stored password: ', this.password);
        user.comparePassword(password, function(match) {
          console.log(match);
          if (match) {
            util.createSession(req, res, user);
          } else {
            console.log('not valid password');
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username})
    .then(function(user){
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        
        newUser.save()
          .then(function(newUser) {
          util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {

  Link.findOne({'code': req.params[0]})
    .then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        link.visits++;
          link.save()
          .then(function() {
            return res.redirect(link.get('url'));
          });
      }
  });
};