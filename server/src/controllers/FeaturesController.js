const { spawn } = require('child_process');
const { parse } = require('csv-parse');
const fs = require('fs');
const tesseract = require('node-tesseract-ocr');
const path = require('path');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();
var BrainJSClassifier = require('natural-brain');

var classifier = new BrainJSClassifier();

const trainSentimentModel = async () => {

    try {
        fs.createReadStream(path.join(__dirname, '..', 'Datasets', 'sentiment_data.csv'))
            .pipe(parse({
                columns: true,
            }))
            .on('data', (data) => {
                classifier.addDocument(data['text'], data['sentiment']);
            })
            .on('error', (err) => {
                console.log(err);
            })
            .on('end', () => {
                classifier.train();
                console.log('Data Stream Ended!');
            });
    } catch (err) {
        console.log(err);
    }
}

const sentimentAnalysis = async (req, res) => {
    const text = req.body.input;
    console.log(text);

    const lexedReview = aposToLexForm(text);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    const { WordTokenizer } = require('natural');
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })

    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = require('natural');
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);
    console.log(analysis);
    res.status(200).json({ analysis });
    // try {
    //     return res.json(classifier.getClassifications(text));
    // } catch(err) {
    //     console.log(err);
    // }    
}

// const grammarChecker = (req, res) => {
//     let data1;

//     const pythonOne = spawn('python3', ['../scripts/grammar.py'])

//     pythonOne.stdout.on('data', function(data) {
//         data1 = data.toString();
//     })
//     pythonOne.on('close', (code) => {
//         console.log("code" + code);
//         res.send(data1);
//     } )
// }

const imageToText = async (req, res) => {
    try {
        const config = {
            lang: 'eng',
            oem: 1,
            psm: 3,
        };

        tesseract.recognize('file_path', config)
            .then((text) => {
                return res.send(text);
            })
            .catch((error) => {
                console.log(error.message);
            });
    } catch (err) {
        console.log(err);
    }
}

//grammarChecker();

module.exports = {
    trainSentimentModel,
    sentimentAnalysis,
    // grammarChecker,
    imageToText,
}