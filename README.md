# Markdown to mbed

We use some archaic, home-grown formatting system on developer.mbed.org, while the rest of the world uses Markdown. This tool takes in Markdown and spits out mbed-formatted text.

## Usage

1. Install via `npm -g install md2mbed`.
2. md2mbed takes in data via stdin and spits it out via stdout:
    * To convert a file: `cat test.md | md2mbed > output.txt`.
    * To convert text on the clipboard: `pbpaste | md2mbed | pbcopy`.

## Example

In:

```md
# Hello

This is a [test](http://google.com). This is *also* a test. This has to be **bold**.

![Image](heres-an-image.png)

## Sub-header

Joyful times ahead! No more manual conversion.

* Here's a list
* Also here
    * Nested list
    * Moar nesting
* Whut

Some random text...

```js
var a = 7;
var b = 42;
console.log(a*b);
```
```

Out:

```
= Hello =

This is a [[http://google.com | test]]. This is //also// a test. This has to be **bold**.

{{heres-an-image.png}}

== Sub-header ==

Joyful times ahead! No more manual conversion.

* Here's a list
* Also here
    * Nested list
    * Moar nesting
* Whut

Some random text...

<<code>>
var a = 7;
var b = 42;
console.log(a*b);
<</code>>
```

