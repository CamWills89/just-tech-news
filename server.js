const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
//the 'sync' means that Sequelize is taking models and connecting them to the database tables
//"{force: false}" is not required. if it was true, it would reset the db tables on startup
//which is great for when we make changes to Sequelize models. for now, we keep it false
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});