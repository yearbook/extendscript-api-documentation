// modules
var libxmljs  = require('libxmljs');
var progress  = require('progress');
var xml2json  = require('xml2json');
var ent       = require('ent');

// node libs
var fs   = require('fs');
var util = require('util');

// configuration
var outdir = './docs/source/';
var libdir = './lib/';

var docIndex = {};

// main estk
generate('InDesign');
generate('Illustrator');
generate('Photoshop');

// javascript + scriptui
generate('Javascript');
generate('ScriptUI');

// done!
var prettySearch = JSON.stringify(docIndex, null, 2);
fs.writeFileSync(outdir + 'search.json', prettySearch, {encoding: 'utf-8'});

function generate(namespace) {
  // get XML document
  var fileData = fs.readFileSync('./xml/' + namespace.toLowerCase() + '.xml', {encoding: 'utf-8'});
  var xmlDoc = libxmljs.parseXmlString(fileData);

  // stores
  var docContents = [];
  docIndex[namespace] = {};

  // get the contents
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

  // save the contents file
  var prettyContents = JSON.stringify(docContents, null, 2);
  fs.writeFileSync(outdir + namespace + '/contents.json', prettyContents, {encoding: 'utf-8'});

  // get all classdefs
  var classdefs = xmlDoc.find('//package/classdef');
  var progressBar = new progress('(' + namespace + ') :bar', {
    total: classdefs.length,
    width: 40
  });

  // for each class
  classdefs.forEach(function(classdef) {
    var className = classdef.attr('name').value();
    var classObject = xml2json.toJson(classdef.toString(), {
      object: true,
      coerce: true,
      trim: true
    }).classdef;

    // add to index
    if (!docIndex[namespace][className])
      docIndex[namespace][className] = [];

    // fix description
    classObject.description = fixDescription(classObject.description);

    // make sure classObject.elements is always an array
    classObject.elements = [].concat( classObject.elements );

    if ('elements' in classObject) {

      // make sure parameters is always an array too
      classObject.elements.forEach(function(element) {
        if (element) {
          if ('method' in element) {

            // coerce to a list of methods and then loop over them
            element.method = [].concat( element.method );
            element.method.forEach(function(method) {

              // add to index
              docIndex[namespace][className].push(method.name);

              // fix things
              method.shortdesc    = fixDescription(method.shortdesc);
              method.description  = fixDescription(method.description);
              method.datatype     = fixDataType(method.datatype);

              if ('parameters' in method) {
                // force it to be an array
                method.parameters = [].concat( method.parameters.parameter );
                method.parameters.forEach(function(param) {

                  // fix short description
                  param.shortdesc   = fixDescription(param.shortdesc);
                  param.description = fixDescription(param.description);

                  if (param.shortdesc) {
                    // does description say it's optional?
                    if ( param.shortdesc.match(/\(optional\)/i) !== null ) {
                      param.optional = true;
                    }
                  }

                  // remove traces of optional stuff
                  if (param.shortdesc) {
                    param.shortdesc   = param.shortdesc.replace(/\(optional\)/i, '');
                  }

                  if (param.description) {
                    param.description = param.description.replace(/\(optional\)/i, '');
                  }

                  // apply fixes
                  param.datatype = fixDataType( param.datatype );
                });
              }
            });
          }

          if ('property' in element) {
            element.property = [].concat( element.property );
            element.property.forEach(function(property) {
              // add to index
              docIndex[namespace][className].push(property.name);

              // fix descriptions
              property.shortdesc    = fixDescription(property.shortdesc);
              property.description  = fixDescription(property.description);

              // apply fixes
              property.datatype = fixDataType( property.datatype );
            });
          }
        }
      });
    }

    // render as text
    var prettyClass = JSON.stringify(classObject, null, 2);

    // write to file
    fs.writeFileSync(outdir + namespace + '/classes/' + className + '.json', prettyClass, {encoding: 'utf-8'});

    // save jsx file
    writeJSX(namespace, className, classObject);


    // update the awesome progress bar
    progressBar.tick();
  });

}

