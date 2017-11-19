const { CanvasWrapper } = require("./canvasWrapper");
const Optimizer = require("./optimizer");
const jsdom = require("jsdom");
const canvas = require("canvas");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);

const { document } = new JSDOM(
  `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title>primitive.js &ndash; drawing images with geometric primitives</title>
	</head>

	<body>
		<p><img src="logo.png" alt="Logo" /></p>
		<h1>primitive.js</h1>
		<p>This is a JavaScript port of the <a href="http://primitive.lol">http://primitive.lol</a> app, originally created by Michael Fogleman. Its purpose is to re-draw existing images using only primitive geometric shapes.</p>
		<p>You can find some additional (technical) information in the <a href="https://github.com/ondras/primitive.js">GitHub repository</a>. This page acts as a small demo where you can experiment with the algorithm.</p>
		
		<h2>Try it in your browser!</h2>
		<form>
			<h3>Pick an image file from your computer</h3>
			<input type="file" />
			<h3>Check or adjust various rendering options</h3>
			<div>
				<p>Add <span class="value"></span> geometric shapes
					<em>(large number: better results, slower)</em>
				</p>
				<input name="steps" type="range" min="1" max="500" value="50" />
			</div>
			<div>
				<p>Use these shape types:</p>
				<label><input type="checkbox" name="shapeType" value="triangle" checked="checked" />Triangles</label><br/>
				<label><input type="checkbox" name="shapeType" value="rectangle" />Rectangles</label><br/>
				<label><input type="checkbox" name="shapeType" value="ellipse" />Ellipses</label><br/>
				<label><input type="checkbox" name="shapeType" value="smiley" />Smileys</label>
			</div>
			<div>
				<p>Fill background with:</p>
				<label><input type="radio" name="fill" value="auto" checked="checked" />an auto-detected color</label><br/>
				<label><input type="radio" name="fill" value="fixed" />a fixed color: </label>
				<input type="color" value="#ffffff" name="fill-color" />
			</div>
			<div>
				<p>Starting opacity: <span class="value"></span></p>
				<input name="alpha" type="range" min="0" max="1" step="0.1" value="0.5" /><br/>
				<label><input type="checkbox" name="mutateAlpha" checked="checked" />Adjust opacity automatically</label>
			</div>
			<div>
				<p>Computation size: <span class="value"></span> pixels
					<em>(smaller is faster)</em>
				</p>
				<input name="computeSize" type="range" min="128" max="512" value="256" /><br/>
			</div>
			<div>
				<p>Viewing size: <span class="value"></span> pixels</p>
				<input name="viewSize" type="range" min="256" max="2048" value="512" />
			</div>
			<div>
				<p>Start every iteration with <span class="value"></span> random shapes
					<em>(larger number: more precise results, slower)</em>
				</p>
				<input name="shapes" type="range" min="1" max="1000" value="200" />
			</div>
			<div>
				<p>Stop shape optimization after <span class="value"></span> failures
					<em>(larger number: more precise results, slower)</em>
				</p>
				<input name="mutations" type="range" min="0" max="100" value="30" />
			</div>

			<h3>Hit the button to start</h3>
			<p>This is a CPU-intensive process. It might take a while.</p>
			<input type="submit" value="Let's go!" />
		</form>

		<section id="output">
			<div>
				<h3>Original</h3>
				<div id="original"></div>
			</div>
			<div>
				<h3>Result <span id="steps"></span></h3>
				<div class="raster" id="raster"></div>
				<div class="vector" id="vector"></div>
				<label><input type="radio" name="type" value="raster" checked="checked" />Raster image: right-click to save</label><br/>
				<label><input type="radio" name="type" value="vector" />Vector image: copy&amp;paste data from the text area below</label><br/>
				<textarea class="vector" id="vector-text"></textarea>
			</div>
		</section>

		<footer>
			&copy; 2016 <a href="http://ondras.zarovi.cz/">Ondřej Žára</a>, <a href="https://github.com/ondras/primitive.js">GitHub repository</a>
		</footer>
	</body>
</html>`,
  {
    // Use the current working directory as the document's origin, so
    // requests to local files work correctly with CORS.
    url: "file://" + process.cwd() + "/",
    features: {
      FetchExternalResources: ["img"]
    },
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole
  }
).window;
const nodes = {
  output: document.querySelector("#output"),
  original: document.querySelector("#original"),
  steps: document.querySelector("#steps"),
  raster: document.querySelector("#raster"),
  vector: document.querySelector("#vector"),
  vectorText: document.querySelector("#vector-text"),
  types: Array.from(document.querySelectorAll("#output [name=type]"))
};

let steps;

function go(original, cfg) {
  nodes.steps.innerHTML = "";
  nodes.original.innerHTML = "";
  nodes.raster.innerHTML = "";
  nodes.vector.innerHTML = "";
  nodes.vectorText.value = "";

  nodes.output.style.display = "";
  nodes.original.appendChild(original.node);

  let optimizer = new Optimizer(original, cfg);
  steps = 0;

  let cfg2 = Object.assign({}, cfg, {
    width: cfg.scale * cfg.width,
    height: cfg.scale * cfg.height
  });
  let result = CanvasWrapper.empty(cfg2, false);
  result.ctx.scale(cfg.scale, cfg.scale);
  nodes.raster.appendChild(result.node);

  let svg = CanvasWrapper.empty(cfg, true);
  svg.setAttribute("width", cfg2.width);
  svg.setAttribute("height", cfg2.height);
  nodes.vector.appendChild(svg);

  let serializer = new XMLSerializer();

  optimizer.onStep = step => {
    if (step) {
      result.drawStep(step);
      svg.appendChild(step.toSVG());
      let percent = (100 * (1 - step.distance)).toFixed(2);
      nodes.vectorText.value = serializer.serializeToString(svg);
      nodes.steps.innerHTML = `(${++steps} of ${cfg.steps}, ${percent}% similar)`;
    }
  };
  optimizer.start();

  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

async function generateSvg(url) {
  console.log("Processing called");
  let cfg = {};

  const original = await CanvasWrapper.original(url, cfg);
  console.log("got original");
  return go(original, cfg);
}

function init() {
  nodes.output.style.display = "none";
  nodes.types.forEach(input => input.addEventListener("click", syncType));
  syncType();
  document.querySelector("form").addEventListener("submit", onSubmit);
}

function syncType() {
  nodes.output.className = "";
  nodes.types.forEach(input => {
    if (input.checked) {
      nodes.output.classList.add(input.value);
    }
  });
}

exports.generateSvg = generateSvg;
