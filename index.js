// grab the document body
const body = document.body;

// set number of desired repeats
const repeatCount = 16;

// define background color
const backgroundColor = '#3c234b';

// set backround color
document.body.style.background = backgroundColor;

// animations are slower on mobile clients, so increase the size of each turn there
const mobileAnimationSpeedMultiplier = window.innerWidth > 700 ? 1 : 1.75;
``
// set the individual svg component animation rotation angle increment
// in radians for each animation frame tick
const individualSvgRotationAngleIncrememntRadians = 0.05 * mobileAnimationSpeedMultiplier;

// set the individual svg component scale factor (size)
const individualSvgScaleFactor = window.innerWidth > 700 ? .25 : .10;

// set the rotation increment in radians for the svg component composite
// for each animation frame tick
let compositeRotationAngleIncrementRadians = .005 * mobileAnimationSpeedMultiplier;

const clockwise = true;

compositeRotationAngleIncrementRadians = compositeRotationAngleIncrementRadians * (clockwise ? 1 : -1 );

// load Two.js
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(body);

// Load the SVG file
const svgComponentElement = document.getElementById('svg_container').children[0];
const interpretedSvgComponent = two.interpret(svgComponentElement);

// Build an array of svg component clones based on the number of repeats
let svgComponentArray = []
for (let i = 0; i < repeatCount; i++) {
  svgComponentArray.push(interpretedSvgComponent.clone());
}

// clean up the original svg
interpretedSvgComponent.remove()

// get center of the canvas
const yCenter = two.height / 2
const xCenter = two.width / 2

// break circle into evenly-spaced radial repeat
const rotationStepDegrees = 360 / repeatCount
const rotationStepRadians = rotationStepDegrees * Math.PI / 180

// create the radially repeated elements
svgComponentArray.forEach((component, i) => {
  let rotation = i * rotationStepRadians
  // set the center point to rotate around
  component.translation.set(xCenter, yCenter)
  component.rotation = rotation
  // scale the svg depending on needs
  component.scale = individualSvgScaleFactor

  // Add each cloned element to an independent parent group
  let parent = two.makeGroup()
  parent.add(component)

  // add them to the two context
  two.add(parent);
})

two.update();

// create animation to rotate each svg component component around its own axis
const setComponentRotationAnimation = (component) => {
  let angle = 0

  // grab the parent so that we can calculate the center point of the bounding box
  let elementParent = document.getElementById(component.id).parentElement
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

svgComponentArray.forEach((component) => {
  // set the animation on each component to rotate it around its own axis
  setComponentRotationAnimation(component)
})

two.bind('update', () => {
  svgComponentArray.forEach((component) => {
    // set each component to rotate around the central axis
    component.rotation += compositeRotationAngleIncrementRadians;
  })
})

two.play()
