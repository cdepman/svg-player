// grab the document body
const body = document.body;

// set number of desired repeats
const repeatCount = 20;

// set the individual svg component animation rotation angle increment
// in radians for each animation frame tick
const individualSvgRotationAngleIncrememntRadians = 0.2;

// set the individual svg component scale factor (size)
const individualSvgScaleFactor = window.innerWidth > 700 ? .24 : .15;

// set the rotation increment in radians for the svg component composite
// for each animation frame tick
const compositeRotationAngleIncrementRadians = .007

// load Two.js
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(body);

// Load the SVG file
const rawSvg = document.getElementById('test_svg').children[0];
const svg = two.interpret(rawSvg);

// Build an array of svg clones based on the number of repeats
let svgArray = [svg]
for (let i = 1; i < repeatCount; i++) {
  svgArray.push(svg.clone());
}

// get center of the canvas
const yCenter = two.height / 2
const xCenter = two.width / 2

// break circle into evenly-spaced radial repeat
const rotationStepDegrees = 360 / repeatCount
const rotationStepRadians = rotationStepDegrees * Math.PI / 180

// create the radially repeated elements
svgArray.forEach((item, i) => {
  let rotation = i * rotationStepRadians
  // set the center point to rotate around
  item.translation.set(xCenter, yCenter)
  item.rotation = rotation
  // scale the svg depending on needs
  item.scale = individualSvgScaleFactor

  // Add each cloned element to an independent parent group
  let parent = two.makeGroup()
  parent.add(item)

  // add them to the two context
  two.add(parent);
})

two.update();

// create animation to rotate each svg atomic shape around its own axis
const setAnimation = (shape) => {
  let angle = 0
  let shapeId = shape.id

  // grab the parent so that we can calculate the center point of the bounding box
  let elementParent = document.getElementById(shapeId).parentElement
  // extract the measurements from the bounding box
  const { left, top, width, height } = elementParent.getBoundingClientRect()
  // calculate the x,y center
  const centerX = left + width / 2
  const centerY = top + height / 2
  // create a function to animate each individual svg component
  function animate() {
    // Update the rotation angle
    angle += individualSvgRotationAngleIncrememntRadians;
    // Apply the rotation to the SVG
    elementParent.setAttribute('transform', `rotate(${angle}, ${centerX}, ${centerY})`);

    // Request the next frame of the animation loop
    requestAnimationFrame(animate);
  }
  // start animation
  animate()
}

svgArray.forEach((shape, i) => {
  // set the animation on each item to rotate it around its own axis
  setAnimation(shape)
})

two.bind('update', function(frameCount) {
  svgArray.forEach((shape, i) => {
    // set each shape to rotate around the central axis
    shape.rotation += compositeRotationAngleIncrementRadians;
  })
})

two.play()
