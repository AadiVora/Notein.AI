const UserModel = require('../models/userModel.js')
const auth = require('../models/userModel.js')
const cookieParser = require('cookie-parser')

const loginUser = async (req, res) => {
    const username = req.body.name;
    // const email = req.body.email;
    const password = req.body.password;
    // console.log(username)
    // console.log(password)
    // if(!username || !password){
    //     return res.json({message: "*Fill all the fields"})
    // }


    try {
        const user = await UserModel.findOne({ username: username })

        if (user) {
            if (password != user.password) {
                return res.status(422).json("Wrong password")
            }

            // const token = jwt.sign({username: user.username, id: user._id}, "thisisasecretkey");

            const token = await user.generateAuthToken();

            res.cookie("name", username)
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000),     //30days
                httpOnly: true
            })

            console.log(user);
            return res.status(200).json({ user, message: "Successfully Logged In" })
        }

        return res.status(422).json({ message: "User does not exist" })

    } catch (error) {
        console.log(error);
        res.status(422).json({ message: error.message })

    }
}

module.exports = loginUser