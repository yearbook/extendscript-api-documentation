#!/usr/bin/env python3

import json
import os
import xml.etree.ElementTree as etree

def _decode_property(property_xml):
  data = {
    'name': property_xml.attrib['name'],
    'readonly': 'rwaccess' in property_xml.attrib and property_xml.attrib['rwaccess'] == 'readonly',
    'type': _fix_type(property_xml.find('./datatype/type').text),
    'array': property_xml.find('./datatype/array') is not None,
  }

  if property_xml.find('./shortdesc') is not None:
    data['description'] = property_xml.find('./shortdesc').text

  if property_xml.find('./datatype/value') is not None:
    data['value'] = property_xml.find('./datatype/value').text

  return data

def _decode_parameter(parameter_xml):
  data = {
    'name': parameter_xml.attrib['name'],
    'type': _fix_type(parameter_xml.find('./datatype/type').text),
    'array': parameter_xml.find('./datatype/array') is not None,
    'optional': ('optional' in parameter_xml.attrib and parameter_xml.attrib['optional'] == 'true')
  }

  if parameter_xml.find('./shortdesc') is not None:
    data['description'] = parameter_xml.find('./shortdesc').text

  if parameter_xml.find('./datatype/value') is not None:
    data['value'] = parameter_xml.find('./datatype/value').text

  return data

def _decode_method(method_xml):
  data = {
    'name': method_xml.attrib['name'],
    'parameters': [_decode_parameter(x) for x in method_xml.findall('./parameters/parameter')],
  }

  if method_xml.find('./shortdesc') is not None:
    data['description'] = method_xml.find('./shortdesc').text

  if method_xml.find('./datatype') is not None:
    data['type'] = _fix_type(method_xml.find('./datatype/type').text)
    data['array'] = method_xml.find('./datatype/array') is not None

  return data

def _fix_type(t):
    if t == 'varies=any':
      return 'Mixed'

    if t == 'Any':
      return 'Mixed'

    if t == 'bool':
      return 'Boolean'

    if t == 'string':
      return 'String'

    if t == 'number':
      return 'Number'

    if t == 'Rect':
      return 'Rectangle'

    return t

def convert_xml(xml_path, output):
  name = os.path.basename(xml_path)

  it = etree.iterparse(xml_path)
  for _, el in it:
    if '}' in el.tag:
      el.tag = el.tag.split('}', 1)[1]  # strip all namespaces

  root = it.root

  contents = []
  search = {}

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
    class_properties = classdef.findall('./elements[@type="class"]/property')
    instance_properties = classdef.findall('./elements[@type="instance"]/property')
    instance_methods = classdef.findall('./elements[@type="instance"]/method')

    class_info = {
      'name': classdef.attrib['name'],
      'dynamic': ('dynamic' in classdef.attrib and classdef.attrib['dynamic'] == 'true'),
      'elements': {
        'class': {
          'properties': [_decode_property(x) for x in class_properties],
        },
        'instance': {
          'properties': [_decode_property(x) for x in instance_properties],
          'methods': [_decode_method(x) for x in instance_methods],
        },
      },
    }

    if classdef.find('./shortdesc') is not None:
      class_info['description'] = classdef.find('./shortdesc').text

    if classdef.find('./superclass') is not None:
      class_info['superclass'] = classdef.find('./superclass').text

    search[classdef.attrib['name']]  = [x.attrib['name'] for x in class_properties]
    search[classdef.attrib['name']] += [x.attrib['name'] for x in instance_properties]
    search[classdef.attrib['name']] += [x.attrib['name'] for x in instance_methods]

    class_json_path = os.path.join(output, 'classes/{}.json'.format(classdef.attrib['name']))

    os.makedirs(os.path.dirname(class_json_path), exist_ok=True)

    with open(class_json_path, 'w') as outfile:
      json.dump(class_info, outfile, indent=4)

  search_json_path = os.path.join(output, 'search.json')
  with open(search_json_path, 'w') as outfile:
    json.dump(search, outfile, indent=4)


if __name__ == '__main__':
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

