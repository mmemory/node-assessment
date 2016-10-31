const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
var users = require('./users.json');


app.use(bodyParser.json());

Array.prototype.filterByProp = function(prop, comparison) {
    return this.filter(function(item) {
        return item[prop] == comparison;
    });
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// ENDPOINTS
app.get('/api/users', function(req, res) {
    let usersArr = users;
    if (req.query.age) usersArr = usersArr.filterByProp('age', req.query.age);
    if (req.query.language) usersArr = usersArr.filterByProp('language', req.query.language);
    if (req.query.city) {
        usersArr = usersArr.filterByProp('city', req.query.city.capitalizeFirstLetter());
    }
    if (req.query.state) {
        usersArr = usersArr.filterByProp('state', req.query.state.capitalizeFirstLetter());
    }
    if (req.query.gender) usersArr = usersArr.filterByProp('gender', req.query.gender.capitalizeFirstLetter());
    res.json(usersArr);
});

app.get('/api/users/:type', function(req, res) {
    let usersArr = users;
    if(Number(req.params.type)) {
        var user = usersArr.filterByProp('id', req.params.type)[0];
        if(!user) {
            res.status(404).end();
        } else {
            res.json(user);
        }
    } else {
        usersArr = usersArr.filterByProp('type', req.params.type);
        res.json(usersArr);
    }
});

app.post('/api/users', function(req, res) {
    var newUser = req.body;
    if(req.body.first_name) {
        newUser.id = users.length + 1;
        newUser.favorites = [req.body.favorites];
        users.push(newUser);
        res.status(200).json(newUser);
    } else {
        res.end();
    }
});

app.post('/api/users/:type', function(req, res) {
    var newAdmin = req.body;
    if(req.body.first_name) {
        newAdmin.id = users.length + 1;
        newAdmin.type = req.params.type;
        newAdmin.favorites = [req.body.favorites];
        users.push(newAdmin);
        res.status(200).json(newAdmin);
    } else {
        res.end();
    }
});

app.post('/api/users/language/:userId', function(req, res) {
    let usersArr = users;
    var user = usersArr.filterByProp('id', Number(req.params.userId))[0];
    var i = users.indexOf(user);
    users[i].language = req.body.language;
    res.send(users[i]);
});

app.post('/api/users/forums/:userId', function(req, res) {
    let usersArr = users;
    var user = usersArr.filterByProp('id', req.params.userId)[0];
    var i = users.indexOf(user);
    users[i].favorites.push(req.body.add);
    res.status(200).json(users[i]);
});

app.delete('/api/users/forums/:userId', function(req, res) {
    let usersArr = users;
    var user = usersArr.filterByProp('id', Number(req.params.userId))[0];
    var i = users.indexOf(user);
    var forumIndex = users[i].favorites.indexOf(req.query.favorite);
    users[i].favorites.splice(forumIndex, 1);
    res.status(200).json(users[i]);
});

app.delete('/api/users/:userId', function(req, res) {
    let usersArr = users;
    var user = usersArr.filterByProp('id', req.params.userId)[0];
    if(!user) {
        res.status(404).end();
    } else {
        var i = users.indexOf(user);
        users.splice(i, 1);
        res.status(200).json(user);
    }
});

app.put('/api/users/:userId', function(req, res) {
    let usersArr = users;
    var user = usersArr.filterByProp('id', Number(req.params.userId))[0];
    var i = users.indexOf(user);
    for(key in req.body) {
        users[i][key] = req.body[key];
    }
    res.json(users[i]);
});

app.listen(port, function() {
    console.log('Listening on port', port);
});

module.exports = app;