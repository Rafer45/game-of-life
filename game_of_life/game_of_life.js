// The convention for 2d coordinates in the code is (y,x)
// 
// Consider the following array:
// arr = [['a','b','c','d']
//        ['e','f','g','h']
//        ['i','j','k','l']]
// Although the coordinate of 'g' when using the [x,y] standard is [2,1],
// it must be accessed by inputting arr[1][2].
//

// In function use examples, -> should be interpreted as 'returns',
// and => should be interpreted as 'outputs'

// If the level of documentation for functions seems excessive,
// it's because it is.
// Inthis file, documntation was treated as an exercise, not as
// something actually useful. Apologies for that.

// Straight up immoral waiting function
function wait(ms) {
  ms += Date.now()
  while (Date.now() < ms){/* Burn, cycles, burn! */}
}

//
function gameOfLife(delay, world, liveN, birthN) {

  // Takes a world, converts its contents to characters,
  // and prints it.
  //
  // print([[0,1,0],
  //        [0,0,1],
  //        [1,1,1]]) =>
  //  # 
  //   #
  // ###
  function print(world) {
    // console.log("world: ", world)
    var matrix = world.map(v => v.map(nToChar)),
        str = matrixToString(matrix)
    console.log(str, '\n---')
  }

  // Converts an array to a string, using newlines to display
  // the matrix in 2d.
  //
  // matrixToString([['a','b'],
  //                 ['c','d']]) ->
  // 'ab
  // cd'
  function matrixToString(matrix) {
    return matrix.map(v => v.join(''))
                 .join('\n')
  }

  // Converts 1s and 0s to characters that look better on screen
  //
  // nToChar(1) -> '#'
  function nToChar(n) {
    return n ? '\u2588' : ' '
  }

  // Counts number of 1s around an index in a matrix.
  // Arguments should be a world, a y coordinate, and an x coordinate.
  //
  // lifeAround(2, 1 [[0,0,0],
  //                  [0,1,1],
  //                  [0,0,1]],) -> 2
  function lifeAround(y, x, world) {
    var _world = world.slice().map(v => v.slice())
    _world[y][x] = 0
    // console.log("_world: ", _world)
    return _world.slice(Math.max(0, y - 1), y + 2)
                .map(v => v.slice(Math.max(0, x - 1), x + 2))
                .reduce(((prev, curr) => prev.concat(curr)),[])
                .filter((v, i, arr) => v)
                .length
  }

  // Generates the next 'step' of the world when given a world
  // nextStep([[0,1,0],
  //           [0,1,0],
  //           [0,1,0]]) ->
  // [[0,0,0],
  //  [1,1,1],
  //  [0,0,0]]
  function nextStep(world) {
    var elem = function(v, arr) {
      return (arr.some(val => val == v))
    }
    
    return world.map((v, y) =>
      v.map(function(val, x) {
        var lRound = lifeAround(y, x, world)
        // DEBUG: console.log(y.toString(), "," , x.toString(), ": " + lRound)
        return elem(lRound, birthN) ?
               1 :
               (elem(lRound, liveN) ?
               val :
               0)}))
  }
  
  while(true) {
    print(world)
    world = nextStep(world)
    wait(delay)
  }
}

function buildMatrix(h, w /*, coordinate arrays */){
  var args = Array.prototype.slice.call(arguments, 2)
  var arr = new Array(h)
  for (var y = 0; y < h; y++) {
    arr[y] = new Array(w)
    for (var x = 0; x < w; x++) {
      arr[y][x] = 0
    }
  }

  if (typeof args[0] !== "undefined") {
    args.forEach(function(v) {
      var y = v[0],
          x = v[1]
      arr[y][x] = 1
    })
  }

  return arr
}

var blinker = buildMatrix(3, 3,
                          [0,1],
                          [1,1],
                          [2,1])

var glider = buildMatrix(10,10,
                         [0,1],
                         [1,2],
                         [2,0],[2,1],[2,2])

var pentadecathlon = buildMatrix(11, 18,
                                 [4,6],[4,11],
                                 [5,4],[5,5],[5,7],[5,8],[5,9],[5,10],[5,12],[5,13],
                                 [6,6],[6,11])

// Generates a matrix with random living/nonliving cells
// Gets matrix height and width, and gets odds of a cell being alive.

// Odds should be inputted in centesimals.
// E.g. 50% should be inputted as 0.5

var silliness = function(h, w, odds) {
  return buildMatrix(h,w)
         .map(y => y
         .map(v => Math.floor(Math.random() + odds)))
}

var delay  = parseInt(process.argv[2]) || 100

var world = process.argv[3] || "blinker"

switch(world) {

  case "glider":
    world = glider
    break;

  case "penta":
    world = pentadecathlon
    break;

  case "silly":
    (function() {
      var h    = parseInt(process.argv[4]) || 32,
          w    = parseInt(process.argv[5]) || 32,
          odds = parseFloat(process.argv[6]) || 0.5
      world = silliness(h,w,odds)
    })()
    break;

  case "spooky":
    spookCycle()

  default:
    world = blinker
    break;
}

// var world = silliness(60,60,0.5)

gameOfLife(delay,world,[2,3],[3])

// Silly easter eggs.
// Spook:
function spook() {
  console.log("  \u2588\u2588\u2588  \n \u2588",
            "\u2588 \u2588 \n\u2588\u2588\u2588",
            "\u2588\u2588\u2588\n \u2588\u2588",
            "\u2588\u2588 \n \u2588\u2588",
            "\u2588\u2588 \n  \u2588 \u2588  \n   \u2588   \n")
}

// Alt. Spook:
function spook2() {
  console.log("\n  \u2588\u2588\u2588\n \u2588",
            "\u2588 \u2588\n\u2588\u2588\u2588",
            "\u2588\u2588\u2588\n \u2588\u2588",
            "\u2588\u2588\n \u2588\u2588"+
            "\u2588\u2588\u2588\n  \u2588\u2588\u2588\n   \u2588")
}

// Spook Cycle
function spookCycle() {
    while(true) {
      spook()
      wait(delay)
      console.log("---")
      spook2()
      wait(delay)
      console.log("---")
    }
}