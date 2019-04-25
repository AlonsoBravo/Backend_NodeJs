'use strict'

var Project = require('../models/project');
var fs = require('fs');

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
	},

	//metodo para guardar un proyecto en base de datos
	saveProject: function(req, res){

		var project = new Project();

		var params = req.body;

		//parametros de la peticion por POST que van incrustados al body de la peticion
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		//se guardan los datos dentro de la variable params en base de datos.
		project.save((err,projectStored) => {

			if(err) return res.status(500).send({massage:' Error al guardar en base de datos'});

			if(!projectStored) return res.status(404).send({message:'No se ha podido guardar el proyecto'});

			return res.status(200).send({project: projectStored});

		});
	},

	//metodo para listar proyectos
	getProjects: function(req,res){

		Project.find({}).exec((err,projects) => {

			if(err) return res.status(500).send({message:'Error al devolver los datos'});

			if(!projects) return res.status(404).send({message:'No hay proyectos para mostrar'});

			return res.status(200).send({projects});

		});
	},

	//metodo para actualizar un proyecto
	updateProject: function(req, res){

		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {

			if(err) return res.status(500).send({message:'Error al actualizar datos'});

			if(!projectUpdated) return res.status(404).send({message:'No existe el proyecto para actualizar'});

			return res.status(200).send({project: projectUpdated});

		});
	},

	//metodo para eliminar proyectos
	deleteProject: function(req, res){

		var projectId = req.params.id;
		
		Project.findByIdAndDelete(projectId, (err, projectDelete)=>{

			if(err) return res.status(500).send({message:'Error al borrar el proyecto'});

			if(!projectDelete) return res.status(404).send({message:'No se encuentra el proyecto'});

			return res.status(200).send({project: projectDelete});

		});

	},

	//metodo para subir archivos
	uploadImage:function(req, res){

		var projectId = req.params.id;
		var fileName = 'Imagen no subida...';

		if(req.files){

			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var fileName = fileSplit[1];
			var exSplit = fileName.split('\.');
			var fileExt = exSplit[1];

			if(fileExt == 'jpeg' || fileExt == 'jpg' || fileExt == 'gif' || fileExt == 'png') {

				Project.findByIdAndUpdate(projectId, {image: fileName}, {new:true}, (err, projectUpdate)=>{
					
					if(err) return res.status(500).send({message :'Error al subir archivo'});

					if(!projectUpdate) return res.status(404).send({message: 'No existe proyecto'});

					return res.status(200).send({files: fileName});
				});
			}else{

				fs.unlink(filePath, (err)=>{
					return res.status(200).send({message: 'No se admite este tipo de archivo'});
				});

			}

		}
	}

};

module.exports = controller;