const express = require('express');
const path = require('path'); 
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// connecting to front end
const DIST_DIR = path.join(__dirname, '../dist'); 
const frontEnd = path.join(DIST_DIR, 'index.html');
const api_routes = require('./app_api/routes/api');
const front_routes = require('./app_api/routes/front');



// connecting to db
const expressMongoDb = require('express-mongo-db');


// MUST EXCEPTION HANDLE FOR THIS FUNCTION
var dbURI = "mongodb://localhost:27017/bigchain";
if (process.env.NODE_ENV === 'production') {
  dbURI = 'enterProdURL';
}

var options = { 
    useNewUrlParser: true, 
    poolSize: 10, 
    reconnectTries: 60, 
    reconnectInterval: 500, 
    useUnifiedTopology: true
  };

// view engine setup
app.set('views', path.join(__dirname, '../app_api/views'));
app.set('view engine', 'jade');

app.use(expressMongoDb(dbURI,options));


// Handles any requests that don't match the ones above
app.use(express.static(DIST_DIR));
app.get('/', (req, res) => {
  res.sendFile(frontEnd); // EDIT
 });


var ctrlhealthData = require('./app_api/controllers/healthQuery');

app.get('/api/assets/searchAll',ctrlhealthData.getAllAssets);

app.get('/api/assets/searchName/:_id', ctrlhealthData.getName_ID);

app.get('/api/assets/searchDisease/:_id',ctrlhealthData.getDisease_ID);

app.get('api/assets/summaryDisease/',ctrlhealthData.getDisease_Summary);

app.get('/api/assets/searchResponse/:_id',ctrlhealthData.getResponse_ID);

app.get('api/assets/summaryResponse',ctrlhealthData.getResponse_Summary);

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
