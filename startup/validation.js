const Joi = require('joi');

module.exports = function (params) {
    Joi.objectId = require('joi-objectid')(Joi);
}