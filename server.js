const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require('path');
//setup Handlebars.js as the template engine
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const app = express();
const PORT = process.env.PORT || 3001;
//allows us to use express-session and then link to sequelize store (for cookies)
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//creating sess obj (short for session) to save our session token into 
//"Super secret secret" should be replaced by an actual secret and stored in the .env file
//if we wanted to set properties on our cookies, eg maximum age, we would add them into the object.
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//connect the css file
//express.static() is middleware that takes all folder contents
//and serves them as static assets. Useful for front-end
// files like images, style sheets, and JavaScript files
//in this case we use it to serve up the static css file
app.use(express.static(path.join(__dirname, 'public')));
//middleware to use the session obj token
//sets up an Express.js session and connects the session to our Sequelize database
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
//the 'sync' means that Sequelize is taking models and connecting them to the database tables
//"{force: false}" is not required. if it was true, it would reset the db tables on startup
//which is great for when we make changes to Sequelize models. for now, we keep it false
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
