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
 * Get rules from a css file.
 * @param  {string} fileName Name of the file to read.
 * @return {Array}          Array of rules objects.
 */
function getRules(fileName) {
  var cssString = fs.readFileSync( fileName, 'utf8');
  var ast = css.parse(cssString);
  var rules = ast.stylesheet.rules;
  return rules;
}


function searchFile() {
  var css = new Hashset.string();
  // keep track of duplicate selectors
  var dups = new Hashset.string();

  var rules = getRules(program.args[0]);

  // add the css selectors to a set
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i].selectors[0];
    if (css.contains(rule)) {
      dups.add(rule);
    } else {
      css.add(rule);
    }
  }

  var iter = dups.iterator();
  while (iter.hasNext()) {
    console.log(iter.next());
  }

}

function compareFiles() {
  var css = new Hashset.string();
  var dups = new Hashset.string();

  var rules = getRules(program.args[0]);

  for (var i = 0; i < rules.length; i++) {
    css.add(rules[i].selectors[0]);
  }

  rules = getRules(program.args[1]);

  for (var i = 0; i < rules.length; i++) {
    var selector = rules[i].selectors[0];
    if (css.contains(selector)) {
      dups.add(selector);
    }
  }

  var iter = dups.iterator();
  while (iter.hasNext()) {
    console.log(iter.next());
  }

}
