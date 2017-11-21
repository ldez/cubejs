(function() {
  var B, BL, BR, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, L, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, centerColor, centerFacelet, cornerColor, cornerFacelet, edgeColor, edgeFacelet, ref, ref1, ref2, ref3;

  ref = [0, 1, 2, 3, 4, 5], U = ref[0], R = ref[1], F = ref[2], D = ref[3], L = ref[4], B = ref[5];

  ref1 = [0, 1, 2, 3, 4, 5, 6, 7], URF = ref1[0], UFL = ref1[1], ULB = ref1[2], UBR = ref1[3], DFR = ref1[4], DLF = ref1[5], DBL = ref1[6], DRB = ref1[7];

  ref2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], UR = ref2[0], UF = ref2[1], UL = ref2[2], UB = ref2[3], DR = ref2[4], DF = ref2[5], DL = ref2[6], DB = ref2[7], FR = ref2[8], FL = ref2[9], BL = ref2[10], BR = ref2[11];

  ref3 = (function() {
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
    return [[4, 13, 22, 31, 40, 49], [[_U(9), _R(1), _F(3)], [_U(7), _F(1), _L(3)], [_U(1), _L(1), _B(3)], [_U(3), _B(1), _R(3)], [_D(3), _F(9), _R(7)], [_D(1), _L(9), _F(7)], [_D(7), _B(9), _L(7)], [_D(9), _R(9), _B(7)]], [[_U(6), _R(2)], [_U(8), _F(2)], [_U(4), _L(2)], [_U(2), _B(2)], [_D(6), _R(8)], [_D(2), _F(8)], [_D(4), _L(8)], [_D(8), _B(8)], [_F(6), _R(4)], [_F(4), _L(6)], [_B(6), _L(4)], [_B(4), _R(6)]]];
  })(), centerFacelet = ref3[0], cornerFacelet = ref3[1], edgeFacelet = ref3[2];

  centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

  cornerColor = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

  edgeColor = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

  Cube = (function() {
    var faceNames, faceNums, parseAlg;

    function Cube(other) {
      var x;
      if (other != null) {
        this.init(other);
      } else {
        this.identity();
      }
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

    Cube.prototype.init = function(state) {
      this.center = state.center.slice(0);
      this.co = state.co.slice(0);
      this.ep = state.ep.slice(0);
      this.cp = state.cp.slice(0);
      return this.eo = state.eo.slice(0);
    };

    Cube.prototype.identity = function() {
      var x;
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
    };

    Cube.prototype.toJSON = function() {
      return {
        center: this.center,
        cp: this.cp,
        co: this.co,
        ep: this.ep,
        eo: this.eo
      };
    };

    Cube.prototype.asString = function() {
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
    };

    Cube.fromString = function(str) {
      var col1, col2, cube, i, j, k, l, m, o, ori, p, q, ref4, s;
      cube = new Cube;
      for (i = k = 0; k <= 5; i = ++k) {
        for (j = l = 0; l <= 5; j = ++l) {
          if (str[9 * i + 4] === centerColor[j]) {
            cube.center[i] = j;
          }
        }
      }
      for (i = m = 0; m <= 7; i = ++m) {
        for (ori = o = 0; o <= 2; ori = ++o) {
          if ((ref4 = str[cornerFacelet[i][ori]]) === 'U' || ref4 === 'D') {
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
        for (j = s = 0; s <= 11; j = ++s) {
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
    };

    Cube.prototype.clone = function() {
      return new Cube(this.toJSON());
    };

    Cube.prototype.randomize = (function() {
      var mixPerm, randOri, randint, result;
      randint = function(min, max) {
        return min + (Math.random() * (max - min + 1) | 0);
      };
      mixPerm = function(arr) {
        var i, k, max, r, ref4, ref5, ref6, results;
        max = arr.length - 1;
        results = [];
        for (i = k = 0, ref4 = max - 2; 0 <= ref4 ? k <= ref4 : k >= ref4; i = 0 <= ref4 ? ++k : --k) {
          r = randint(i, max);
          if (i !== r) {
            ref5 = [arr[r], arr[i]], arr[i] = ref5[0], arr[r] = ref5[1];
            results.push((ref6 = [arr[max - 1], arr[max]], arr[max] = ref6[0], arr[max - 1] = ref6[1], ref6));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      randOri = function(arr, max) {
        var i, k, ori, ref4;
        ori = 0;
        for (i = k = 0, ref4 = arr.length - 2; 0 <= ref4 ? k <= ref4 : k >= ref4; i = 0 <= ref4 ? ++k : --k) {
          ori += (arr[i] = randint(0, max - 1));
        }
        return arr[arr.length - 1] = (max - ori % max) % max;
      };
      result = function() {
        mixPerm(this.cp);
        mixPerm(this.ep);
        randOri(this.co, 3);
        randOri(this.eo, 2);
        return this;
      };
      return result;
    })();

    Cube.random = function() {
      return new Cube().randomize();
    };

    Cube.prototype.isSolved = function() {
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
    };

    Cube.prototype.centerMultiply = function(other) {
      var from, k, ref4, to;
      for (to = k = 0; k <= 5; to = ++k) {
        from = other.center[to];
        this.newCenter[to] = this.center[from];
      }
      ref4 = [this.newCenter, this.center], this.center = ref4[0], this.newCenter = ref4[1];
      return this;
    };

    Cube.prototype.cornerMultiply = function(other) {
      var from, k, ref4, ref5, to;
      for (to = k = 0; k <= 7; to = ++k) {
        from = other.cp[to];
        this.newCp[to] = this.cp[from];
        this.newCo[to] = (this.co[from] + other.co[to]) % 3;
      }
      ref4 = [this.newCp, this.cp], this.cp = ref4[0], this.newCp = ref4[1];
      ref5 = [this.newCo, this.co], this.co = ref5[0], this.newCo = ref5[1];
      return this;
    };

    Cube.prototype.edgeMultiply = function(other) {
      var from, k, ref4, ref5, to;
      for (to = k = 0; k <= 11; to = ++k) {
        from = other.ep[to];
        this.newEp[to] = this.ep[from];
        this.newEo[to] = (this.eo[from] + other.eo[to]) % 2;
      }
      ref4 = [this.newEp, this.ep], this.ep = ref4[0], this.newEp = ref4[1];
      ref5 = [this.newEo, this.eo], this.eo = ref5[0], this.newEo = ref5[1];
      return this;
    };

    Cube.prototype.multiply = function(other) {
      this.centerMultiply(other);
      this.cornerMultiply(other);
      this.edgeMultiply(other);
      return this;
    };

    Cube.moves = [
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        center: [0, 1, 2, 3, 4, 5],
        cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR],
        co: [2, 0, 0, 1, 1, 0, 0, 2],
        ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        center: [0, 1, 2, 3, 4, 5],
        cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB],
        co: [1, 2, 0, 0, 2, 1, 0, 0],
        ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR],
        eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]
      }, {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB],
        co: [0, 1, 2, 0, 0, 2, 1, 0],
        ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL],
        co: [0, 0, 1, 2, 0, 0, 2, 1],
        ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB],
        eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]
      }, {
        center: [U, F, L, D, B, R],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UF, UL, UB, DR, DF, DL, DB, FL, BL, BR, FR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      }, {
        center: [B, R, U, F, L, D],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UB, UL, DB, DR, UF, DL, DF, FR, FL, BL, BR],
        eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
      }, {
        center: [L, U, F, R, D, B],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UL, UF, DL, UB, UR, DF, DR, DB, FR, FL, BL, BR],
        eo: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
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
      var k, len, move, part, power, ref4, results;
      if (typeof arg === 'string') {
        ref4 = arg.split(/\s+/);
        results = [];
        for (k = 0, len = ref4.length; k < len; k++) {
          part = ref4[k];
          if (part.length === 0) {
            continue;
          }
          if (part.length > 2) {
            throw new Error("Invalid move: " + part);
          }
          move = faceNums[part[0]];
          if (move === void 0) {
            throw new Error("Invalid move: " + part);
          }
          if (part.length === 1) {
            power = 0;
          } else {
            if (part[1] === '2') {
              power = 1;
            } else if (part[1] === "'") {
              power = 2;
            } else {
              throw new Error("Invalid move: " + part);
            }
          }
          results.push(move * 3 + power);
        }
        return results;
      } else if (arg.length != null) {
        return arg;
      } else {
        return [arg];
      }
    };

    Cube.prototype.move = function(arg) {
      var face, k, l, len, move, power, ref4, ref5, x;
      ref4 = parseAlg(arg);
      for (k = 0, len = ref4.length; k < len; k++) {
        move = ref4[k];
        face = move / 3 | 0;
        power = move % 3;
        for (x = l = 0, ref5 = power; 0 <= ref5 ? l <= ref5 : l >= ref5; x = 0 <= ref5 ? ++l : --l) {
          this.multiply(Cube.moves[face]);
        }
      }
      return this;
    };

    Cube.prototype.upright = function() {
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
    };

    Cube.inverse = function(arg) {
      var face, k, len, move, power, result, str;
      result = (function() {
        var k, len, ref4, results;
        ref4 = parseAlg(arg);
        results = [];
        for (k = 0, len = ref4.length; k < len; k++) {
          move = ref4[k];
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
    };

    Cube.moves.push(new Cube().move("R M' L'").toJSON());

    Cube.moves.push(new Cube().move("U E' D'").toJSON());

    Cube.moves.push(new Cube().move("F S B'").toJSON());

    Cube.moves.push(new Cube().move("U E'").toJSON());

    Cube.moves.push(new Cube().move("R M'").toJSON());

    Cube.moves.push(new Cube().move("F S").toJSON());

    Cube.moves.push(new Cube().move("D E").toJSON());

    Cube.moves.push(new Cube().move("L M").toJSON());

    Cube.moves.push(new Cube().move("B S'").toJSON());

    return Cube;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Cube;
  } else {
    this.Cube = Cube;
  }

}).call(this);
