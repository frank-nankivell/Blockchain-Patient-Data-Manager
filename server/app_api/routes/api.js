var express = require('express');
var router = express.Router();

var ctrlhealthData = require('../controllers/healthQuery');

router.get('/api/assets/searchAll',ctrlhealthData.getAllAssets);

router.get('/api/assets/searchName/:_id', ctrlhealthData.getName_ID);

router.get('/api/assets/searchDisease/:_id',ctrlhealthData.getDisease_ID);

router.get('api/assets/summaryDisease/',ctrlhealthData.getDisease_Summary);

router.get('/api/assets/searchResponse/:_id',ctrlhealthData.getResponse_ID);

router.get('api/assets/summaryResponse',ctrlhealthData.getResponse_Summary);


module.exports = router;
