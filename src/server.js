const express = require('express');
const {engine} = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');
const app = express();
const is = require('./views/_helpers/is-helper')

//? Port setting you can change de port number here or in .env
app.set('port', process.env.SPORT || 5000);

//? Setup views directory
app.set('views', path.join(__dirname, 'views'));

//? Handlebars Settings
//? Layouts file directory
//? Partials file directory
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        json: function(obj) {
            return JSON.stringify(obj);
        }
    },
    extname: '.hbs',
    handlebars: handlebars
}));

//? Template engine
app.set('view engine', '.hbs');



//? Midlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//app.use(session({
//  secret: 'secret',
//  resave: true,
// saveUninitialized: true,
//}));

//? Routes files
app.use(require('./routes/index.routes'));
app.use(require('./routes/erp.routes'));



//? Statics files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;