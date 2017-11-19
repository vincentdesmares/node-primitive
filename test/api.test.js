const { generateSvg } = require("./../src/api");

//process("./profile.png");

test("adds 1 + 2 to equal 3", async () => {
  const result = await generateSvg("./test/profile.png");
  expect(result).toBe(3);
});
