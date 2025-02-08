const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const signin = async(req, res) => {
    res.send("Hello from signin");
}

const login = async(req, res) => {
    res.send("Hello from login");
}

module.exports = { signin, login };