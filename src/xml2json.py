#!/usr/bin/env python3

import json
import os
import xml.etree.ElementTree as etree

def _decode_property(property_xml):
  data = {
    'name': property_xml.attrib['name'],
    'readonly': 'rwaccess' in property_xml.attrib and property_xml.attrib['rwaccess'] == 'readonly',
    'description': property_xml.find('./shortdesc').text,
    'type': property_xml.find('./datatype/type').text,
    'array': property_xml.find('./datatype/array') is not None,
  }

  if property_xml.find('./datatype/value') is not None:
    data['value'] = property_xml.find('./datatype/value').text

  return data

def _decode_parameter(parameter_xml):
  data = {
    'name': parameter_xml.attrib['name'],
    'description': parameter_xml.find('./shortdesc').text,
    'type': parameter_xml.find('./datatype/type').text,
    'array': parameter_xml.find('./datatype/array') is not None,
    'optional': ('optional' in parameter_xml.attrib and parameter_xml.attrib['optional'] == 'true')
  }

  if parameter_xml.find('./datatype/value') is not None:
    data['value'] = parameter_xml.find('./datatype/value').text

  return data

def _decode_method(method_xml):
  data = {
    'name': method_xml.attrib['name'],
    'description': method_xml.find('./shortdesc').text,
    'parameters': [_decode_parameter(x) for x in method_xml.findall('./parameters/parameter')],
  }

  if method_xml.find('./datatype') is not None:
    data['type'] = method_xml.find('./datatype/type').text
    data['array'] = method_xml.find('./datatype/array') is not None

  return data

def convert_xml(xml_path, output):
  name = os.path.basename(xml_path)

  tree = etree.parse(xml_path)
  root = tree.getroot()

  contents = []

  object_map = root.find('./map')
  object_categories = object_map.findall('./topicref')

  for object_category in object_categories:

    category = {
      'category': object_category.attrib['navtitle'],
      'objects': [x.attrib['navtitle'] for x in object_category.findall('./topicref')],
    }

    contents.append(category)

  contents_json_path = os.path.join(output, 'contents.json')
  os.makedirs(os.path.dirname(contents_json_path), exist_ok=True)

  with open(contents_json_path, 'w') as outfile:
    json.dump(contents, outfile, indent=4)

  classdefs = root.findall('./package/classdef')

  for classdef in classdefs:
    class_info = {
      'name': classdef.attrib['name'],
      'dynamic': ('dynamic' in classdef.attrib and classdef.attrib['dynamic'] == 'true'),
      'description': classdef.find('./shortdesc').text,
      'elements': {
        'class': {
          'properties': [_decode_property(x) for x in classdef.findall('./elements[@type="class"]/property')],
        },
        'instance': {
          'properties': [_decode_property(x) for x in classdef.findall('./elements[@type="instance"]/property')],
          'methods': [_decode_method(x) for x in classdef.findall('./elements[@type="instance"]/method')],
        },
      },
    }

    class_json_path = os.path.join(output, 'classes/{}.json'.format(classdef.attrib['name']))

    os.makedirs(os.path.dirname(class_json_path), exist_ok=True)

    with open(class_json_path, 'w') as outfile:
      json.dump(class_info, outfile, indent=4)



script_directory = os.path.dirname(__file__)
root_directory = os.path.abspath(os.path.join(script_directory, '..'))

source_location = os.path.join(root_directory, 'xml/source')
output_location = os.path.join(root_directory, 'xml/json')

for source_file in os.listdir(source_location):
  if source_file.endswith('.xml'):

    output_directory = source_file.replace('.xml', '').replace('omv$', '')

    source_path = os.path.join(source_location, source_file)
    output_path = os.path.join(output_location, output_directory)

    print('{} -> {}'.format(source_path, output_path))
    convert_xml(source_path, output_path)

