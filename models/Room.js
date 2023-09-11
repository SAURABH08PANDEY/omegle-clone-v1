const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  allowedCount: {
    type: Number,
  },
  vacant: {
    type: Boolean
  }
});

module.exports = mongoose.model("Room", RoomSchema);