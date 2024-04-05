import dotenv from 'dotenv';
dotenv.config();

import { dbConnect } from './src/configs/db.configs.js';
dbConnect();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session'; // Import express-session
import { Strategy as LocalStrategy } from 'passport-local';

import userRouter from './src/routes/user.router.js';
import projectRouter from './src/routes/project.router.js';
import categoryRouter from './src/routes/category.router.js';

const USERNAME = process.env.ADMIN_USERNAME;
const PASSWORD = process.env.ADMIN_PASSWORD;

passport.use(new LocalStrategy((username, password, done) => {
  if (username === USERNAME && password === PASSWORD) {
    return done(null, { username: USERNAME });
  } else {
    return done(null, false, { message: 'Invalid username or password' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  if (username === USERNAME) {
    done(null, { username: USERNAME });
  } else {
    done(new Error('Invalid username'));
  }
});

const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'your-secret-key', // Specify a secret key for session encryption
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // Initialize Passport.js session support

//Routers
app.use('/auth', userRouter);
app.use('/project', projectRouter);
app.use('/category', categoryRouter);

const port =  process.env.PORT || 3003;
app.listen(port, () => {
    console.log("serveris running on http://localhost:" + port);
});
