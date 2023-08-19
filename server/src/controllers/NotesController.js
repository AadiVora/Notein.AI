const UserModel = require('../models/userModel.js')
const cookieParser = require('cookie-parser')
const authen = require('../middleware/Authen.js')


//create folder
const createFolder = async (req, res) => {

    const folderName = req.body.folderName
// const name = "test"
    try {
        const name = req.cookies.name;

        let user = await UserModel.findOne({ username: name });

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
        return res.status(200).json("Folder created")


    } catch (error) {
        console.log(error);
        res.json("Database error occured")
    }
}


//create file
const createFile = async (req, res) => {
    const fileName = req.body.fileName;
    const folderName = req.body.folderName
    const content = req.body.content;

    try {
        const name = req.cookies.name;
        // const name = "test"

        let user = await UserModel.findOne({ username: name });

        await UserModel.updateOne(user, { $push: { "notes.$[elem].files": { name: fileName, content: content, favourites: false } } }, { arrayFilters: [{ "elem.folderName": folderName }] })

        user.save();

        return res.status(200).json("File stored");
    } catch (error) {
        res.json("Database error occured")
    }
}


//edit file content
const editContent = async (req, res) => {
    const fileName = req.body.fileName;
    const folderName = req.body.folderName
    const content = req.body.content;

    try {
        const name = req.cookies.name;
        // const name = "test"

        let user = await UserModel.findOne({ username: name });

        await UserModel.updateOne(user, {
            $set: {
                "notes.$[elem1].files.$[elem2].content": content
            }
        }, { arrayFilters: [{ "elem1.folderName": folderName }, { "elem2.name": fileName }] });

        user.save();

        return res.status(200).json("Content changed");
    } catch (error) {
        res.json("Database error occured")
    }
}


//favourites
const favourites = async (req, res) => {
    const fileName = req.body.fileName;
    const folderName = req.body.folderName
    const fav = req.body.favourites;
    try {
        const name = req.cookies.name;
        // const name = "test"

        let user = await UserModel.findOne({ username: name });
        // console.log(user.notes[0].files[1].favourites);


        await UserModel.updateOne(user, {
            $set: {
                "notes.$[elem1].files.$[elem2].favourites": fav
            }
        }, { arrayFilters: [{ "elem1.folderName": folderName }, { "elem2.name": fileName }] });

        user.save();

        return res.status(200).json("Added to favourites");

    } catch (error) {
        res.json("Database error occured")
    }
}

//delete a file
const deleteFile = async (req, res) => {
    const fileName = req.body.fileName;
    const folderName = req.body.folderName

    try {
        const name = req.cookies.name;
        // const name = "test"

        let user = await UserModel.findOne({ username: name });

        await UserModel.updateOne(user, {
            $pull: {
                "notes.$[elem1].files": { "name": fileName }
            }
        }, { arrayFilters: [{ "elem1.folderName": folderName }] });

        user.save();

        return res.status(200).json("File deleted");


    } catch (error) {
        res.json("Database error occured")
    }
}

module.exports = {
    createFolder,
    createFile,
    editContent,
    favourites,
    deleteFile,
}