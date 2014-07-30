#!/usr/bin/env node

var program = require('commander'),
    css     = require('css'),
    fs      = require('fs'),
    Hashset = require('hashset-native');

program
  .usage('<css1> [css2]')
  .parse(process.argv);


// validate arguments
if (program.args.length == 1) {
  searchFile();
} else if (program.args.length == 2) {
  compareFiles();
} else {
  program.help();
}


/**
 * Helper function. Get rules from a css file.
 * @param  {string} fileName Name of the file to read.
 * @return {Array}          Array of rules objects.
 */
function getRules(fileName) {
  var cssString = fs.readFileSync( fileName, 'utf8');
  var ast = css.parse(cssString);
  var rules = ast.stylesheet.rules;
  return rules;
}


/**
 * Print dulplicate css selectors within a file.
 */
function searchFile() {
  var css = new Hashset.string();
  var dups = new Hashset.string();

  var rules = getRules(program.args[0]);

  // add the css selectors to a set
  for (var i = 0; i < rules.length; i++) {

    for (var j=0; j < rules[i].selectors.length; j++) {
      var sel = rules[i].selectors[j];
      if (css.contains(sel)) {
        dups.add(sel);
      } else {
        css.add(sel);
      }
    }
  }
  var iter = dups.iterator();
  while (iter.hasNext()) {
    console.log(iter.next());
  }
}


/**
 * Print css selectors appearing in both of two files.
 */
function compareFiles() {
  var css = new Hashset.string();
  var dups = new Hashset.string();

  var rules = getRules(program.args[0]);

  for (var i = 0; i < rules.length; i++) {
    for (var j=0; j < rules[i].selectors.length; j++) {
      css.add(rules[i].selectors[j]);
    }
  }

  rules = getRules(program.args[1]);

  for (var i = 0; i < rules.length; i++) {
    for (var j=0; j < rules.length; j++) {
      var sel = rules[i].selectors[j];
      if (css.contains(sel)) {
        dups.add(sel);
      }
    }
  }

  var iter = dups.iterator();
  while (iter.hasNext()) {
    console.log(iter.next());
  }

}
