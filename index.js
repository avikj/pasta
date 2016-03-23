#!/usr/bin/env node
var program = require('commander'),
	prompt = require('prompt'),
	fs = require('fs'),
	PastebinAPI = require('pastebin-js');
var fileTypes = JSON.parse(fs.readFileSync(__dirname+'/fileTypes.json', 'utf8')).types;
program
	.version('0.0.1')
	.arguments('<filename> [title]')
	.action(function(filename, title){
		fs.stat(__dirname+'/pastebinAPIKey.txt', function(err, stat){

			// if the key has not already been saved
			if(err){
				prompt.start();	//prompt the user for their key
				prompt.get([
					{
						name: 'pastebinAPIKey',
				      		message: 'Please enter your Pastebin developer API key',
				       		required: true
					}], function (err, result) {
					if(err) return console.log(err);					// write the key to pastebinAPIKey.txt
					fs.writeFile(__dirname+'/pastebinAPIKey.txt', result.pastebinAPIKey, function(err){
						if(err) return console.log(err);
						// paste the file
						pasteIt(filename, title);
					});
				});
			}
			// if the key has already been saved
			else{
				// paste the file
				pasteIt(filename, title);
			}
		});
	})
	.parse(process.argv);

// precondition: API key has already been saved in pastebinAPIKey.txt
function pasteIt(filename, title){
	fs.readFile(__dirname+'/pastebinAPIKey.txt', 'utf8', function(err, data) {
	  if (err){
		return console.log("There was an error reading the API key file.");
	  }
	  pastebin = new PastebinAPI(data);
	  pastebin
		.createPasteFromFile(filename, title?title:filename, extractFileFormat(filename))
		.then(function(data){
			console.log("http://pastebin.com/"+data);
		})
		.fail(function(err){
			if(err.toString().indexOf('api_dev_key')!=-1){
				fs.unlink(__dirname+'/pastebinAPIKey.txt', function(err){
					if(err) throw err;
				});
				console.log('Error: The provided API key is invalid.');	

			}else{
				console.log(err);
			}
		});
	});
}

function extractFileFormat(filename){

	if(filename.indexOf('.') == -1)
		return null;
	var ext =  filename.substring(filename.indexOf('.')+1);
	if(ext == 'js')
		ext = 'javascript';
	if(fileTypes.indexOf(ext) == -1){
		console.log("Could not detect file type of "+filename+". Pasting as plain text.");
		return null;
	}
	return ext;
}
