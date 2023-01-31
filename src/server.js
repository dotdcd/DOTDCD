import express from 'express'
import { engine } from 'express-handlebars';
import handlebars from 'handlebars';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import morgan from 'morgan'

//? Import helpers
import { uploadFiles, updFiles } from './helpers/multer.js';
import {helpers} from './helpers/handlebars.js';
import {SECRET} from './config.js';
import { checkPrefacturas } from './helpers/prefacturasMantenimiento.js';

//? Importar rutas
import rutasAnalytics from './routes/analytics.routes.js';
import inicioRoutes from './routes/inicio.routes.js';
import rutasErp from './routes/erp.routes.js';
import rutasIndex from './routes/index.routes.js';
import rutasMarcas from './routes/marcas.routes.js';
import employeesRoutes from './routes/employees.routes.js';
import administrationRoutes from './routes/administration.routes.js';
import contabilidadRoutes from './routes/contabilidad.routes.js';
import operacionRoutes from './routes/operacion.routes.js';
import bancosRoutes from './routes/bancos.routes.js';

import cron from 'node-cron';


const app = express();

//? Port setting you can change de port number here or in .env
app.set('port', PORT);

//? Setup views directory
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));

//? Handlebars Settings
//? Layouts file directory
//? Partials file directory
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: helpers,
    extname: '.hbs',
    handlebars: handlebars
}));

//? Template engine
app.set('view engine', '.hbs');
app.set('trust proxy', true)


//? Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

//* File path to directory upload & rename file with uuid & multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const fpath = (req.body.vid) ? await updFiles(req.body.vid, file.fieldname) : await uploadFiles('path', file.fieldname);
        req.body.id =  (req.body.vid) ? req.body.vid : await uploadFiles('id');
        fs.mkdirsSync(fpath, { recursive: true })
        cb(null, fpath)
    },
    filename: (req, file, cb, filename) => {
        const filname = (file.fieldname === 'varios') ? file.originalname + uuidv4() + path.extname(file.originalname) : uuidv4() + path.extname(file.originalname); 
        cb(null, filname) //? <-- Rename file with uuid
    }
})
app.use(multer({ storage }).any());

//? Connect - Flash (For show alerts in handlebars & express)
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.infoSign = req.flash('infoSign');
    next();
})

app.use((req, res, next) => {
    res.locals.session = req.session || null;
    next();
});

// ? View request in dev enviroment
//app.use(morgan('dev'))

//? Routes files
app.use(rutasAnalytics);
app.use(inicioRoutes);
app.use(rutasErp);
app.use(rutasIndex);
app.use(rutasMarcas);
app.use(employeesRoutes);
app.use(administrationRoutes);
app.use(contabilidadRoutes);
app.use(operacionRoutes);
app.use(bancosRoutes);
//* listo 

//? PWA Service Worker
const options = {
    setHeaders: function (res, path, stat) {
        res.set('Service-Worker-Allowed', 'https://dotdcd.com.mx/');
    },
};

//? Statics files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers\\external-controllers')));  
app.use(express.static(path.join(__dirname, 'public'), options));

let subscription
app.post('/subscription', (req, res) => {
    subscription = req.body
    res.status(201).json({})
});

//? Error pages
app.use((req, res) => {
    res.status(404)

    if (req.accepts('html')) {
        res.render('errors/error', { layout: 'auth', error: '404', url: req.url, message: 'Página no encontrada' })
        return;
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});


//cron.schedule('5 */24 * * *', async () => {
//    await checkPrefacturas();
//});

export default app;