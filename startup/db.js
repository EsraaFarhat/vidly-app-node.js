const winston = require('winston');
const mongoose =  require('mongoose');
const config = require('config');

module.exports = function () {
    mongoose.connect(config.get('db'), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => winston.info("connected to MongoDB..."))

}