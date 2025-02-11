const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const signin = async(req) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return ({error : "Missing required fields"});
    }

    try{
        const oldUser = await User.findOne({email});
        if(oldUser) return ({error : "User already exists"});
        console.log(name, email, password);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        console.log(user);
        if(!user) return ({error : "User not created"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        return ({ message: "User created successfully", user, token });
    }catch(err){
        console.log(err);
        return ({error : err.message});
    }
}

const login = async(req) => {
    const { email, password } = req.body;
    if(!email || !password) return ({error : "Missing required fields"});

    try {
        const user = await User.findOne({email});
        if(!user) return ({error : "User not found"});

        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch) return ({error : "Invalid credentials"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        return ({ message: "Login successful", user, token });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

module.exports = { signin, login };