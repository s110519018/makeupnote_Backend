const mongoose = require('mongoose');

const makeupsdataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  color_choose: { type: Array, required: true },
  color_code_choose: { type: Array, required: true },
});

const makeupsdataModel = mongoose.model("MakeupsData", makeupsdataSchema);

module.exports = makeupsdataModel;