(function() {
  var B, BL, BR, Cnk, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, Include, L, N_FLIP, N_FRtoBR, N_PARITY, N_SLICE1, N_SLICE2, N_TWIST, N_UBtoDF, N_URFtoDLF, N_URtoDF, N_URtoUL, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, allMoves1, allMoves2, computeMoveTable, computePruningTable, faceNames, faceNums, factorial, key, max, mergeURtoDF, moveTableParams, nextMoves1, nextMoves2, permutationIndex, pruning, pruningTableParams, ref, ref1, ref2, rotateLeft, rotateRight, value,
    slice1 = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Cube = this.Cube || require('./cube');

  ref = [0, 1, 2, 3, 4, 5], U = ref[0], R = ref[1], F = ref[2], D = ref[3], L = ref[4], B = ref[5];

  ref1 = [0, 1, 2, 3, 4, 5, 6, 7], URF = ref1[0], UFL = ref1[1], ULB = ref1[2], UBR = ref1[3], DFR = ref1[4], DLF = ref1[5], DBL = ref1[6], DRB = ref1[7];

  ref2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], UR = ref2[0], UF = ref2[1], UL = ref2[2], UB = ref2[3], DR = ref2[4], DF = ref2[5], DL = ref2[6], DB = ref2[7], FR = ref2[8], FL = ref2[9], BL = ref2[10], BR = ref2[11];

  Cnk = function(n, k) {
    var i, j, s;
    if (n < k) {
      return 0;
    }
    if (k > n / 2) {
      k = n - k;
    }
    s = 1;
    i = n;
    j = 1;
    while (i !== n - k) {
      s *= i;
      s /= j;
      i--;
      j++;
    }
    return s;
  };

  factorial = function(n) {
    var f, i, m, ref3;
    f = 1;
    for (i = m = 2, ref3 = n; 2 <= ref3 ? m <= ref3 : m >= ref3; i = 2 <= ref3 ? ++m : --m) {
      f *= i;
    }
    return f;
  };

  max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  rotateLeft = function(array, l, r) {
    var i, m, ref3, ref4, tmp;
    tmp = array[l];
    for (i = m = ref3 = l, ref4 = r - 1; ref3 <= ref4 ? m <= ref4 : m >= ref4; i = ref3 <= ref4 ? ++m : --m) {
      array[i] = array[i + 1];
    }
    return array[r] = tmp;
  };

  rotateRight = function(array, l, r) {
    var i, m, ref3, ref4, tmp;
    tmp = array[r];
    for (i = m = ref3 = r, ref4 = l + 1; ref3 <= ref4 ? m <= ref4 : m >= ref4; i = ref3 <= ref4 ? ++m : --m) {
      array[i] = array[i - 1];
    }
    return array[l] = tmp;
  };

  permutationIndex = function(context, start, end, fromEnd) {
    var i, maxAll, maxB, maxOur, our, permName;
    if (fromEnd == null) {
      fromEnd = false;
    }
    maxOur = end - start;
    maxB = factorial(maxOur + 1);
    if (context === 'corners') {
      maxAll = 7;
      permName = 'cp';
    } else {
      maxAll = 11;
      permName = 'ep';
    }
    our = (function() {
      var m, ref3, results;
      results = [];
      for (i = m = 0, ref3 = maxOur; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
        results.push(0);
      }
      return results;
    })();
    return function(index) {
      var a, b, c, j, k, m, o, p, perm, q, ref10, ref11, ref12, ref13, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u, w, x, y, z;
      if (index != null) {
        for (i = m = 0, ref3 = maxOur; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
          our[i] = i + start;
        }
        b = index % maxB;
        a = index / maxB | 0;
        perm = this[permName];
        for (i = o = 0, ref4 = maxAll; 0 <= ref4 ? o <= ref4 : o >= ref4; i = 0 <= ref4 ? ++o : --o) {
          perm[i] = -1;
        }
        for (j = p = 1, ref5 = maxOur; 1 <= ref5 ? p <= ref5 : p >= ref5; j = 1 <= ref5 ? ++p : --p) {
          k = b % (j + 1);
          b = b / (j + 1) | 0;
          while (k > 0) {
            rotateRight(our, 0, j);
            k--;
          }
        }
        x = maxOur;
        if (fromEnd) {
          for (j = q = 0, ref6 = maxAll; 0 <= ref6 ? q <= ref6 : q >= ref6; j = 0 <= ref6 ? ++q : --q) {
            c = Cnk(maxAll - j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[maxOur - x];
              a -= c;
              x--;
            }
          }
        } else {
          for (j = t = ref7 = maxAll; ref7 <= 0 ? t <= 0 : t >= 0; j = ref7 <= 0 ? ++t : --t) {
            c = Cnk(j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[x];
              a -= c;
              x--;
            }
          }
        }
        return this;
      } else {
        perm = this[permName];
        for (i = u = 0, ref8 = maxOur; 0 <= ref8 ? u <= ref8 : u >= ref8; i = 0 <= ref8 ? ++u : --u) {
          our[i] = -1;
        }
        a = b = x = 0;
        if (fromEnd) {
          for (j = w = ref9 = maxAll; ref9 <= 0 ? w <= 0 : w >= 0; j = ref9 <= 0 ? ++w : --w) {
            if ((start <= (ref10 = perm[j]) && ref10 <= end)) {
              a += Cnk(maxAll - j, x + 1);
              our[maxOur - x] = perm[j];
              x++;
            }
          }
        } else {
          for (j = y = 0, ref11 = maxAll; 0 <= ref11 ? y <= ref11 : y >= ref11; j = 0 <= ref11 ? ++y : --y) {
            if ((start <= (ref12 = perm[j]) && ref12 <= end)) {
              a += Cnk(j, x + 1);
              our[x] = perm[j];
              x++;
            }
          }
        }
        for (j = z = ref13 = maxOur; ref13 <= 0 ? z <= 0 : z >= 0; j = ref13 <= 0 ? ++z : --z) {
          k = 0;
          while (our[j] !== start + j) {
            rotateLeft(our, 0, j);
            k++;
          }
          b = (j + 1) * b + k;
        }
        return a * maxB + b;
      }
    };
  };

  Include = {
    twist: function(twist) {
      var i, m, o, ori, parity, v;
      if (twist != null) {
        parity = 0;
        for (i = m = 6; m >= 0; i = --m) {
          ori = twist % 3;
          twist = (twist / 3) | 0;
          this.co[i] = ori;
          parity += ori;
        }
        this.co[7] = (3 - parity % 3) % 3;
        return this;
      } else {
        v = 0;
        for (i = o = 0; o <= 6; i = ++o) {
          v = 3 * v + this.co[i];
        }
        return v;
      }
    },
    flip: function(flip) {
      var i, m, o, ori, parity, v;
      if (flip != null) {
        parity = 0;
        for (i = m = 10; m >= 0; i = --m) {
          ori = flip % 2;
          flip = flip / 2 | 0;
          this.eo[i] = ori;
          parity += ori;
        }
        this.eo[11] = (2 - parity % 2) % 2;
        return this;
      } else {
        v = 0;
        for (i = o = 0; o <= 10; i = ++o) {
          v = 2 * v + this.eo[i];
        }
        return v;
      }
    },
    cornerParity: function() {
      var i, j, m, o, ref3, ref4, ref5, ref6, s;
      s = 0;
      for (i = m = ref3 = DRB, ref4 = URF + 1; ref3 <= ref4 ? m <= ref4 : m >= ref4; i = ref3 <= ref4 ? ++m : --m) {
        for (j = o = ref5 = i - 1, ref6 = URF; ref5 <= ref6 ? o <= ref6 : o >= ref6; j = ref5 <= ref6 ? ++o : --o) {
          if (this.cp[j] > this.cp[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    edgeParity: function() {
      var i, j, m, o, ref3, ref4, ref5, ref6, s;
      s = 0;
      for (i = m = ref3 = BR, ref4 = UR + 1; ref3 <= ref4 ? m <= ref4 : m >= ref4; i = ref3 <= ref4 ? ++m : --m) {
        for (j = o = ref5 = i - 1, ref6 = UR; ref5 <= ref6 ? o <= ref6 : o >= ref6; j = ref5 <= ref6 ? ++o : --o) {
          if (this.ep[j] > this.ep[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    URFtoDLF: permutationIndex('corners', URF, DLF),
    URtoUL: permutationIndex('edges', UR, UL),
    UBtoDF: permutationIndex('edges', UB, DF),
    URtoDF: permutationIndex('edges', UR, DF),
    FRtoBR: permutationIndex('edges', FR, BR, true)
  };

  for (key in Include) {
    value = Include[key];
    Cube.prototype[key] = value;
  }

  computeMoveTable = function(context, coord, size) {
    var apply, cube, i, inner, j, k, m, move, o, p, ref3, results;
    apply = context === 'corners' ? 'cornerMultiply' : 'edgeMultiply';
    cube = new Cube;
    results = [];
    for (i = m = 0, ref3 = size - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
      cube[coord](i);
      inner = [];
      for (j = o = 0; o <= 5; j = ++o) {
        move = Cube.moves[j];
        for (k = p = 0; p <= 2; k = ++p) {
          cube[apply](move);
          inner.push(cube[coord]());
        }
        cube[apply](move);
      }
      results.push(inner);
    }
    return results;
  };

  mergeURtoDF = (function() {
    var a, b;
    a = new Cube;
    b = new Cube;
    return function(URtoUL, UBtoDF) {
      var i, m;
      a.URtoUL(URtoUL);
      b.UBtoDF(UBtoDF);
      for (i = m = 0; m <= 7; i = ++m) {
        if (a.ep[i] !== -1) {
          if (b.ep[i] !== -1) {
            return -1;
          } else {
            b.ep[i] = a.ep[i];
          }
        }
      }
      return b.URtoDF();
    };
  })();

  N_TWIST = 2187;

  N_FLIP = 2048;

  N_PARITY = 2;

  N_FRtoBR = 11880;

  N_SLICE1 = 495;

  N_SLICE2 = 24;

  N_URFtoDLF = 20160;

  N_URtoDF = 20160;

  N_URtoUL = 1320;

  N_UBtoDF = 1320;

  Cube.moveTables = {
    parity: [[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]],
    twist: null,
    flip: null,
    FRtoBR: null,
    URFtoDLF: null,
    URtoDF: null,
    URtoUL: null,
    UBtoDF: null,
    mergeURtoDF: null
  };

  moveTableParams = {
    twist: ['corners', N_TWIST],
    flip: ['edges', N_FLIP],
    FRtoBR: ['edges', N_FRtoBR],
    URFtoDLF: ['corners', N_URFtoDLF],
    URtoDF: ['edges', N_URtoDF],
    URtoUL: ['edges', N_URtoUL],
    UBtoDF: ['edges', N_UBtoDF],
    mergeURtoDF: []
  };

  Cube.computeMoveTables = function() {
    var len, m, name, ref3, scope, size, tableName, tables;
    tables = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in moveTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (m = 0, len = tables.length; m < len; m++) {
      tableName = tables[m];
      if (this.moveTables[tableName] !== null) {
        continue;
      }
      if (tableName === 'mergeURtoDF') {
        this.moveTables.mergeURtoDF = (function() {
          var UBtoDF, URtoUL, o, results;
          results = [];
          for (URtoUL = o = 0; o <= 335; URtoUL = ++o) {
            results.push((function() {
              var p, results1;
              results1 = [];
              for (UBtoDF = p = 0; p <= 335; UBtoDF = ++p) {
                results1.push(mergeURtoDF(URtoUL, UBtoDF));
              }
              return results1;
            })());
          }
          return results;
        })();
      } else {
        ref3 = moveTableParams[tableName], scope = ref3[0], size = ref3[1];
        this.moveTables[tableName] = computeMoveTable(scope, tableName, size);
      }
    }
    return this;
  };

  allMoves1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  nextMoves1 = (function() {
    var face, lastFace, m, next, o, p, power, results;
    results = [];
    for (lastFace = m = 0; m <= 5; lastFace = ++m) {
      next = [];
      for (face = o = 0; o <= 5; face = ++o) {
        if (face !== lastFace && face !== lastFace - 3) {
          for (power = p = 0; p <= 2; power = ++p) {
            next.push(face * 3 + power);
          }
        }
      }
      results.push(next);
    }
    return results;
  })();

  allMoves2 = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];

  nextMoves2 = (function() {
    var face, lastFace, len, m, next, o, p, power, powers, results;
    results = [];
    for (lastFace = m = 0; m <= 5; lastFace = ++m) {
      next = [];
      for (face = o = 0; o <= 5; face = ++o) {
        if (!(face !== lastFace && face !== lastFace - 3)) {
          continue;
        }
        powers = face === 0 || face === 3 ? [0, 1, 2] : [1];
        for (p = 0, len = powers.length; p < len; p++) {
          power = powers[p];
          next.push(face * 3 + power);
        }
      }
      results.push(next);
    }
    return results;
  })();

  pruning = function(table, index, value) {
    var pos, shift, slot;
    pos = index % 8;
    slot = index >> 3;
    shift = pos << 2;
    if (value != null) {
      table[slot] &= ~(0xF << shift);
      table[slot] |= value << shift;
      return value;
    } else {
      return (table[slot] & (0xF << shift)) >>> shift;
    }
  };

  computePruningTable = function(phase, size, currentCoords, nextIndex) {
    var current, depth, done, index, len, m, move, moves, next, o, ref3, table, x;
    table = (function() {
      var m, ref3, results;
      results = [];
      for (x = m = 0, ref3 = Math.ceil(size / 8) - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; x = 0 <= ref3 ? ++m : --m) {
        results.push(0xFFFFFFFF);
      }
      return results;
    })();
    if (phase === 1) {
      moves = allMoves1;
    } else {
      moves = allMoves2;
    }
    depth = 0;
    pruning(table, 0, depth);
    done = 1;
    while (done !== size) {
      for (index = m = 0, ref3 = size - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; index = 0 <= ref3 ? ++m : --m) {
        if (!(pruning(table, index) === depth)) {
          continue;
        }
        current = currentCoords(index);
        for (o = 0, len = moves.length; o < len; o++) {
          move = moves[o];
          next = nextIndex(current, move);
          if (pruning(table, next) === 0xF) {
            pruning(table, next, depth + 1);
            done++;
          }
        }
      }
      depth++;
    }
    return table;
  };

  Cube.pruningTables = {
    sliceTwist: null,
    sliceFlip: null,
    sliceURFtoDLFParity: null,
    sliceURtoDFParity: null
  };

  pruningTableParams = {
    sliceTwist: [
      1, N_SLICE1 * N_TWIST, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var newSlice, newTwist, slice, twist;
        slice = current[0], twist = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newTwist = Cube.moveTables.twist[twist][move];
        return newTwist * N_SLICE1 + newSlice;
      }
    ],
    sliceFlip: [
      1, N_SLICE1 * N_FLIP, function(index) {
        return [index % N_SLICE1, index / N_SLICE1 | 0];
      }, function(current, move) {
        var flip, newFlip, newSlice, slice;
        slice = current[0], flip = current[1];
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newFlip = Cube.moveTables.flip[flip][move];
        return newFlip * N_SLICE1 + newSlice;
      }
    ],
    sliceURFtoDLFParity: [
      2, N_SLICE2 * N_URFtoDLF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URFtoDLF, newParity, newSlice, newURFtoDLF, parity, slice;
        parity = current[0], slice = current[1], URFtoDLF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move];
        return (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ],
    sliceURtoDFParity: [
      2, N_SLICE2 * N_URtoDF * N_PARITY, function(index) {
        return [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0];
      }, function(current, move) {
        var URtoDF, newParity, newSlice, newURtoDF, parity, slice;
        parity = current[0], slice = current[1], URtoDF = current[2];
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURtoDF = Cube.moveTables.URtoDF[URtoDF][move];
        return (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ]
  };

  Cube.computePruningTables = function() {
    var len, m, name, params, tableName, tables;
    tables = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in pruningTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (m = 0, len = tables.length; m < len; m++) {
      tableName = tables[m];
      if (this.pruningTables[tableName] !== null) {
        continue;
      }
      params = pruningTableParams[tableName];
      this.pruningTables[tableName] = computePruningTable.apply(null, params);
    }
    return this;
  };

  Cube.initSolver = function() {
    Cube.computeMoveTables();
    return Cube.computePruningTables();
  };

  Cube.prototype.solveUpright = function(maxDepth) {
    var State, freeStates, moveNames, phase1, phase1search, phase2, phase2search, solution, state, x;
    if (maxDepth == null) {
      maxDepth = 22;
    }
    moveNames = (function() {
      var face, faceName, m, o, power, powerName, result;
      faceName = ['U', 'R', 'F', 'D', 'L', 'B'];
      powerName = ['', '2', "'"];
      result = [];
      for (face = m = 0; m <= 5; face = ++m) {
        for (power = o = 0; o <= 2; power = ++o) {
          result.push(faceName[face] + powerName[power]);
        }
      }
      return result;
    })();
    State = (function() {
      function State(cube) {
        this.parent = null;
        this.lastMove = null;
        this.depth = 0;
        if (cube) {
          this.init(cube);
        }
      }

      State.prototype.init = function(cube) {
        this.flip = cube.flip();
        this.twist = cube.twist();
        this.slice = cube.FRtoBR() / N_SLICE2 | 0;
        this.parity = cube.cornerParity();
        this.URFtoDLF = cube.URFtoDLF();
        this.FRtoBR = cube.FRtoBR();
        this.URtoUL = cube.URtoUL();
        this.UBtoDF = cube.UBtoDF();
        return this;
      };

      State.prototype.solution = function() {
        if (this.parent) {
          return this.parent.solution() + moveNames[this.lastMove] + ' ';
        } else {
          return '';
        }
      };

      State.prototype.move = function(table, index, move) {
        return Cube.moveTables[table][index][move];
      };

      State.prototype.pruning = function(table, index) {
        return pruning(Cube.pruningTables[table], index);
      };

      State.prototype.moves1 = function() {
        if (this.lastMove !== null) {
          return nextMoves1[this.lastMove / 3 | 0];
        } else {
          return allMoves1;
        }
      };

      State.prototype.minDist1 = function() {
        var d1, d2;
        d1 = this.pruning('sliceFlip', N_SLICE1 * this.flip + this.slice);
        d2 = this.pruning('sliceTwist', N_SLICE1 * this.twist + this.slice);
        return max(d1, d2);
      };

      State.prototype.next1 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.flip = this.move('flip', this.flip, move);
        next.twist = this.move('twist', this.twist, move);
        next.slice = this.move('FRtoBR', this.slice * 24, move) / 24 | 0;
        return next;
      };

      State.prototype.moves2 = function() {
        if (this.lastMove !== null) {
          return nextMoves2[this.lastMove / 3 | 0];
        } else {
          return allMoves2;
        }
      };

      State.prototype.minDist2 = function() {
        var d1, d2, index1, index2;
        index1 = (N_SLICE2 * this.URtoDF + this.FRtoBR) * N_PARITY + this.parity;
        d1 = this.pruning('sliceURtoDFParity', index1);
        index2 = (N_SLICE2 * this.URFtoDLF + this.FRtoBR) * N_PARITY + this.parity;
        d2 = this.pruning('sliceURFtoDLFParity', index2);
        return max(d1, d2);
      };

      State.prototype.init2 = function(top) {
        if (top == null) {
          top = true;
        }
        if (this.parent === null) {
          return;
        }
        this.parent.init2(false);
        this.URFtoDLF = this.move('URFtoDLF', this.parent.URFtoDLF, this.lastMove);
        this.FRtoBR = this.move('FRtoBR', this.parent.FRtoBR, this.lastMove);
        this.parity = this.move('parity', this.parent.parity, this.lastMove);
        this.URtoUL = this.move('URtoUL', this.parent.URtoUL, this.lastMove);
        this.UBtoDF = this.move('UBtoDF', this.parent.UBtoDF, this.lastMove);
        if (top) {
          return this.URtoDF = this.move('mergeURtoDF', this.URtoUL, this.UBtoDF);
        }
      };

      State.prototype.next2 = function(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.URFtoDLF = this.move('URFtoDLF', this.URFtoDLF, move);
        next.FRtoBR = this.move('FRtoBR', this.FRtoBR, move);
        next.parity = this.move('parity', this.parity, move);
        next.URtoDF = this.move('URtoDF', this.URtoDF, move);
        return next;
      };

      return State;

    })();
    solution = null;
    phase1search = function(state) {
      var depth, m, ref3, results;
      depth = 0;
      results = [];
      for (depth = m = 1, ref3 = maxDepth; 1 <= ref3 ? m <= ref3 : m >= ref3; depth = 1 <= ref3 ? ++m : --m) {
        phase1(state, depth);
        if (solution !== null) {
          break;
        }
        results.push(depth++);
      }
      return results;
    };
    phase1 = function(state, depth) {
      var len, m, move, next, ref3, ref4, results;
      if (depth === 0) {
        if (state.minDist1() === 0) {
          if (state.lastMove === null || (ref3 = state.lastMove, indexOf.call(allMoves2, ref3) < 0)) {
            return phase2search(state);
          }
        }
      } else if (depth > 0) {
        if (state.minDist1() <= depth) {
          ref4 = state.moves1();
          results = [];
          for (m = 0, len = ref4.length; m < len; m++) {
            move = ref4[m];
            next = state.next1(move);
            phase1(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    phase2search = function(state) {
      var depth, m, ref3, results;
      state.init2();
      results = [];
      for (depth = m = 1, ref3 = maxDepth - state.depth; 1 <= ref3 ? m <= ref3 : m >= ref3; depth = 1 <= ref3 ? ++m : --m) {
        phase2(state, depth);
        if (solution !== null) {
          break;
        }
        results.push(depth++);
      }
      return results;
    };
    phase2 = function(state, depth) {
      var len, m, move, next, ref3, results;
      if (depth === 0) {
        if (state.minDist2() === 0) {
          return solution = state.solution();
        }
      } else if (depth > 0) {
        if (state.minDist2() <= depth) {
          ref3 = state.moves2();
          results = [];
          for (m = 0, len = ref3.length; m < len; m++) {
            move = ref3[m];
            next = state.next2(move);
            phase2(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    freeStates = (function() {
      var m, ref3, results;
      results = [];
      for (x = m = 0, ref3 = maxDepth + 1; 0 <= ref3 ? m <= ref3 : m >= ref3; x = 0 <= ref3 ? ++m : --m) {
        results.push(new State);
      }
      return results;
    })();
    state = freeStates.pop().init(this);
    phase1search(state);
    freeStates.push(state);
    if (solution.length > 0) {
      solution = solution.substring(0, solution.length - 1);
    }
    return solution;
  };

  faceNums = {
    U: 0,
    R: 1,
    F: 2,
    D: 3,
    L: 4,
    B: 5
  };

  faceNames = {
    0: 'U',
    1: 'R',
    2: 'F',
    3: 'D',
    4: 'L',
    5: 'B'
  };

  Cube.prototype.solve = function(maxDepth) {
    var clone, len, m, move, ref3, rotation, solution, upright, uprightSolution;
    if (maxDepth == null) {
      maxDepth = 22;
    }
    clone = this.clone();
    upright = clone.upright();
    clone.move(upright);
    rotation = new Cube().move(upright).center;
    uprightSolution = clone.solveUpright(maxDepth);
    solution = [];
    ref3 = uprightSolution.split(' ');
    for (m = 0, len = ref3.length; m < len; m++) {
      move = ref3[m];
      solution.push(faceNames[rotation[faceNums[move[0]]]]);
      if (move.length > 1) {
        solution[solution.length - 1] += move[1];
      }
    }
    return solution.join(' ');
  };

  Cube.scramble = function() {
    return Cube.inverse(Cube.random().solve());
  };

}).call(this);
