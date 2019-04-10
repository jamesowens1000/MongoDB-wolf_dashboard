var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/wolf_dashboard', {useNewUrlParser:true});
var WolfSchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    fur_color: {type: String, required: true}
}, {timestamps: true});
mongoose.model('Wolf', WolfSchema);
var Wolf = mongoose.model('Wolf');

//ROUTES
app.get('/', function(req,res) {
    Wolf.find({}, function(err,wolves){
        if(err) {
            console.log('error occurred while retrieving Wolves');
        } else {
            console.log('successfully retrieved all Wolves!');
            res.render('index', {wolves: wolves});
        }
    })
})

app.get('/wolves/new', function(req,res){
    res.render('new_wolf');
})

app.get('/wolves/:id', function(req,res) {
    Wolf.findOne({_id: req.params.id}, function(err,wolf){
        if(err) {
            console.log('error occurred while retrieving wolf id: '+req.params.id);
        } else {
            console.log('successfully retrieved wolf id: '+req.params.id);
            res.render('show_wolf', {wolf: wolf});
        }
    })
})

app.post('/wolves', function(req,res){
    var new_wolf = new Wolf({name: req.body.name, age: req.body.age, fur_color: req.body.fur_color});

    new_wolf.save(function(err) {
        if(err) {
            console.log('error occurred while adding a new Wolf');
        } else {
            console.log('successfully added a Wolf!');
        }
    })
    res.redirect('/');
})

app.get('/wolves/edit/:id', function(req,res){
    Wolf.findOne({_id: req.params.id}, function(err,wolf){
        if(err) {
            console.log('error occurred while retrieving wolf id: '+req.params.id);
        } else {
            console.log('successfully retrieved wolf id: '+req.params.id);
            res.render('edit_wolf', {wolf: wolf});
        }
    })
})

app.post('/wolves/:id', function(req,res){
    Wolf.updateOne({_id: req.params.id}, {$set: {name: req.body.name, age: req.body.age, fur_color: req.body.fur_color}}, function(err){
        if(err) {
            console.log('error occurred while editing wolf id: '+req.params.id);
        } else {
            console.log('successfully edited wolf id: '+req.params.id);
            res.redirect('/wolves/'+req.params.id);
        }
    })
})

app.get('/wolves/destroy/:id', function(req,res) {
    Wolf.deleteOne({_id: req.params.id}, function(err){
        if(err) {
            console.log('something went wrong while removing wolf id: '+req.params.id);
        } else {
            console.log('successfully removed wolf id: '+req.params.id);
        }
    })
    res.redirect('/');
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})