function writeJSX(namespace, className, classObject) {
  // TODO: now we have a clean JS object, write the annotated .jsx files
  var jsxFile = className + '.jsx';
  var jsxSrc = '';

  // find constructor, method list, property list
  var constructor;
  var properties = [];
  var methods = [];

  classObject.elements.forEach(function(element) {
    if (element !== null && element !== undefined) {
      if (element.type === 'constructor') {
        constructor = element.method[0];
      } else {
        if ('property' in element)
          properties = properties.concat(element.property);

        if ('method' in element)
          methods = methods.concat(element.method);
      }
    }
  });

  if (constructor === undefined) {

    jsxSrc += '/*\n';
    jsxSrc += ' * ' + classObject.shortdesc + '\n';
    jsxSrc += ' */\n';
    jsxSrc += 'var ' + className + ' = {\n';

    properties.forEach(function(property) {
      jsxSrc += '  /*\n';
      jsxSrc += '   * ' + property.shortdesc + '\n';

      if (property.datatype !== undefined)
        jsxSrc += '   * @type {' + property.datatype.type + '}\n';

      jsxSrc += '   */\n';
      jsxSrc += '  ' + property.name + ': undefined,\n';
      jsxSrc += '  \n';
    });

    methods.forEach(function(method) {
      jsxSrc += '  /*\n';
      jsxSrc += '   * ' + method.shortdesc + '\n';

      var signature = '';

      if ('parameters' in method) {
        jsxSrc += ' *\n';

        method.parameters.forEach(function(param) {
          var type = param.datatype.type;
          var name = param.name;
          var desc = param.shortdesc;

          signature += name + ', ';

          if (param.optional)
            name = '[' + name + ']';

          jsxSrc += '   * @param {' + type + '} ' + name + ' - ' + desc + '\n';
        });
      }

      // remove the last ', '
      signature = signature.slice(0, -2);

      if (method.datatype !== undefined)
        jsxSrc += '   * @returns {' + method.datatype.type + '}\n';

      jsxSrc += '   */\n';
      jsxSrc += '  ' + method.name + ': function(' + signature + ') {\n';
      jsxSrc += '  \n';
      jsxSrc += '  },\n';
      jsxSrc += '  \n';
    });

    jsxSrc += '};\n';

  } else {
    jsxSrc += '/*\n';
    jsxSrc += ' * ' + constructor.shortdesc + '\n';
    jsxSrc += ' * @constructor\n';

    var signature = '';

    if ('parameters' in constructor) {
      jsxSrc += '   *\n';

      constructor.parameters.forEach(function(param) {
        var type = param.datatype.type;
        var name = param.name;
        var desc = param.shortdesc;

        signature += name + ', ';

        if (param.optional)
          name = '[' + name + ']';

        jsxSrc += ' * @param {' + type + '} ' + name + ' - ' + desc + '\n';
      });
    }

    // remove the last ', '
    signature = signature.slice(0, -2);

    jsxSrc += ' */\n';
    jsxSrc += 'function ' + className + '(' + signature + ') {\n';

    properties.forEach(function(property) {
      jsxSrc += '  /*\n';
      jsxSrc += '   * ' + property.shortdesc + '\n';

      if (property.datatype !== undefined)
        jsxSrc += '   * @type {' + property.datatype.type + '}\n';

      jsxSrc += '   */\n';
      jsxSrc += '  this.' + property.name + ' = undefined;\n';
      jsxSrc += '  \n';
    });

    methods.forEach(function(method) {
      jsxSrc += '  /*\n';
      jsxSrc += '   * ' + method.shortdesc + '\n';

      var signature = '';

      if ('parameters' in method) {
        jsxSrc += '   *\n';

        method.parameters.forEach(function(param) {
          var type = param.datatype.type;
          var name = param.name;
          var desc = param.shortdesc;

          signature += name + ', ';

          if (param.optional)
            name = '[' + name + ']';

          jsxSrc += '   * @param {' + type + '} ' + name + ' - ' + desc + '\n';
        });
      }

      // remove the last ', '
      signature = signature.slice(0, -2);

      if (method.datatype !== undefined)
        jsxSrc += '   * @returns {' + method.datatype.type + '}\n';

      jsxSrc += '   */\n';
      jsxSrc += '  this.' + method.name + ' = function(' + signature + ') {\n';
      jsxSrc += '  \n';
      jsxSrc += '  }\n';
      jsxSrc += '  \n';
    });

    jsxSrc += '}\n';
  }

  // save
  fs.writeFileSync(libdir + namespace + '/' + jsxFile, jsxSrc, {encoding: 'utf-8'});
}

function fixDataType(datatype) {
  if (datatype === undefined)
    return undefined;

  if (typeof datatype.type !== 'string') {
    if (datatype.type !== undefined) {
      if ('$t' in datatype.type)
        datatype.type = datatype.type.$t;
    }
  } else {
    // entites
    datatype.type = ent.decode(datatype.type);

    if (datatype.type.match(/=any/) !== null) {
      datatype.type = 'Mixed';
    }
  }

  switch(datatype.type) {
    case 'varies=any':
      datatype.type = 'Mixed';
      break;

    case 'Any':
      datatype.type = 'Mixed';
      break;

    case 'bool':
      datatype.type = 'Boolean';
      break;

    case 'string':
      datatype.type = 'String';
      break;

    case 'number':
      datatype.type = 'Number';
      break;
  }

  if ('array' in datatype)
    datatype.array = true;

  return datatype;
}

function fixDescription(description) {
  if (description === undefined)
    return undefined;

  if (typeof description !== 'string')
    return undefined;

  // decode ents
  description = ent.decode(description);

  // TODO: why is this missed?
  description = description.replace('&#40;', '(');
  description = description.replace('&#41;', ')');

  return description;
}
