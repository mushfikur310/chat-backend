import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {} from 'dotenv/config';
import Routes from './routes/routes';
import {socketServer} from './socket/socket';

const app = express();
const {PORT} = process.env;

if(!PORT){
    console.error('PORT is not defined, Please check .env settings.');
    process.exit(1);
}
app.use(cors());
app.use(bodyParser({limit: '50mb'}));

//Define Routes.
app.use("/chat",Routes);

socketServer(app).listen(PORT);