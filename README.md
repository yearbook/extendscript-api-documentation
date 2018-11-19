# Documentation for ExtendScript API #

This repo contains the source code for building the documentation system. If you're  OK with reading the five year old documentation then please look [here](http://yearbook.github.com).

## Prerequisites ##

  - Python3
  - Node.js and npm
  - Adobe InDesign/Illustrator/Photoshop/Bridge/Audition and ExtendScript Toolkit for XML source files

## Generating the documentation ##

Install node packages:

    $ npm install

Build automatically (only works on OS X and Windows 64):

    $ npm run build

The docs will be compiled to `public/`. OMV XML files will automatically be found.

## Development guide ##

Building the documentation requires the following steps:

  1. Locate the source OMV XML files, copy them to `./xml/source`. The script `./src/findxml` will do this for you on OSX, `/src/findxml.bat`on Windows
  2. Parse the XML files, output as JSON with `./src/xml2json.py`.
  3. Map the output JSON files to the `public` directory with `./src/json2public.py`. The file `./xml/map.json` defines what files to copy.
  4. Build the web interface.

gulp and npm are setup to run these for you.

To build all the documentation from scratch:

    $ npm run build
    
To watch `src/` and compile automatically to `public/`:

    $ npm run watch

To clean the dist files:

    $ npm run clean

The easiest way to view the docs locally is to use [zapp](https://www.github.com/wridgers/zapp).

    $ npm install -g zapp
    $ zapp public/

Now open your browser [here](http://localhost:8080).

### XML file locations ###

The XML source files can be found in the following locations on Mac OS X:

  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles`
  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/Illustrator 2019`
  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/photoshop`
  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/Adobe Bridge CC 2019`
  - `~/Library/Preferences/ExtendScript Toolkit/4.0`
  
On Windows:

  - `C:\Program Files (x86)\Common Files\Adobe\Scripting Dictionaries CC\CommonFiles`
  - `C:\Program Files\Common Files\Adobe\Scripting Dictionaries CC\illustrator 2019`
  - `C:\Program Files (x86)\Common Files\Adobe\Scripting Dictionaries CC\photoshop`
  - `C:\Program Files\Common Files\Adobe\Scripting Dictionaries CC\Adobe Bridge CC 2019`
  - `C:\Users\<YourUserName>\AppData\Roaming\Adobe\ExtendScript Toolkit\4.0`

# License #

All source code for generating the documentation is under the MIT license. The XML source files (not included) remain property of Adobe.
