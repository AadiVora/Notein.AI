const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname,'..','..','.env')});

async function connectDB() {
    mongoose.connect("mongodb+srv://sem5:pass123@cluster0.pjn4ow7.mongodb.net/notes?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    } ).then(()=>{
        console.log("Connection successfull");
    }).catch((e)=>{
        console.log(e);
    })
}

module.exports = {
    connectDB,
}