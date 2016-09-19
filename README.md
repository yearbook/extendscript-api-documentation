# Documentation for ExtendScript API #

This repo contains the source code for building the documentation system. If
you're only interested in viewing the documentation then please look
[here](http://yearbook.github.com).

## Prerequisites ##

  - Python3
  - Node + NPM
  - Adobe InDesign/Illustrator/Photoshop and ExtendScript Toolkit for XML source files

## Generating the documentation ##

Install node packages

    $ npm install

Build

    $ npm run build

The docs will be compiled to `public/`.

### Developing the HTML docs locally ###

Run the watcher

    $ npm run watch

`src/` will be watched and compiled automatically to `public/`.

The easiest way to view the docs is to use [zapp](https://www.github.com/wridgers/zapp).

    $ npm install -g zapp
    $ zapp public/

Now open your browser [here](http://localhost:8080).

### XML file locations ###

The XML source files can be found in the following locations on Mac OS X. Other
OSs are unknown, although the files are likely to be in similar locations.

  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles`
  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/Illustrator`
  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/photoshop`
  - `~/Library/Preferences/ExtendScript Toolkit/4.0/`

# License

All source code for generating the documentation is under the MIT license. The
XML source files (not included) remain property of Adobe.
