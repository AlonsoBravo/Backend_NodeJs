'use strict'

var controller = {

	home: function(req, res){
		return res.status(200).send({
			message: 'Estas en home'
		});
	},

	test: function(req, res){
		return res.status(200).send({
			message:'Estas en test'
		});
	}

};

module.exports = controller;