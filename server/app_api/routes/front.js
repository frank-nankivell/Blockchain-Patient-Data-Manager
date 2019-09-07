var express = require('express');
var router = express.Router();
const path = require('path'); 
const DIST_DIR = path.join(__dirname, '../dist'); 
const frontEnd = path.join(DIST_DIR, 'index.html');

router.get('*', (req,res) =>{
    res.sendFile(path.join(frontEnd));
});

module.exports = router;