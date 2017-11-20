const { generateSvg } = require("./../src/api");
const { Triangle } = require("./../src/shape");

//process("./profile.png");

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

test("adds 1 + 2 to equal 3", async () => {
  const result = await generateSvg("test/profile.png", cfg);
  expect(result).toBe(3);
});
