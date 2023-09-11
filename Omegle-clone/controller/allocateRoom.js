const Room = require('../models/Room');
const {v4:uuidv4} = require('uuid');

const allocate = async(req, res) => {
    let vacantRoom = await Room.findOne({ vacant: true });
    if ( vacantRoom && (vacantRoom.allowedCount< 2) ) {
        vacantRoom.allowedCount += 1;
        vacantRoom.vacant = vacantRoom.allowedCount < 2 ? true : false;
        vacantRoom = await vacantRoom.save();
        return res.render('index' , {RoomId: vacantRoom.roomId});
    }
    const roomId = uuidv4();
    const allowedCount = 1;
    const vacant = true;

    vacantRoom = await Room.create({
        roomId,
        allowedCount,
        vacant, 
    });
    return res.render('index' , {RoomId: vacantRoom.roomId});
}

const deallocate = async(roomId) => {
    let exisitingRoom = await Room.findOne({ roomId });
    exisitingRoom.allowedCount -= 1;
    exisitingRoom.vacant = exisitingRoom.allowedCount < 2 ? true : false;
    exisitingRoom = await exisitingRoom.save();
}

module.exports = {
    allocate,
    deallocate
};