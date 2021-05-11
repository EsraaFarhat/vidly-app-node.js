const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    //* Handel uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log'})
    );

    // * Handel unhandled rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
    winston.add(new winston.transports.File({ filename: 'logfile.log'}));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'info'                            
        }));
}