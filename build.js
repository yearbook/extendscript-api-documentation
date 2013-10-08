// modules
var libxmljs = require('libxmljs');
var progress = require('progress');
var xml2json = require('xml2json');

// node libs
var fs = require('fs');
var util = require('util');

// configuration
var outdir = './docs/source/';

// index variable
var index = {};

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

    // add all the classes to the index
    mapObject.map.topicref.forEach(function(suite) {
      suite.topicref.forEach(function(topic) {
        var className = topic.navtitle;
        index[className] = [];
      });
    });

    // save the map file
    var prettyMap = JSON.stringify(mapObject.map, null, 2);
    fs.writeFileSync(outdir + 'contents.json', prettyMap, {encoding: 'utf-8'});

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
      }).classdef;

      // TODO: it would actually be much smarter to 'preprocess' the XML file
      // instead of the object

      // make sure classObject.elements is always an array
      classObject.elements = [].concat( classObject.elements );

      // make sure parameters is always an array too
      classObject.elements.forEach(function(element) {
        if ('method' in element) {
          // TODO: parameters.parameter? This is dumb.
          // * Will scowls at Adobe
          element.method.forEach(function(method) {
            // add to index
            index[className].push(method.name);

            if ('parameters' in method) {
              // force it to be an array
              method.parameters.parameter = [].concat( method.parameters.parameter );

              // varies=any -> mixed
              method.parameters.parameter.forEach(function(param) {
                if (param.datatype.type == 'varies=any')
                  param.datatype.type = 'mixed';

                if (param.datatype.array == {})
                  param.datatype.array = true;
              });
            }
          });
        }

        if ('property' in element) {
          element.property = [].concat( element.property );

          element.property.forEach(function(property) {
            // add to index
            index[className].push(property.name);

            if (property.datatype.type == 'varies=any')
              property.datatype.type = 'mixed';

            if ('array' in property.datatype)
              property.datatype.array = true;
          });
        }
      });

      // render as text
      var prettyClass = JSON.stringify(classObject, null, 2);

      // write to file
      fs.writeFileSync(outdir + 'classes/' + className + '.json', prettyClass, {encoding: 'utf-8'});

      // update the awesome progress bar
      progressBar.tick();
    });

    // done!
    var prettyIndex = JSON.stringify(index, null, 2);
    fs.writeFileSync(outdir + 'index.json', prettyIndex, {encoding: 'utf-8'});
  }
});

