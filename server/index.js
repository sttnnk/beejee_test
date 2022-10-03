require('@babel/register');
require('dotenv').config();
const express = require('express');
const app = express();

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const logger = require('morgan');
const path = require('path');

const cors = require('cors'); 

const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const filterRouter = require('./routes/filter');

const PORT = process.env.PORT;

const sessionConfig = {
  name: 'sid',
  store: new FileStore(),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 10,
  },
};

const corsOptions = {
  origin: ['http://localhost:3000'],    
  credentials: true,      
  optionSuccessStatus:200
}

app.use(cors(corsOptions))
app.use(session(sessionConfig));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.use('/filter', filterRouter);

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
