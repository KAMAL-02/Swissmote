const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const signin = async(req) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return ({error : "Missing required fields"});
    }

    try{
        const user = await User.findOne({email});
        if(user) return ({error : "User already exists"});

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if(!newUser) return ({error : "User not created"});

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
        return ({ message: "User created successfully", newUser, token });
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
        return ({ message: "Login successful", name: user.name, token });
    } catch (error) {
        console.log(error);
        return ({error : error.message});
    }
}

module.exports = { signin, login };