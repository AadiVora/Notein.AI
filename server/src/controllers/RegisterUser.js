const userModel = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
 
const registerUser = async(req, res)=>{
    // const username = req.body.name
    // const { email, password} = req.body;
    // const user = new userModel();
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        if(!username || !email || !password){
            return res.status(422).json({message: "Fill all details"});
        }

        const existUser = await userModel.findOne({username: username})

        if(existUser){
            console.log('user exists')
            return res.status(422).json({message: "User exists"})
        }

        const saveUser = new userModel({username: req.body.name, email: req.body.email, password: req.body.password});
        const user = saveUser.save();
        console.log(saveUser);

        // const token = jwt.sign({username: saveUser.username, id: saveUser._id}, "thisisasecretkey");

        return res.status(200).json({message: "Registration Successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.messgae})
    }

}

module.exports = registerUser