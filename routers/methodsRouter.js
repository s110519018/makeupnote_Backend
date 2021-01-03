const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const data = require("../data.js");
// const Methods = require("../models/methodModel.js");
const User = require('../models/userModel');
const { getToken, isAuth } = require("../util");

const methodsRouter = express.Router();

//獲取方法資料
methodsRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    const userInfo = await User.findOne({"_id":id});
    if (userInfo) {
      res.send(userInfo.methods);
    } else {
      res.status(404).send({ message: "Methods Not Found" });
    }
  })
);
//新增方法資料
methodsRouter.post(
  "/addmethods",
  isAuth,
  expressAsyncHandler(async (req, res) => {

    var ObjectID = require('mongodb').ObjectID;
    const { title,website,tag_array,id } = req.body;
    var methods_id = new ObjectID()
    const userInfo = await User.findOneAndUpdate({_id: id}, {
      $addToSet: {'methods': {
        _id: methods_id, 
        title: title,
        website: website,
        tag_array:tag_array,
      }}
    }, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      console.log(doc);
    });
    res.send(userInfo.methods);
  })
);
//刪除方法
methodsRouter.delete(
  "/:method_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {

    const {id} = req.body;
    const userInfo = await User.findOneAndUpdate({_id: id}, {
      $pull: { "methods" : { _id: req.params.method_id } }
    }, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when delete data!");
      }
      console.log(doc);
    });
    res.send(userInfo.methods);
  })
);
//編輯方法
methodsRouter.put(
  "/:method_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {

    const { title,website,tag_array,id } = req.body;
    const method = await User.findOneAndUpdate( {_id : id , "methods._id" : req.params.method_id } , 
    {$set : {
      "methods.$.title": title,
      "methods.$.website":website,
      "methods.$.tag_array": tag_array,
    } } , {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      console.log(doc);
    });
    

    if (method) {
      const userInfo = await User.findOne({"_id":id});
      if (userInfo) {
        res.send(userInfo.methods);
      } else {
        res.status(404).send({ message: "Methods Not Found" });
      }
    } else {
      res.status(404).send({ message: "ChangeMakeup Failed" });
    }

    })
);
//獲取有包含這個Tag的方法
methodsRouter.post(
"/containTag/:tag",
isAuth,
expressAsyncHandler(async (req, res) => {

  const {id} = req.body;
  var mongoose = require('mongoose')
  const method =await User.aggregate([
    // you can remove this to return all your data
    {$match:{"_id": mongoose.Types.ObjectId(id) }},
    // unwind array of items
    {$unwind:"$methods"},
    // filter out all items not in 10, 11
    {$match:{"methods.tag_array":{$regex : req.params.tag}  }},
    // aggregate again into array
    {$group:{_id:"$_id", "methods":{$push:"$methods"}}}
  ])
  if (method) {
    res.send(method[0].methods);
  } else {
    res.status(404).send({ message: "Method Not Found" });
  }

})
);

module.exports = methodsRouter;
