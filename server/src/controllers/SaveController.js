// const userModel = require('../models/userModel.js')
// const cookieParser = require('cookie-parser')
// const authen = require('../middleware/Authen.js')

// const saveNotes = async(req, res, )=>{ 

//     const fileName = req.body.fileName;
//     const folderName = req.body.folderName
//     const content = req.body.content;
//     try {
//         // const name = req.cookies.name;
//         const name = "aadi";
//         if(name){
//             const user = await userModel({username: name});


//             await user.updateOne({username: name}, {$push:{trial: {content}}})

//             return res.send("done")
//         }

//         else{
//             console.log("user not");
//             return res.status(404).json("User not found")
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

// module.exports = saveNotes




const UserModel = require('../models/userModel.js')
const cookieParser = require('cookie-parser')
const authen = require('../middleware/Authen.js')

const saveNotes = async (req, res,) => {

    const fileName = req.body.fileName;
    const folderName = req.body.folderName
    const content = req.body.content;
    try {
        // const name = req.cookies.name;
        const name = "rohit";
        if (name) {
            let user = await UserModel.findOne({ username: name });

            //new folder
            if (!fileName && !content) {
                await UserModel.updateOne(user, {
                    $push: {
                        notes: {
                            folderName: folderName,
                            files: {
                                name: '',
                                content: '',
                                favourites: false
                            }
                        }
                    }
                });
                user.save();
                return res.send("Folder created")

            }

            //new file in same folder
            // if (folderName && content && fileName) {
                await UserModel.updateOne(user, { $push: { "notes.$[elem].files":   { name: fileName, content: content, favourites: false } }  }, { arrayFilters: [{ "elem.folderName": folderName }] })

                user.save();
                // console.log(user);
                return res.send("File stored");

            // }



            return res.send("done")
        }

        else {
            console.log("user not");
            return res.status(404).json("User not found")
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = saveNotes