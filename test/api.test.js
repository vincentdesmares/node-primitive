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

test("Check that the SVG is returned", async () => {
  const result = await generateSVG("samples/profile.png", cfg);
  console.log(result);
  expect(result).toNotBe(null);
});
