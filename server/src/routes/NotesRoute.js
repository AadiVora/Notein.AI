const express = require('express')
const {createFolder, createFile, editContent, favourites, deleteFile} = require('../controllers/NotesController.js')
const router = express.Router();
const authen = require('../middleware/Authen.js')

router.post('/createfolder', authen, createFolder)
router.post('/createfile', authen, createFile)
router.post('/editcontent', authen, editContent)
router.post('/favourites', authen, favourites)
router.post('/delete', authen, deleteFile)



module.exports  = router