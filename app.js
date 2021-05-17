const { join } = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const session = require('express-session');
const SessionStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const expHbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport');
const passportSocketIO = require('passport.socketio');

const { router: mainRoutes } = require('./routes/main');
const { router: userRoutes } = require('./routes/users');
const { connectSocket } = require('./chats/sockets');
const { config } = require('./config/index');
const { mongoose: db } = require('./database');
const cookieParser = require('cookie-parser');

/*
 * Initializations
 */
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
dbConnection = db.connection;
require('./auth/passport')(passport);

/*
 * Settings
 */
app.set('port', config.port);

app.set('views', join(__dirname, 'views'));
app.engine('.hbs', expHbs({
  defaultLayout: 'main',
  layoutsDir: join(app.get('views'), 'layouts'),
  partialsDir: join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./utils/handlebars')
}));
app.set('view engine', '.hbs');

const sessionStore = new SessionStore({ mongooseConnection: dbConnection });

/*
 * MiddleWares
 */
if (config.dev) {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  name: 'thiscordia.sid',
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));

io.use(passportSocketIO.authorize({
  cookieParser: require('cookie-parser'),
  key: 'thiscordia.sid',
  secret: config.sessionSecret,
  store: sessionStore
}));
io.on('connection', socket => connectSocket(io, socket));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

/*
 * Global variables
 */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next()
});

/* 
 * Routes
 */
app.use('/', mainRoutes);
app.use('/users', userRoutes);

//sets static folder
app.use(express.static(join(__dirname, 'public')))

//starts server listening
server.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));
