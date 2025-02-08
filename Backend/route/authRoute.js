const express = require('express');
const router = express.Router();
const { signin, login } = require('../controller/authController');


router.post('/signin', (req, res) =>{
    signin(req).
    then((response) => {
        if(response.error){
            res.status(400).json({...response});
        }else{
            res.status(200).json({...response});
        }
    }).catch((err) => {
        res.status(400).json({...err});
    })
})

router.post('/login', (req, res) => {
    login(req)
    .then((response) => {
        if(response.error){
            res.status(400).json({...response});
        }else{
            res.status(200).json({...response});
        }
    }).catch((err) => {
        res.status(400).json({...err});
    });
})

module.exports = router;