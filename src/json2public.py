#!/usr/bin/env python3

import json
import os
import shutil

if __name__ == '__main__':
  script_directory = os.path.dirname(__file__)
  root_directory = os.path.abspath(os.path.join(script_directory, '..'))

  map_location = os.path.join(root_directory, 'xml', 'map.json')
  json_location = os.path.join(root_directory, 'xml', 'json')
  output_location = os.path.join(root_directory, 'public', 'source')

  search = {}

  with open(map_location) as map_file:
    map_data = json.load(map_file)

  for map_key in map_data.keys():
    map_value = map_data[map_key]

    source_location = os.path.join(json_location, map_key)
    source_destination = os.path.join(output_location, map_value)

    print('{} -> {}'.format(source_location, source_destination))
    shutil.rmtree(source_destination, ignore_errors=True)
    shutil.copytree(source_location, source_destination)

    search_location = os.path.join(json_location, map_key, 'search.json')

    with open(search_location) as search_file:
      search[map_value] = json.load(search_file)


  search_output = os.path.join(output_location, 'search.json')

  with open(search_output, 'w') as outfile:
    json.dump(search, outfile, indent=4)


