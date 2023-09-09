const express = require('express'); 
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const customerRouters = require ('./routes/customer');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const res = require('express/lib/response');

dotenv.config({path:'./env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// Settings
app.set('puerto', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nodejscrud'
}, 'single'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

const connection = mysql.createConnection({ // Corrección aquí: utiliza 'mysql.createConnection' en lugar de 'thisconnection'
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejscrud'
});

app.post('/register', async (req, res) => {
    const user = req.body.user;
    const names = req.body.names;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { user: user, names: names, rol: rol, pass: passwordHash }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 1500,
                    ruta: 'login'
                })
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].names;
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión Exitosa",
                    alertMessage: "Logueado correctamente",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        })
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingresa un usuario y contraseña validos",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
})

// Autenticacion

app.get('/index', (req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            names: req.session.name
        });
    }
})



app.use('/', customerRouters);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('puerto'), () => {
    console.log('Servidor funcionando');
});
