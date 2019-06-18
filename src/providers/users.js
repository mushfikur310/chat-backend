import db from '../utils/db';
import {checkHashedPassword,createHashPassword} from '../utils/authenticate';
import {generateToken} from '../utils/token';

import mongodb from 'mongodb';

export default class Users {

    /**
     * @function
     * @instance
     * @memberof Users
     * @name OnUserExits
     * @param { String } username
     * @description check if user exists or not in the database by using username.
     */
    OnUserExists = async username =>{
        try{
            const dbc = await db();
            const isExist = await dbc.collection('users').findOne({username});
            if(!isExist){
                console.log("User doesn't exist");
                throw "User doesn't exist";
            }
            return {
                status: true,
                message: 'One user found',
                data: isExist
            };
        }catch(ex){
            console.error('Error in finding user from database.',ex);
            return {
                status: false,
                message: 'Error in finding user',
                error: ex
            };
        }
    }

    /**
     * @function
     * @instance
     * @memberof Users
     * @name OnSignIn
     * @param { String, String } username,password
     * @description signin both new and old user.
     */

     OnSignIn = async(username,password) =>{
         try{
            const dbc = await db();
            let isExist = await this.OnUserExists(username);
            if(!isExist.status){
                let createPasswordHash = createHashPassword(password);
                let newUser = {
                    username,
                    password: createPasswordHash,
                    createdAt: new Date()
                };
                let {result} = await dbc.collection('users').insertOne(newUser);
                if(result.ok !=1){
                    throw 'Error in creating new user.';
                }
                return {
                    data: {
                        username,
                        token: generateToken(username,password)
                    }
                }
            }
            if(!checkHashedPassword(password,isExist.data.password)){
                console.log('Password mismatch');
                throw 'Authentication failed, wrong password!!';
            }

            return {
                data: {
                    username,
                    token: generateToken(username,password)
                }
            }
         }catch(ex){
             console.error('Error in signin user.',ex);
             throw ex;
         }
     }

     /**
     * @function
     * @instance
     * @memberof Users
     * @name OnSignOut
     * @param N/A
     * @description signout.
     */

     OnSignOut = async(user) => {
         try{
            const dbc = await db();
            let rooms = await dbc.collection('rooms').find().toArray();
            rooms.map(async room=>{
                room.connections = room.connections.filter((conn)=>conn.username !== user.username);
                await dbc.collection('rooms').updateOne(
                    {_id: new mongodb.ObjectID(room._id)},
                    {$set: {connections: room.connections}}
                )
            })
            return true;
         }catch(ex){
            console.error('Error in signout',ex);
            throw ex;
         }
     }
    
}