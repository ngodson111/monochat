const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      id: ObjectId,
      username: String,
      photo: String,
      state: String,
      time: String,
    },
  ],
  status: {
    type: String,
    default: "offline",
  },
  messages: [
    {
      id: ObjectId,
      username: String,
      photo: String,
      message: [
        {
          id: ObjectId,
          msg: String,
          identifier: String,
          time: String,
        },
      ],
      state: String,
      time: String,
    },
  ],
  photo: {
    type: String,
    default: "initialUser.png",
  },
});

mongoose.model("Auth", authSchema);
