# Documentation builder for InDesign API

Documentation for the InDesign API in more pleasant formats than the Object
Model Viewer. This repo contains the source code for building the documentation
system. If you're only interested in viewing the documentation then please look
[here](http://yearbookmachine.github.com).

## Prerequisites

  - Node.JS
  - Adobe InDesign and ExtendScript Toolkit for XML source files

### XML file locations

The XML source files can be found in the following locations on Mac OS X. Other
OSs are unknown, although the files are likely to have similar names.

  - /Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles
  - ~/Library/Preferences/ExtendScript Toolkit/4.0/omv$indesign-9.064$9.0.xml

### XML caveates

The XML files are not consistent. Currently two lines of manual pruning are
required. Both `javascript.xml` and `scriptui.xml` must be changed from:

    <?xml version="1.0" encoding="utf-8"?>
    <dictionary xsi:schemaLocation="" xmlns="" xmlns:xsi="">

to

    <dictionary engine="">

(as per omv-indesign-9.0-cc.xml)

## Generating the docs from XML source files

Install Node.JS

    $ brew install node

Copy the source XML files into ./xml

  $ cp omv$indesign-9.064$9.0.xml ./xml/omv-indesign-9.0-cc.xml
  $ cp javascript.xml ./xml/javascript.xml
  $ cp scriptui.xml ./xml/scriptui.xml

Install the required NodeJS modules.

    $ npm install

Build

    $ node build.js

## Serving the HTML docs locally

The docs are built using various templating and stylesheet languages. The easiest way
to view the docs is to use [zapp](https://www.github.com/wridgers/zapp).

    $ npm install -g zapp
    $ cd docs
    $ zapp

Now open your browser [here](http://localhost:8080).

## Baking the HTML docs

This section is WIP.

# License

All source code for generating the documentation is under the MIT license. The
XML source files (not included) remain property of Adobe.

