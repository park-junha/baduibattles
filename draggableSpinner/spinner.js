const lipsumText = `<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae odio mi. 
Proin accumsan velit at dolor pellentesque, sed consectetur felis 
condimentum. Nunc molestie ante dui, vitae auctor felis tristique vitae. 
Integer sit amet nisi id odio facilisis fringilla. Nunc risus eros, elementum 
nec nisl at, imperdiet ultrices eros. Aliquam erat volutpat. Pellentesque 
rutrum ipsum sit amet urna dapibus dapibus. Maecenas quis justo tortor. 
Pellentesque sit amet orci non orci laoreet efficitur. Curabitur aliquet 
purus arcu, bibendum placerat dolor vulputate et. Nulla eros erat, fermentum 
nec lacus consequat, gravida convallis eros. Nulla at est vel nunc lacinia 
rhoncus ac at nulla. Vestibulum ac nisl tristique, dapibus nunc eget, 
consectetur tortor. Integer ut interdum nisl, sed sollicitudin arcu. 
Suspendisse quis tempus metus, ac ultrices odio.
</p><p>
Morbi laoreet velit semper tortor accumsan finibus. Quisque eget orci tempus, 
gravida ipsum quis, viverra ligula. Etiam velit mi, luctus eu nulla eget, 
viverra congue leo. Proin eu fringilla nunc. Aliquam egestas dolor non nisl 
lacinia placerat. Nullam molestie dolor in fermentum iaculis. Suspendisse ut 
quam quis sem aliquam ornare vitae sit amet neque. Nam vehicula tellus 
placerat, ornare quam blandit, ultricies elit. Ut cursus hendrerit risus vel 
maximus.
</p><p>
Nunc tempor tempor metus, eu sollicitudin augue. Vivamus eget tortor aliquet, 
ultricies eros porta, placerat sapien. Nam finibus efficitur leo, nec gravida 
erat efficitur nec. Nunc molestie imperdiet orci. Suspendisse aliquet dui 
rhoncus, blandit arcu id, dignissim augue. Sed dignissim orci quis sodales 
sagittis. Aliquam consequat, massa blandit ultricies tempus, ex risus luctus 
lorem, ut lobortis dolor magna sed sapien. Pellentesque pulvinar nunc ac 
sagittis pharetra. Phasellus sit amet laoreet metus. Integer accumsan at 
lectus eu vulputate. Pellentesque habitant morbi tristique senectus et netus 
et malesuada fames ac turpis egestas.
</p>`;

// State variables
var spinnerProgress = 0;
var mouseIsDown = false;
var previousPos = undefined;

// Document objects
var progressNum;
var lipsum;
var canv;
var ctx;
var rect;

window.onload = function () {
  progressNum = document.getElementById("progress-num");
  lipsum = document.getElementById("lipsum");
  canv = document.getElementById("spinner-canvas");
  ctx = canv.getContext("2d");
  rect = canv.getBoundingClientRect();

  progressNum.innerHTML = `Loading... ${+spinnerProgress.toFixed(1)}%`;

  // Add event listeners
  canv.addEventListener("mousedown", onMouseDown);
  canv.addEventListener("mousemove", onMouseMove);
  canv.addEventListener("mouseup", onMouseUp);

  // Draw spinner
  drawSpinner();
}

function onMouseDown(event) {
  mouseIsDown = true;
  let radialPos = calculateRadians(event.pageX, event.pageY);
  previousPos = radialPos;
}

function onMouseUp(event) {
  mouseIsDown = false;
  previousPos = undefined;
}

function onMouseMove(event) {
  if (mouseIsDown === true) {
    let radialPos = calculateRadians(event.pageX, event.pageY);
    let delta = (radialPos - previousPos) % (2 * Math.PI);
    previousPos = radialPos;

    // If absolute value of delta is very large we need to compensate
    // Otherwise, delta will hang around 0 and 6.28 until mouse is released
    if (delta > 4.75) {
      delta -= 2 * Math.PI;
    } else if (delta < -4.75) {
      delta += 2 * Math.PI;
    }

    // Apply spinner delta to overall spinner progress
    spinnerProgress += delta;

    if (spinnerProgress > 100) {
      // Hide spinner and load contents
      progressNum.style.display = 'none';
      canv.style.display = 'none';
      lipsum.innerHTML = lipsumText;
    } else {
      // Update progress % number
      progressNum.innerHTML = `Loading... ${+spinnerProgress.toFixed(1)}%`;

      // Rotate canvas and re-draw spinner
      ctx.translate(rect.width / 2, rect.height / 2);
      ctx.rotate(delta);
      ctx.translate(-rect.width / 2, -rect.height / 2);
      drawSpinner();
    }
  }
}

function calculateRadians(x, y) {
  /**
   * Calculates radians of mouse position from center of rect.
   */
  let rectX = x - rect.left - 1;
  let rectY = y - rect.top - 1;
  let deltaX = rectX - rect.width / 2;
  let deltaY = rectY - rect.height / 2;
  return Math.atan2(deltaY, deltaX);
}

function drawSpinner() {
  ctx.lineWidth = Math.floor(rect.height * 0.04);
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.arc(
    rect.width * 0.5,
    rect.height * 0.5,
    rect.height * 0.15,
    spinnerProgress % (2 * Math.PI),
    (spinnerProgress + 5) % (2 * Math.PI)
  );
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth++;
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.arc(
    rect.width * 0.5,
    rect.height * 0.5,
    rect.height * 0.15,
    spinnerProgress % (2 * Math.PI),
    (spinnerProgress + 5) % (2 * Math.PI),
    true
  );
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
}
