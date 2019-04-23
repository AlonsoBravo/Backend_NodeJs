'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = Schema({
	name: String,
	description: String,
	category: String,
	langs:[String],
	year: Number
});

module.exports = mongoose.model('projects',projectSchema);