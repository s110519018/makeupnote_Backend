const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    year: { type: String, required: true },
    month: { type: String, required: true },
    day: { type: String, required: true },
    sex: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    makeups:[
      { 
        _id: {type: String, required: true},
        title: { type: String, required: true },
        img: { type: String, required: true },
        time: { type: String, required: true },
        tag_array: { type: Array, required: true },
        qty: { type: String, required: true },
        color_code: { type: String, required: true },
        note: { type: String, required: false }
      }
    ],
    methods:[
      {
        _id: {type: String, required: true},
        title: { type: String, required: true },
        website: { type: String, required: true },
        tag_array: { type: Array, required: true },
      }
    ]
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;