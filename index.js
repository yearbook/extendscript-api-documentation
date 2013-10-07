// modules
var libxmljs = require('libxmljs');
var progress = require('progress');
var xml2json = require('xml2json');

// node libs
var fs = require('fs');
var util = require('util');

// configuration
var outdir = './docs/source/';

// read the xml file
fs.readFile('./xml/omv-indesign-9.0-cc.xml', {encoding: 'utf-8'}, function(err, data) {
  if (err) {
    throw err;
  } else {
    // parse XML
    var xmlDoc = libxmljs.parseXmlString(data);

    // map node
    var map = xmlDoc.get('//map');
    var mapObject = xml2json.toJson(map.toString(), {
      object: true,
      coerce: true,
      trim: true
    });

    // save the map file
    var prettyMap = JSON.stringify(mapObject.map, null, 2);
    fs.writeFileSync(outdir + 'index.json', prettyMap, {encoding: 'utf-8'});

    // get all classes
    var classdefs = xmlDoc.find('//package/classdef');
    var progressBar = new progress(':bar', { 
      total: classdefs.length,
      width: 30
    });
    
    classdefs.forEach(function(classdef) {
      var className = classdef.attr('name').value();
      var classObject = xml2json.toJson(classdef.toString(), {
        object: true,
        coerce: true,
        trim: true
      });

      var prettyClass = JSON.stringify(classObject.classdef, null, 2);

      // write to file
      fs.writeFileSync(outdir + 'classes/' + className + '.json', prettyClass, {encoding: 'utf-8'});

      // update the awesome progress bar
      progressBar.tick();
    });
  }
});

