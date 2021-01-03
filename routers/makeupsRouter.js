const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const data = require("../data.js");
const MakeupsData = require("../models/makeupsdataModel.js");
// const Makeups = require("../models/makeupsModel.js");
const User = require('../models/userModel');
const { getToken, isAuth } = require("../util");

const makeupsRouter = express.Router();

//獲取內建資料
makeupsRouter.get(
  "/makeupsdata",
  expressAsyncHandler(async (req, res) => {
    const makeupsdata = await MakeupsData.find({});
    res.send(makeupsdata);
  })
);
// //新增內建資料
// makeupsRouter.get(
//   "/create/makeupsdata",
//   expressAsyncHandler(async (req, res) => {
//     await MakeupsData.deleteMany({});
//     const createdmakeupsdata = await MakeupsData.insertMany(data.makeupsdata);
//     res.send({ createdmakeupsdata });
//   })
// );
//獲取美妝品資料
makeupsRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    const userInfo = await User.findOne({"_id":id});
    if (userInfo) {
      res.send(userInfo.makeups);
    } else {
      res.status(404).send({ message: "Makeups Not Found" });
    }
  })
);
//新增美妝資料
makeupsRouter.post(
  "/addmakeups",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    var ObjectID = require('mongodb').ObjectID;
    const { title,img,time,tag_array,qty,color_code,note,id } = req.body;
    var makeups_id = new ObjectID()
    const userInfo = await User.findOneAndUpdate({_id: id}, {
      $addToSet: {'makeups': {
        _id: makeups_id, 
        title: title,
        img:img,
        time:time,
        tag_array:tag_array,
        qty:qty,
        color_code:color_code,
        note:note
      }}
    }, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      console.log(doc);
    });
    res.send(userInfo.makeups);
  })
);
//獲取某美妝
makeupsRouter.post(
  "/:makeup_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    const makeup = await User.find(
      {_id: id}, 
      {makeups: {$elemMatch: {_id: req.params.makeup_id}}});

    if (makeup) {
      res.send(makeup[0].makeups[0]);
    } else {
      res.status(404).send({ message: "Makeup Not Found" });
    }
  })
);
//刪除美妝品
makeupsRouter.delete(
  "/:makeup_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    const userInfo = await User.findOneAndUpdate({_id: id}, {
      $pull: { "makeups" : { _id: req.params.makeup_id } }
    }, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when delete data!");
      }
      console.log(doc);
    });
    res.send(userInfo.makeups);
  })
);
//編輯美妝
makeupsRouter.put(
  "/:makeup_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
      const { title,img,time,tag_array,qty,color_code,note,id } = req.body;
      const makeup = await User.findOneAndUpdate( {_id : id , "makeups._id" : req.params.makeup_id } , 
      {$set : {
        "makeups.$.title": title,
        "makeups.$.img":img,
        "makeups.$.time": time,
        "makeups.$.tag_array": tag_array,
        "makeups.$.qty": qty,
        "makeups.$.color_code": color_code,
        "makeups.$.note":note
      } } , {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
      });
      
  
      if (makeup) {
        const userInfo = await User.findOne({"_id":id});
        if (userInfo) {
          res.send(userInfo.makeups);
        } else {
          res.status(404).send({ message: "Makeups Not Found" });
        }
      } else {
        res.status(404).send({ message: "ChangeMakeup Failed" });
      }
    })
);
//獲取有包含這個Tag的美妝品
makeupsRouter.post(
  "/containTag/:tag",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    var mongoose = require('mongoose')
    const makeup =await User.aggregate([
      // you can remove this to return all your data
      {$match:{"_id": mongoose.Types.ObjectId(id) }},
      // unwind array of items
      {$unwind:"$makeups"},
      // filter out all items not in 10, 11
      {$match:{"makeups.tag_array":{$regex : req.params.tag}  }},
      // aggregate again into array
      {$group:{_id:"$_id", "makeups":{$push:"$makeups"}}}
    ])
    if (makeup) {
      res.send(makeup[0].makeups);
    } else {
      res.status(404).send({ message: "Makeup Not Found" });
    }

  })
);

module.exports = makeupsRouter;
 