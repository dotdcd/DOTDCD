import express from 'express'
import { engine } from 'express-handlebars';
import handlebars from 'handlebars';
import path from 'path';
import flash from 'connect-flash';	
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {fileURLToPath} from 'url';
import { PORT } from './config.js';

//? Importar rutas
import rutasAnalytics from './routes/analytics.routes.js';
import rutasErp from './routes/erp.routes.js';
import rutasIndex from './routes/index.routes.js';
import rutasMarcas from './routes/marcas.routes.js';


const app = express();

//? Port setting you can change de port number here or in .env
app.set('port', PORT);

//? Setup views directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        },
        multiply: function(num1, num2){
            return num1 * num2
        },
        money: function(num){
            const money = new Intl.NumberFormat('en-US').format(num)
            return money
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
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

//? Connect - Flash (For show alerts in handlebars & express)
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');	
    next();
})

//? Routes files
app.use(rutasAnalytics);
app.use(rutasErp);
app.use(rutasIndex);
app.use(rutasMarcas);



//? Statics files
app.use(express.static(path.join(__dirname, 'public')));


export default app;