(function() {
  // Centers
  var B, BL, BR, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, L, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, centerColor, centerFacelet, cornerColor, cornerFacelet, edgeColor, edgeFacelet;

  [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];

  // Corners
  [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

  // Edges
  [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  [centerFacelet, cornerFacelet, edgeFacelet] = (function() {
    var _B, _D, _F, _L, _R, _U;
    _U = function(x) {
      return x - 1;
    };
    _R = function(x) {
      return _U(9) + x;
    };
    _F = function(x) {
      return _R(9) + x;
    };
    _D = function(x) {
      return _F(9) + x;
    };
    _L = function(x) {
      return _D(9) + x;
    };
    _B = function(x) {
      return _L(9) + x;
    };
    return [
      // Centers
      [4,
      13,
      22,
      31,
      40,
      49],
      // Corners
      [[_U(9),
      _R(1),
      _F(3)],
      [_U(7),
      _F(1),
      _L(3)],
      [_U(1),
      _L(1),
      _B(3)],
      [_U(3),
      _B(1),
      _R(3)],
      [_D(3),
      _F(9),
      _R(7)],
      [_D(1),
      _L(9),
      _F(7)],
      [_D(7),
      _B(9),
      _L(7)],
      [_D(9),
      _R(9),
      _B(7)]],
      // Edges
      [[_U(6),
      _R(2)],
      [_U(8),
      _F(2)],
      [_U(4),
      _L(2)],
      [_U(2),
      _B(2)],
      [_D(6),
      _R(8)],
      [_D(2),
      _F(8)],
      [_D(4),
      _L(8)],
      [_D(8),
      _B(8)],
      [_F(6),
      _R(4)],
      [_F(4),
      _L(6)],
      [_B(6),
      _L(4)],
      [_B(4),
      _R(6)]]
    ];
  })();

  centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

  cornerColor = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

  edgeColor = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

  Cube = (function() {
    var faceNames, faceNums, parseAlg;

    class Cube {
      constructor(other) {
        var x;
        if (other != null) {
          this.init(other);
        } else {
          this.identity();
        }
        // For moves to avoid allocating new objects each time
        this.newCenter = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 5; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newCp = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newEp = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newCo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newEo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
      }

      init(state) {
        this.center = state.center.slice(0);
        this.co = state.co.slice(0);
        this.ep = state.ep.slice(0);
        this.cp = state.cp.slice(0);
        return this.eo = state.eo.slice(0);
      }

      identity() {
        var x;
        // Initialize to the identity cube
        this.center = [0, 1, 2, 3, 4, 5];
        this.cp = [0, 1, 2, 3, 4, 5, 6, 7];
        this.co = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        return this.eo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
      }

      toJSON() {
        return {
          center: this.center,
          cp: this.cp,
          co: this.co,
          ep: this.ep,
          eo: this.eo
        };
      }

      asString() {
        var corner, edge, i, k, l, m, n, o, ori, p, result;
        result = [];
        for (i = k = 0; k <= 5; i = ++k) {
          result[9 * i + 4] = centerColor[this.center[i]];
        }
        for (i = l = 0; l <= 7; i = ++l) {
          corner = this.cp[i];
          ori = this.co[i];
          for (n = m = 0; m <= 2; n = ++m) {
            result[cornerFacelet[i][(n + ori) % 3]] = cornerColor[corner][n];
          }
        }
        for (i = o = 0; o <= 11; i = ++o) {
          edge = this.ep[i];
          ori = this.eo[i];
          for (n = p = 0; p <= 1; n = ++p) {
            result[edgeFacelet[i][(n + ori) % 2]] = edgeColor[edge][n];
          }
        }
        return result.join('');
      }

      static fromString(str) {
        var col1, col2, cube, i, j, k, l, m, o, ori, p, q, r, ref;
        cube = new Cube();
        for (i = k = 0; k <= 5; i = ++k) {
          for (j = l = 0; l <= 5; j = ++l) {
            if (str[9 * i + 4] === centerColor[j]) {
              cube.center[i] = j;
            }
          }
        }
        for (i = m = 0; m <= 7; i = ++m) {
          for (ori = o = 0; o <= 2; ori = ++o) {
            if ((ref = str[cornerFacelet[i][ori]]) === 'U' || ref === 'D') {
              break;
            }
          }
          col1 = str[cornerFacelet[i][(ori + 1) % 3]];
          col2 = str[cornerFacelet[i][(ori + 2) % 3]];
          for (j = p = 0; p <= 7; j = ++p) {
            if (col1 === cornerColor[j][1] && col2 === cornerColor[j][2]) {
              cube.cp[i] = j;
              cube.co[i] = ori % 3;
            }
          }
        }
        for (i = q = 0; q <= 11; i = ++q) {
          for (j = r = 0; r <= 11; j = ++r) {
            if (str[edgeFacelet[i][0]] === edgeColor[j][0] && str[edgeFacelet[i][1]] === edgeColor[j][1]) {
              cube.ep[i] = j;
              cube.eo[i] = 0;
              break;
            }
            if (str[edgeFacelet[i][0]] === edgeColor[j][1] && str[edgeFacelet[i][1]] === edgeColor[j][0]) {
              cube.ep[i] = j;
              cube.eo[i] = 1;
              break;
            }
          }
        }
        return cube;
      }

      clone() {
        return new Cube(this.toJSON());
      }

      // A class method returning a new random cube
      static random() {
        return new Cube().randomize();
      }

      isSolved() {
        var c, cent, clone, e, k, l, m;
        clone = this.clone();
        clone.move(clone.upright());
        for (cent = k = 0; k <= 5; cent = ++k) {
          if (clone.center[cent] !== cent) {
            return false;
          }
        }
        for (c = l = 0; l <= 7; c = ++l) {
          if (clone.cp[c] !== c) {
            return false;
          }
          if (clone.co[c] !== 0) {
            return false;
          }
        }
        for (e = m = 0; m <= 11; e = ++m) {
          if (clone.ep[e] !== e) {
            return false;
          }
          if (clone.eo[e] !== 0) {
            return false;
          }
        }
        return true;
      }

      // Multiply this Cube with another Cube, restricted to centers.
      centerMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 5; to = ++k) {
          from = other.center[to];
          this.newCenter[to] = this.center[from];
        }
        [this.center, this.newCenter] = [this.newCenter, this.center];
        return this;
      }

      // Multiply this Cube with another Cube, restricted to corners.
      cornerMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 7; to = ++k) {
          from = other.cp[to];
          this.newCp[to] = this.cp[from];
          this.newCo[to] = (this.co[from] + other.co[to]) % 3;
        }
        [this.cp, this.newCp] = [this.newCp, this.cp];
        [this.co, this.newCo] = [this.newCo, this.co];
        return this;
      }

      // Multiply this Cube with another Cube, restricted to edges
      edgeMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 11; to = ++k) {
          from = other.ep[to];
          this.newEp[to] = this.ep[from];
          this.newEo[to] = (this.eo[from] + other.eo[to]) % 2;
        }
        [this.ep, this.newEp] = [this.newEp, this.ep];
        [this.eo, this.newEo] = [this.newEo, this.eo];
        return this;
      }

      // Multiply this cube with another Cube
      multiply(other) {
        this.centerMultiply(other);
        this.cornerMultiply(other);
        this.edgeMultiply(other);
        return this;
      }

      move(arg) {
        var face, k, l, len, move, power, ref, ref1, x;
        ref = parseAlg(arg);
        for (k = 0, len = ref.length; k < len; k++) {
          move = ref[k];
          face = move / 3 | 0;
          power = move % 3;
          for (x = l = 0, ref1 = power; (0 <= ref1 ? l <= ref1 : l >= ref1); x = 0 <= ref1 ? ++l : --l) {
            this.multiply(Cube.moves[face]);
          }
        }
        return this;
      }

      upright() {
        var clone, i, j, k, l, result;
        clone = this.clone();
        result = [];
        for (i = k = 0; k <= 5; i = ++k) {
          if (clone.center[i] === F) {
            break;
          }
        }
        switch (i) {
          case D:
            result.push("x");
            break;
          case U:
            result.push("x'");
            break;
          case B:
            result.push("x2");
            break;
          case R:
            result.push("y");
            break;
          case L:
            result.push("y'");
        }
        if (result.length) {
          clone.move(result[0]);
        }
        for (j = l = 0; l <= 5; j = ++l) {
          if (clone.center[j] === U) {
            break;
          }
        }
        switch (j) {
          case L:
            result.push("z");
            break;
          case R:
            result.push("z'");
            break;
          case D:
            result.push("z2");
        }
        return result.join(' ');
      }

      static inverse(arg) {
        var face, k, len, move, power, result, str;
        result = (function() {
          var k, len, ref, results;
          ref = parseAlg(arg);
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            move = ref[k];
            face = move / 3 | 0;
            power = move % 3;
            results.push(face * 3 + -(power - 1) + 1);
          }
          return results;
        })();
        result.reverse();
        if (typeof arg === 'string') {
          str = '';
          for (k = 0, len = result.length; k < len; k++) {
            move = result[k];
            face = move / 3 | 0;
            power = move % 3;
            str += faceNames[face];
            if (power === 1) {
              str += '2';
            } else if (power === 2) {
              str += "'";
            }
            str += ' ';
          }
          return str.substring(0, str.length - 1);
        } else if (arg.length != null) {
          return result;
        } else {
          return result[0];
        }
      }

    };

    Cube.prototype.randomize = (function() {
      var arePermutationsValid, generateValidRandomOrientation, generateValidRandomPermutation, getNumSwaps, isOrientationValid, randint, randomizeOrientation, result, shuffle;
      randint = function(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
      };
      // Fisher-Yates shuffle adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      shuffle = function(array) {
        var currentIndex, randomIndex, temporaryValue;
        currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = randint(0, currentIndex - 1);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      };
      getNumSwaps = function(arr) {
        var cur, cycleLength, i, k, numSwaps, ref, seen, x;
        numSwaps = 0;
        seen = (function() {
          var k, ref, results;
          results = [];
          for (x = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); x = 0 <= ref ? ++k : --k) {
            results.push(false);
          }
          return results;
        })();
        while (true) {
          // We compute the cycle decomposition
          cur = -1;
          for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
            if (!seen[i]) {
              cur = i;
              break;
            }
          }
          if (cur === -1) {
            break;
          }
          cycleLength = 0;
          while (!seen[cur]) {
            seen[cur] = true;
            cycleLength++;
            cur = arr[cur];
          }
          // A cycle is equivalent to cycleLength + 1 swaps
          numSwaps += cycleLength + 1;
        }
        return numSwaps;
      };
      arePermutationsValid = function(cp, ep) {
        var numSwaps;
        numSwaps = getNumSwaps(ep) + getNumSwaps(cp);
        return numSwaps % 2 === 0;
      };
      generateValidRandomPermutation = function(cp, ep) {
        // Each shuffle only takes around 12 operations and there's a 50%
        // chance of a valid permutation so it'll finish in very good time
        shuffle(ep);
        shuffle(cp);
        while (!arePermutationsValid(cp, ep)) {
          shuffle(ep);
          shuffle(cp);
        }
      };
      randomizeOrientation = function(arr, numOrientations) {
        var i, k, ori, ref;
        ori = 0;
        for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
          ori += (arr[i] = randint(0, numOrientations - 1));
        }
      };
      isOrientationValid = function(arr, numOrientations) {
        return arr.reduce(function(a, b) {
          return a + b;
        }) % numOrientations === 0;
      };
      generateValidRandomOrientation = function(co, eo) {
        // There is a 1/2 and 1/3 probably respectively of each of these
        // succeeding so the probability of them running 10 times before
        // success is already only 1% and only gets exponentially lower
        // and each generation is only in the 10s of operations which is nothing
        randomizeOrientation(co, 3);
        while (!isOrientationValid(co, 3)) {
          randomizeOrientation(co, 3);
        }
        randomizeOrientation(eo, 2);
        while (!isOrientationValid(eo, 2)) {
          randomizeOrientation(eo, 2);
        }
      };
      result = function() {
        generateValidRandomPermutation(this.cp, this.ep);
        generateValidRandomOrientation(this.co, this.eo);
        return this;
      };
      return result;
    })();

    Cube.moves = [
      {
        // U
        center: [0, 1, 2, 3, 4, 5],
        cp: [UBR,
      URF,
      UFL,
      ULB,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UB,
      UR,
      UF,
      UL,
      DR,
      DF,
      DL,
      DB,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // R
        center: [0, 1, 2, 3, 4, 5],
        cp: [DFR,
      UFL,
      ULB,
      URF,
      DRB,
      DLF,
      DBL,
      UBR],
        co: [2,
      0,
      0,
      1,
      1,
      0,
      0,
      2],
        ep: [FR,
      UF,
      UL,
      UB,
      BR,
      DF,
      DL,
      DB,
      DR,
      FL,
      BL,
      UR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // F
        center: [0, 1, 2, 3, 4, 5],
        cp: [UFL,
      DLF,
      ULB,
      UBR,
      URF,
      DFR,
      DBL,
      DRB],
        co: [1,
      2,
      0,
      0,
      2,
      1,
      0,
      0],
        ep: [UR,
      FL,
      UL,
      UB,
      DR,
      FR,
      DL,
      DB,
      UF,
      DF,
      BL,
      BR],
        eo: [0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0]
      },
      {
        // D
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DLF,
      DBL,
      DRB,
      DFR],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UF,
      UL,
      UB,
      DF,
      DL,
      DB,
      DR,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // L
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      ULB,
      DBL,
      UBR,
      DFR,
      UFL,
      DLF,
      DRB],
        co: [0,
      1,
      2,
      0,
      0,
      2,
      1,
      0],
        ep: [UR,
      UF,
      BL,
      UB,
      DR,
      DF,
      FL,
      DB,
      FR,
      UL,
      DL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // B
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      UFL,
      UBR,
      DRB,
      DFR,
      DLF,
      ULB,
      DBL],
        co: [0,
      0,
      1,
      2,
      0,
      0,
      2,
      1],
        ep: [UR,
      UF,
      UL,
      BR,
      DR,
      DF,
      DL,
      BL,
      FR,
      FL,
      UB,
      DB],
        eo: [0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1]
      },
      {
        // E
        center: [U,
      F,
      L,
      D,
      B,
      R],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UF,
      UL,
      UB,
      DR,
      DF,
      DL,
      DB,
      FL,
      BL,
      BR,
      FR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1]
      },
      {
        // M
        center: [B,
      R,
      U,
      F,
      L,
      D],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UB,
      UL,
      DB,
      DR,
      UF,
      DL,
      DF,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0]
      },
      {
        // S
        center: [L,
      U,
      F,
      R,
      D,
      B],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UL,
      UF,
      DL,
      UB,
      UR,
      DF,
      DR,
      DB,
      FR,
      FL,
      BL,
      BR],
        eo: [1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0]
      }
    ];

    faceNums = {
      U: 0,
      R: 1,
      F: 2,
      D: 3,
      L: 4,
      B: 5,
      E: 6,
      M: 7,
      S: 8,
      x: 9,
      y: 10,
      z: 11,
      u: 12,
      r: 13,
      f: 14,
      d: 15,
      l: 16,
      b: 17
    };

    faceNames = {
      0: 'U',
      1: 'R',
      2: 'F',
      3: 'D',
      4: 'L',
      5: 'B',
      6: 'E',
      7: 'M',
      8: 'S',
      9: 'x',
      10: 'y',
      11: 'z',
      12: 'u',
      13: 'r',
      14: 'f',
      15: 'd',
      16: 'l',
      17: 'b'
    };

    parseAlg = function(arg) {
      var k, len, move, part, power, ref, results;
      if (typeof arg === 'string') {
        ref = arg.split(/\s+/);
        // String
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part = ref[k];
          if (part.length === 0) {
            // First and last can be empty
            continue;
          }
          if (part.length > 2) {
            throw new Error(`Invalid move: ${part}`);
          }
          move = faceNums[part[0]];
          if (move === void 0) {
            throw new Error(`Invalid move: ${part}`);
          }
          if (part.length === 1) {
            power = 0;
          } else {
            if (part[1] === '2') {
              power = 1;
            } else if (part[1] === "'") {
              power = 2;
            } else {
              throw new Error(`Invalid move: ${part}`);
            }
          }
          results.push(move * 3 + power);
        }
        return results;
      } else if (arg.length != null) {
        // Already an array
        return arg;
      } else {
        // A single move
        return [arg];
      }
    };

    // x
    Cube.moves.push(new Cube().move("R M' L'").toJSON());

    // y
    Cube.moves.push(new Cube().move("U E' D'").toJSON());

    // z
    Cube.moves.push(new Cube().move("F S B'").toJSON());

    // u
    Cube.moves.push(new Cube().move("U E'").toJSON());

    // r
    Cube.moves.push(new Cube().move("R M'").toJSON());

    // f
    Cube.moves.push(new Cube().move("F S").toJSON());

    // d
    Cube.moves.push(new Cube().move("D E").toJSON());

    // l
    Cube.moves.push(new Cube().move("L M").toJSON());

    // b
    Cube.moves.push(new Cube().move("B S'").toJSON());

    return Cube;

  }).call(this);

  //# Globals
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Cube;
  } else {
    this.Cube = Cube;
  }

}).call(this);
