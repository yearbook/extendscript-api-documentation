# Misc. tools for working with ExtendScript

This directory contains various tools to help you develop ExtendScript.

## ctags-exuberant

`ctags` is a simple utility that generates tag files for source code - an index
of variable and function names and the location of their definition (file, and
line number). 

### Generating the tags file

First, you need to install `ctags`. On OSX this is easy.

    $ brew install ctags-exuberant

The `ctags` file in this directory can be used to generated a valid `tags` file
from `.jsx` files. Simply place this in your project root as `./.ctags`, or
`~/.ctags`, and run the command

    $ ctags -R .

This will create a `./tags` file you can start using with your favourite editor.

Alternatively, if you only want to generate tags for `.jsx` files you can use

    $ find . -name "*.jsx" -exec {} +

### Using tag files

*vim* will automatically read the `tags` file. With your cursor over a function
or variable, press `C-]` to navigate to the definition. Pressing `C-t` will
take you back again.

For *Sublime Text*, try [this](https://github.com/SublimeText/CTags).

