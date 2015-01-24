# canvas-graduated-opacity-animation

Demonstrates a unique canvas effect for use with slideshow, uses requestAnimationFrame, jquery
for convenience, and a modification to the canvas context 'createLinearGradient' method
found here: https://code.google.com/p/canvasimagegradient/

Still needs generalization to be more useable, but the example works.

DEMO
To get the demo to work, you may have to run a simple server
(due to some browser's interpretation of Cross Origin Policy).
Easiest way is python simplehttpserver:

```
cd /wherever/canvas-graduated-opacity-animation
python -m SimpleHTTPServer 8000
```

 and then tell your browser to go to <a href='http://localhost:8000'>localhost:8000</a>.
 Click start to see the animation


 Explanation

 On load, our jquery cprep extension draws our black and white to the canvas, pulling from
 the backup <img> inside the canvas (in case the browser doesn't have canvas capabilities).
 The button click calls revealGlory, which sets the before and after image, and then calls
 requestAnimationFrame on our rendering function crossfade, which uses the expanded functionality
 provided by the canvasImageGradient library to gradually render the new image over the old with a gradual transparency.

Adjust timing of animation by changing value of 'seconds' variable, and the spread of the gradient in pixels by changing
the 'offset' variable.


