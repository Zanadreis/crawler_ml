'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logSchema = new Schema({
    search: {
        type: String
    },
    limit: {
        type: String
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Logs', logSchema);