import db from "../utils/db";
import mongodb from 'mongodb';


export default class Rooms {

    /**
     * @function
     * @instance
     * @memberof Rooms
     * @name OnCreateRoom
     * @param {String} roomName
     * @description create a new room
     */

    OnCreateRoom = async(roomName)=>{
        try{
            const dbc = await db();
            let newChatRoom = {
                name: roomName,
                connections: [],
                createdAt: new Date()
            };
            let { result } = await dbc.collection('rooms').insertOne(newChatRoom);
            if(result.ok !=1){
                throw "Error while creating chat room."
            }
            const roomLists = await dbc.collection('rooms').find().sort({_id:-1}).toArray();
            return roomLists;
        }catch(ex){
            console.log('Error while creating room',ex);
            throw ex;
        }
    }

    /**
     * @function
     * @instance
     * @memberof Rooms
     * @name OnGetAllRooms
     * @param N/A
     * @description get all room lists
     */

    OnGetAllRooms = async() =>{
        try{
            const dbc = await db();
            const rooms = await dbc.collection('rooms').find().sort({_id:-1}).toArray();
            return rooms;
        }catch(ex){
            console.log("While getting all rooms",ex);
            throw ex;
        }
    }

    /**
     * @function
     * @instance
     * @memberof Rooms
     * @name OnGetSingleRoom
     * @param N/A
     * @description get a single room.
     */

    OnGetSingleRoom = async(roomId,user,socketId) =>{
        try{
            const dbc = await db();
            let room_id = new mongodb.ObjectID(roomId);
            let room = await dbc.collection('rooms').findOne({_id: room_id});
            if(!room){
                throw "Room doesn't exist";
            }
            let flag = false;
            room.connections.map(conn=>{
                if(conn.username === user && conn.socketId === socketId){
                    flag=true;
                }
            })
            if(!flag){
                let connectedUser = {
                    username: user,
                    socketId: socketId
                }
                let {result} = await dbc.collection('rooms').updateOne(
                    {_id:room_id},
                    {$push: {connections: connectedUser}}
                );
                if(result.ok!=1){
                    throw 'Error in adding user to the room.'
                }
            }
            return true;
        }catch(ex){
            console.log("Eoor in getting single room",ex);
            throw ex;
        }
    }
}