#!/usr/bin/env node

'use strict';

const m2ast = require('markdown-to-ast').parse;

process.stdin.resume();
process.stdin.setEncoding('utf8');

let article = '';

let stdinTimeout = setTimeout(() => {
  console.warn('No data received on stdin... Shutting down.');
  process.exit(1);
}, 2000);

function go() {
  clearTimeout(stdinTimeout);

  let ast = m2ast(article);

  let output = '';
  for (let n of ast.children) {
    let text = renderNode(n);
    if (text) {
      output += text;
    }
  }
  console.log(output);
}

process.stdin.on('data', chunk => {
  article += chunk;
});

process.stdin.on('end', go);

function renderNode(node) {
  let text = '';

  if (node.indentation) {
    for (let c of (node.children || [])) {
      c.indentation = node.indentation;
    }
  }

  switch (node.type) {
    case 'Header':
      for (let d = 0; d < node.depth; d++) {
        text += '=';
      }
      text += ' ';

      for (let c of node.children) {
        text += renderNode(c);
      }

      text += ' ';
      for (let d = 0; d < node.depth; d++) {
        text += '=';
      }

      text += '\n\n';

      break;

    case 'Str':
      text += node.value;
      break;

    case 'Paragraph':
      for (let c of node.children) {
        text += renderNode(c);
      }
      if (typeof node.indentation !== 'number') {
        text += '\n\n';
      }
      break;

    case 'Link':
      text += '[[' + node.url + ' | ';
      for (let c of node.children) {
        text += renderNode(c);
      }
      text += ']]';

      break;

    case 'Emphasis':
      text += '//';
      for (let c of node.children) {
        text += renderNode(c);
      }
      text += '//';

      break;

    case 'CodeBlock':
      text += '<<code>>\n' + node.value + '\n<</code>>\n\n';

      break;

    case 'Code':
      text += '##' + node.value + '##';
      break;

    case 'List':
      node.indentation = (node.indentation || 0) + 1;

      let liSymbol = node.ordered ? '#' : '*';
      let li = Array.apply(null, Array(node.indentation)).map(() => liSymbol).join('');

      for (let c of node.children) {
        c.indentation = node.indentation;

        text += li + ' ' + renderNode(c);
      }

      if (node.indentation === 1) {
        text += '\n';
      }

      break;

    case 'ListItem':
      for (let c of node.children) {
        text += renderNode(c);

        if (c.type !== 'List') {
          text += '\n';
        }
      }
      break;

    case 'Html':
      text += node.value;
      break;

    case 'HorizontalRule':
      text += '-\n\n'; // we should add this in mbed
      break;

    case 'Strong':
      text += '**';
      for (let c of node.children) {
        text += renderNode(c);
      }
      text += '**';
      break;

    case 'Image':
      text += '{{' + node.url;
      if (node.alt) {
        text += '|' + node.alt;
      }
      text += '}}';
      break;

    case 'table':
      // GH flavored markdown always requires a header row
      if (node.children.length >= 1) node.children[0].isHeaderRow = 1;

      for (let c of node.children) {
        text += renderNode(c);
      }
      text += '\n';
      break;

    case 'tableRow':
      text += '|';
      for (let c of node.children) {
        if (node.isHeaderRow) {
          text += '=';
        }
        text += renderNode(c);
      }
      text += '\n';
      break;

    case 'tableCell':
      for (let c of node.children) {
        text += renderNode(c);
      }
      text += ' |';
      break;

    case 'linkReference':
    case 'definition':
      // ignore
      break;

    default:
      console.log('Unknown type', node.type, node);
      break;
  }

  return text;
}
