import express from 'express';
import path from "path";
import { WebPayController } from './controller/webpay.controller';
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const cookieParser = require("cookie-parser");
console.log(`Your port is ${process.env.PORT}`); // undefined
const dotenv = require('dotenv');
dotenv.config();


const app = express()
const PORT : string|number = process.env.PORT || 3000;

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    if (process.env.WPP_CC && process.env.WPP_KEY) {
        console.log('==========================================PRODUCTION==============================================');
        WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY);
    } else {
        console.log('==========================================TEST==============================================');
        WebpayPlus.configureWebpayPlusForTesting();
    }
    next();
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/webpay-plus/create', WebPayController.createTransaction);
app.post('/webpay-plus/commit', WebPayController.commitTransaction);

app.listen(PORT,() => console.log(`hosting ${PORT}`));