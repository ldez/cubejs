# cube.js

cube.js is a JavaScript library for modeling and solving the 3x3x3
Rubik's Cube.

Most notably, it implements [Herbert Kociemba's two-phase
algorithm](http://kociemba.org/cube.htm) for solving any state of the
cube very fast in 22 moves or less.

cube.js is written in [CoffeeScript](http://coffeescript.org/), and
runs on [node.js](http://nodejs.org/) and modern browsers.


## Examples

`cube.js` gives you basic cube manipulation:

```javascript
// Create a new solved cube instance
var cube = new Cube();

// Apply an algorithm or randomize the cube state
cube.move("U F R2 B' D2 L'");
cube.randomize();

// Create a new random cube
var randomCube = Cube.random();
```

Include `solve.js` to solve the cube.

```javascript
// This takes 4-5 seconds on a modern computer
Cube.initSolver();

// These typically take from 0.01s to 0.2s, sometimes up to 1s
cube.solve();        // => "D2 B' R' B L' B ..."
randomCube.solve();  // => "R B' R U' D' R' ..."
```

To offload the solving to a web worker, use `async.js` and
`worker.js`:

```javascript
Cube.asyncInit('lib/worker.js', function() {
    // Initialized
    Cube.asyncSolve(randomCube, function(algorithm) {
        console.log(algorithm);
    });
});
```

A full-fledged random state scrambler demo is available at
http://www.digip.org/cubejs/demo/.


License
-------

cube.js is licensed under the
[MIT License](http://opensource.org/licenses/MIT).
