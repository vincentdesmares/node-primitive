# node-primitive
A port of primitive.js (primitive.lol) for Node.js.

This library allow you to create an SVG representation of a given image using primitives.

Origin picture, 329KB -> Generated svg 5KB, 100 primitives

![alt text](https://github.com/vincentdesmares/node-primitive/raw/master/samples/profile.png "Origin picture (329KB)")
![alt text](https://github.com/vincentdesmares/node-primitive/raw/master/samples/generated.png "Generated svg (5KB)")

I don't like to have anything to install except nvm. So I adapted primitive.js for Node.js to avoid having to install GO when using sqip.

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
  width: 256
};

const SVGString = await generateSVG("test/profile.png", cfg);
```

## Warning

This script is really slow.

## Todo

- [ ] Check why onStep is removed the result is bad
- [ ] Remove UI stuf
- [ ] Avoid promises when possible
- [ ] Fix the exports to use default exports when only one function/class is exposed
- [ ] Replace console.log by debug
- [ ] Publish the package on npm and update the quick start

## References

* [primitive.js](https://github.com/ondras/primitive.js)
* [Testing primitive.js live](https://ondras.github.io/primitive.js/)
* [SQIP](https://github.com/technopagan/sqip)