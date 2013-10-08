// modules
var libxmljs = require('libxmljs');
var progress = require('progress');
var xml2json = require('xml2json');

// node libs
var fs = require('fs');
var util = require('util');

// configuration
var outdir = './docs/source/';

// read the XML data
var indesignData    = fs.readFileSync('./xml/omv-indesign-9.0-cc.xml', {encoding: 'utf-8'});
var javascriptData  = fs.readFileSync('./xml/javascript.xml', {encoding: 'utf-8'});
var scriptuiData    = fs.readFileSync('./xml/scriptui.xml', {encoding: 'utf-8'});

// parse the xml files
var indesignXml   = libxmljs.parseXmlString(indesignData);
var javascriptXml = libxmljs.parseXmlString(javascriptData);
var scriptuiXml   = libxmljs.parseXmlString(scriptuiData);

// process the XML files
buildHTMLDocsSource([indesignXml, javascriptXml, scriptuiXml]);

function buildHTMLDocsSource(xmlDocs) {
  var docIndex    = {};
  var docContents = [];

  // map nodes, for contents
  xmlDocs.forEach(function(xmlDoc) {
    var mapXML = xmlDoc.get('//map');
    var mapObject = xml2json.toJson(mapXML.toString(), {
      object: true,
      coerce: true,
      trim: true
    }).map;

    // coerce to an array
    mapObject.topicref = [].concat( mapObject.topicref );
    mapObject.topicref.forEach(function(topicref) {
      docContents.push(topicref);
    });
  });

  // save the contents file
  var prettyContents = JSON.stringify(docContents, null, 2);
  fs.writeFileSync(outdir + 'contents.json', prettyContents, {encoding: 'utf-8'});

  // get all classes
  xmlDocs.forEach(function(xmlDoc) {

    // get all classdefs
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

      console.log(className);

      // add to index
      if (!docIndex[className])
        docIndex[className] = [];

      // make sure classObject.elements is always an array
      classObject.elements = [].concat( classObject.elements );

      // some classes are weird
      if ('elements' in classObject) {
        // make sure parameters is always an array too
        classObject.elements.forEach(function(element) {
          if (element) {
            if ('method' in element) {
              element.method = [].concat( element.method );

              // TODO: parameters.parameter? This is dumb.
              // * Will scowls at Adobe
              element.method.forEach(function(method) {
                // add to index

                docIndex[className].push(method.name);

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
                docIndex[className].push(property.name);

                if (property.datatype.type == 'varies=any')
                  property.datatype.type = 'mixed';

                if ('array' in property.datatype)
                  property.datatype.array = true;
              });
            }
          }
        });
      }

      // render as text
      var prettyClass = JSON.stringify(classObject, null, 2);

      // write to file
      fs.writeFileSync(outdir + 'classes/' + className + '.json', prettyClass, {encoding: 'utf-8'});

      // update the awesome progress bar
      progressBar.tick();
    });
  });

  // done!
  var prettyIndex = JSON.stringify(docIndex, null, 2);
  fs.writeFileSync(outdir + 'index.json', prettyIndex, {encoding: 'utf-8'});
}

