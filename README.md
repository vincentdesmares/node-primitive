[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# node-primitive

A port of primitive.js (primitive.lol) for Node.js thanks to the amazing
[jsdom](https://github.com/tmpvar/jsdom) library.

This library allow you to create an SVG representation of a given image using
primitives.

Original PNG:329KB -> SVG(100 primitives):5KB -> SVG(10 primitives + blur): 600B

![alt text](https://github.com/vincentdesmares/node-primitive/raw/master/samples/profile.png "Origin picture (329KB)")
![alt text](https://github.com/vincentdesmares/node-primitive/raw/master/samples/generated.png "Generated svg (5KB)")
![alt text](https://github.com/vincentdesmares/node-primitive/raw/master/samples/generated-blur.png "With blur & 10 triangles (5KB)")

I don't like to install anything except nvm on my node projects. So I adapted
primitive.js to work with Node.js in order to avoid having to install GO when
using sqip.

# Quick start

```javascript
const { generateSVG } = require("./../src/api");
const { Triangle } = require("./../src/shape");

const cfg = {
  alpha: 0.5,
  computeSize: 256,
  fill: "rgb(244, 244, 244)",
  height: 256,
  mutateAlpha: true,
  mutations: 30,
  scale: 2,
  shapeTypes: [Triangle],
  shapes: 102,
  steps: 50,
  viewSize: 512,
  width: 256,
  blur: 35
};

const SVGString = await generateSVG("test/profile.png", cfg);
```

## Warning

This script is really slow.

## Running tests

Just run

```bash
yarn
jest
```

## Debugging

You can use the env var "DEBUG" to display debug informations with the prefix
"node-internal".

The "verbose" level will display stats about the generated file.

```bash
DEBUG=node-primitive:verbose jest
```

The "internal" level can be used to debug the library.

```bash
DEBUG=node-primitive:internal jest
```

## Todo

* [ ] Check why onStep is removed the result is bad
* [ ] Remove promises, switch to await
* [ ] Fix the exports to use default exports when only one function/class is
      exposed

# Thanks

Thanks to José M. Pérez to have open my eyes on
[image placeholder generation](https://medium.freecodecamp.org/using-svg-as-placeholders-more-image-loading-techniques-bed1b810ab2c).

## References

* [primitive.js](https://github.com/ondras/primitive.js)
* [Testing primitive.js live](https://ondras.github.io/primitive.js/)
* [SQIP](https://github.com/technopagan/sqip)
