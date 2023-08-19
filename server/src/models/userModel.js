const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    tokens: [
        {
            token: {
                type: String,
            }
        }
    ],

    notes: [{
        folderName: {
            type: String
        },

        files: [{
            name: {
                type: String
            },
                      
            content: {
                type: String
            },

            favourites: {
                type: Boolean,
                default: false
                }
        }],
    
    }]

    // trial: []

    // notes:[],
    // content: [],
    // favourites: []

})

UserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token
    } catch (error) {
        console.log(error);
    }
}

const UserModel = new mongoose.model("userModel", UserSchema)
module.exports = UserModel