const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authen = require('./middleware/Authen.js');
const SaveController = require('./controllers/SaveController.js');
const { connectDB } = require('./db/conn.js');
dotenv.config({ path: '../config.env' });
const { spawn } = require('child_process');
const { trainSentimentModel } = require('./controllers/FeaturesController.js')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
}));

const PORT = process.env.PORT || 8888;



//middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//routes
const FirstRouter = require('./routes/FirstRoute.js');
const NotesRouter = require('./routes/NotesRoute.js');
const FeaturesRouter = require('./routes/FeaturesRoute.js');

app.use('/auth',  FirstRouter);
app.use('/notes', NotesRouter);
app.use('/features', FeaturesRouter);

app.post('/features/grammar', (req, res) => {
    const text = req.body.input;
    var dataReceived = "";
    console.log(text);
    const python = spawn('python3', ['grammar.py', text]);

    python.stdout.on('data', (data) => {
        console.log('Correcting grammar....');
        dataReceived = data.toString();
    });
    python.on('close', () => {
        var result = dataReceived.replace('[','').replace(']','');
        res.json(result);
    });
})

async function startServer() {
    await connectDB();
    // await trainSentimentModel();
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    })
}

startServer();