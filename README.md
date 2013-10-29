# Documentation builder for ExtendScript API

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

  - `/Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles`
  - `~/Library/Preferences/ExtendScript Toolkit/4.0/omv$indesign-9.064$9.0.xml`

### XML caveats

The XML files are not consistent. Currently two lines of manual pruning are
required. Both `javascript.xml` and `scriptui.xml` must be changed from:

    <?xml version="1.0" encoding="utf-8"?>
    <dictionary xsi:schemaLocation="" xmlns="" xmlns:xsi="">

to

    <dictionary engine="">

(as per indesign.xml)

## Generating the docs

Install Node.JS

    $ brew install node

Copy the source XML files into ./xml

    $ cp omv$indesign-9.064$9.0.xml ./xml/indesign.xml
    $ cp javascript.xml ./xml/javascript.xml
    $ cp scriptui.xml ./xml/scriptui.xml

Bake

    $ ./generate

The docs will be compiled to the `html` directory, and the development
build will be located in the `docs` directory.

## Developing the HTML docs locally

The docs are built using various templating and stylesheet languages. The easiest way
to view the docs is to use [zapp](https://www.github.com/wridgers/zapp).

    $ npm install -g zapp
    $ ./generate
    $ cd docs
    $ zapp

Now open your browser [here](http://localhost:8080).

## Documentation and autocomplete in IDEs

The `./generate` script will automatically build some jsdoc style annotated jsx files
which you can use with many editors for autocompletion and inline documentation. It
is known to work well with vim, Sublime Text, and WebStorm.

You can download precompiled libraries [here](http://yearbookmachine.github.io/esdocs/ybm-estk-lib.zip).

### WebStorm

  - First, add `*.jsx` to the registered patterns of JavaScript files.
    * WebStorm -> Preferences -> IDE Settings -> File Types
  - Add the ./libs/ folder to your project as an external library.
    * WebStorm -> Preferences -> Project Settings -> JavaScript -> Libraries
    * Add...

You should now have autocompletion and inline documentation available in the
normal WebStorm fashion.

### Sublime Text

Using [SublimeCodeIntel](https://github.com/SublimeCodeIntel/SublimeCodeIntel).

### vim

Using [YCM](https://github.com/Valloric/YouCompleteMe).

# License

All source code for generating the documentation is under the MIT license. The
XML source files (not included) remain property of Adobe.

