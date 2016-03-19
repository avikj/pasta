# pasta

A command line tool for creating pastes on Pastebin.com

## Usage
The syntax for creating a paste is as follows:
```shell
$ pasta <filename> [title]
```
The command will return a [pastebin.com](http://pastebin.com) link to your file.

If the title is not provided, paste will use the file name as the title.

For example, if I wanted to create a paste for the main JavaScript file for a node module that I am currently working on, I would use
```shell
$ pasta index.js "index.js for paste"
```
