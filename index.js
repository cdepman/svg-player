const body = document.body;

// load Two.js
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(body);

// Load the SVG file
const rawSvg = document.getElementById('test_svg').children[0]
const svg = two.interpret(rawSvg);
const repeatCount = 20
let svgArray = [svg]
for (let i = 1; i < repeatCount; i++) {
  svgArray.push(svg.clone())
}
const yCenter = two.height / 2
const xCenter = two.width / 2

const rotationStep = 360 / repeatCount;

// Create the repeated elements
for (let i = 0; i < repeatCount; i++) {
  item = svgArray[i]

  let rotation = (i * rotationStep) * Math.PI / 180
  console.log(rotation)
  item.translation.set(xCenter, yCenter);
  item.rotation = rotation
  item.scale = .24

  // Add the cloned element to the group
  let parent = two.makeGroup()
  parent.add(item)
  two.add(parent);
}

two.update();

const setAnimation = (shape) => {
  let angle = 0
  let shapeId = shape.id
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
