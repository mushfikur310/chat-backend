import  {} from 'dotenv/config';
import { MongoClient } from 'mongodb';
import MonogUriBuilder from 'mongo-uri-builder';

//Extracted all MongoDB variables .env file.
let cons={}

let {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB_NAME,
    MONGO_USERNAME,
    MONGO_PASSWORD
} = process.env

//Check if all the mongo variables are set or not.
if(!MONGO_HOST){
    console.error("MONGO_HOST is not defined,Please check .env settings.");
    process.exit(1);
}
if(!MONGO_PORT){
    console.error("MONGO_PORT is not defined,Please check .env settings.");
    process.exit(1);
}
if(!MONGO_DB_NAME){
    console.error("MONGO_DB_NAME is not defined, Please check .env settings.");
    process.exit(1);
}

let mongoConnectionSettings = {
    host: MONGO_HOST,
    port: MONGO_PORT,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD
};

export default function db(){
    return new Promise((resolve,reject)=>{
        let databaseName = MONGO_DB_NAME;
        
        //Check if DB connection is already available or not
        if(typeof cons[databaseName] !== "undefined"){
            resolve(cons[databaseName]);
        }

        MongoClient.connect(
            MonogUriBuilder({
                ...mongoConnectionSettings,
                database: databaseName
            }),
            { useNewUrlParser :true},
            (err,newDB) => {
                if(err){
                    console.error('Error in connection in new DB.');
                    reject(err)
                }

                //save connection for later
                cons[databaseName] = newDB.db(databaseName);
                resolve(cons[databaseName]);
            }
        )
    })
}