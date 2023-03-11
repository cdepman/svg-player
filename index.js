// grab the document body
const body = document.body;

// load Two.js
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(body);

// Load the SVG file
const rawSvg = document.getElementById('test_svg').children[0]
const svg = two.interpret(rawSvg);

// set number of desired repeats
const repeatCount = 20


let svgArray = [svg]
for (let i = 1; i < repeatCount; i++) {
  svgArray.push(svg.clone())
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
  item.scale = .24

  // Add each cloned element to an independent parent group
  let parent = two.makeGroup()
  parent.add(item)

  two.add(parent);
})

two.update();

// create animation to rotate each svg atomic shape around its own axis
const setAnimation = (shape) => {
  let angle = 0
  let shapeId = shape.id

  // grab the parent so that we can calculate the center point of the bounding box
  let elementParent = document.getElementById(shapeId).parentElement
  const { left, top, width, height } = elementParent.getBoundingClientRect()
  const centerX = left + width / 2
  const centerY = top + height / 2
  function animate() {
    // Update the rotation angle
    angle += .2;
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
    shape.rotation += .007
  })
})

two.play()
