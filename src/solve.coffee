Cube = @Cube or require('./cube')

# Centers
[U, R, F, D, L, B] = [0..5]

# Corners
[URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0..7]

# Edges
[UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0..11]


## Helpers

# n choose k, i.e. the binomial coeffiecient
Cnk = (n, k) ->
  return 0 if n < k

  if k > n / 2
    k = n - k

  s = 1
  i = n
  j = 1
  while i isnt n - k
    s *= i
    s /= j
    i--
    j++
  s

# n!
factorial = (n) ->
  f = 1
  for i in [2..n]
    f *= i
  f

# Maximum of two values
max = (a, b) ->
  if a > b then a else b

# Rotate elements between l and r left by one place
rotateLeft = (array, l, r) ->
  tmp = array[l]
  array[i] = array[i + 1] for i in [l..r - 1]
  array[r] = tmp

# Rotate elements between l and r right by one place
rotateRight = (array, l, r) ->
  tmp = array[r]
  array[i] = array[i - 1] for i in [r..l + 1]
  array[l] = tmp


# Generate a function that computes permutation indices.
#
# The permutation index actually encodes two indices: Combination,
# i.e. positions of the cubies start..end (A) and their respective
# permutation (B). The maximum value for B is
#
#   maxB = (end - start + 1)!
#
# and the index is A * maxB + B

permutationIndex = (context, start, end, fromEnd=false) ->
  maxOur = end - start
  maxB = factorial(maxOur + 1)

  if context is 'corners'
    maxAll = 7
    permName = 'cp'
  else
    maxAll = 11
    permName = 'ep'

  our = (0 for i in [0..maxOur])

  (index) ->
    if index?
      # Reset our to [start..end]
      our[i] = i + start for i in [0..maxOur]

      b = index % maxB      # permutation
      a = index / maxB | 0  # combination

      # Invalidate all edges
      perm = @[permName]
      perm[i] = -1 for i in [0..maxAll]

      # Generate permutation from index b
      for j in [1..maxOur]
        k = b % (j + 1)
        b = b / (j + 1) | 0
        # TODO: Implement rotateRightBy(our, 0, j, k)
        while k > 0
          rotateRight(our, 0, j)
          k--

      # Generate combination and set our edges
      x = maxOur
      if fromEnd
        for j in [0..maxAll]
          c = Cnk(maxAll - j, x + 1)
          if a - c >= 0
            perm[j] = our[maxOur - x]
            a -= c
            x--
      else
        for j in [maxAll..0]
          c = Cnk(j, x + 1)
          if a - c >= 0
            perm[j] = our[x]
            a -= c
            x--

      this

    else
      perm = @[permName]
      our[i] = -1 for i in [0..maxOur]
      a = b = x = 0

      # Compute the index a < ((maxAll + 1) choose (maxOur + 1)) and
      # the permutation
      if fromEnd
        for j in [maxAll..0]
          if start <= perm[j] <= end
            a += Cnk(maxAll - j, x + 1)
            our[maxOur - x] = perm[j]
            x++
      else
        for j in [0..maxAll]
          if start <= perm[j] <= end
            a += Cnk(j, x + 1)
            our[x] = perm[j]
            x++

      # Compute the index b < (maxOur + 1)! for the permutation
      for j in [maxOur..0]
        k = 0
        while our[j] isnt start + j
          rotateLeft(our, 0, j)
          k++
        b = (j + 1) * b + k

      a * maxB + b


Include =
  # The twist of the 8 corners, 0 <= twist < 3^7. The orientation of
  # the DRB corner is fully determined by the orientation of the other
  # corners.
  twist: (twist) ->
    if twist?
      parity = 0
      for i in [6..0]
        ori = twist % 3
        twist = (twist / 3) | 0

        @co[i] = ori
        parity += ori

      @co[7] = ((3 - parity % 3) % 3)
      this

    else
      v = 0
      for i in [0..6]
        v = 3 * v + @co[i]
      v

  # The flip of the 12 edges, 0 <= flip < 2^11. The orientation of the
  # BR edge is fully determined by the orientation of the other edges.
  flip: (flip) ->
    if flip?
      parity = 0
      for i in [10..0]
        ori = flip % 2
        flip = flip / 2 | 0

        @eo[i] = ori
        parity += ori

      @eo[11] = ((2 - parity % 2) % 2)
      this

    else
      v = 0
      for i in [0..10]
        v = 2 * v + @eo[i]
      v

  # Parity of the corner permutation
  cornerParity: ->
    s = 0
    for i in [DRB..URF + 1]
      for j in [i - 1..URF]
        s++ if @cp[j] > @cp[i]

    s % 2

  # Parity of the edges permutation. Parity of corners and edges are
  # the same if the cube is solvable.
  edgeParity: ->
    s = 0
    for i in [BR..UR + 1]
      for j in [i - 1..UR]
        s++ if @ep[j] > @ep[i]

    s % 2

  # Permutation of the six corners URF, UFL, ULB, UBR, DFR, DLF
  URFtoDLF: permutationIndex('corners', URF, DLF)

  # Permutation of the three edges UR, UF, UL
  URtoUL: permutationIndex('edges', UR, UL)

  # Permutation of the three edges UB, DR, DF
  UBtoDF: permutationIndex('edges', UB, DF)

  # Permutation of the six edges UR, UF, UL, UB, DR, DF
  URtoDF: permutationIndex('edges', UR, DF)

  # Permutation of the equator slice edges FR, FL, BL and BR
  FRtoBR: permutationIndex('edges', FR, BR, true)


for key, value of Include
  Cube::[key] = value


computeMoveTable = (context, coord, size) ->
  # Loop through all valid values for the coordinate, setting cube's
  # state in each iteration. Then apply each of the 18 moves to the
  # cube, and compute the resulting coordinate.
  apply = if context is 'corners' then 'cornerMultiply' else 'edgeMultiply'

  cube = new Cube

  for i in [0..size-1]
    cube[coord](i)
    inner = []
    for j in [0..5]
      move = Cube.moves[j]
      for k in [0..2]
        cube[apply](move)
        inner.push(cube[coord]())
      # 4th face turn restores the cube
      cube[apply](move)
    inner

# Because we only have the phase 2 URtoDF coordinates, we need to
# merge the URtoUL and UBtoDF coordinates to URtoDF in the beginning
# of phase 2.
mergeURtoDF = do ->
  a = new Cube
  b = new Cube

  (URtoUL, UBtoDF) ->
    # Collisions can be found because unset are set to -1
    a.URtoUL(URtoUL)
    b.UBtoDF(UBtoDF)

    for i in [0..7]
      if a.ep[i] isnt -1
        if b.ep[i] isnt -1
          return -1  # collision
        else
          b.ep[i] = a.ep[i]

    b.URtoDF()

N_TWIST = 2187    # 3^7 corner orientations
N_FLIP = 2048     # 2^11 possible edge flips
N_PARITY = 2      # 2 possible parities

N_FRtoBR = 11880  # 12!/(12-4)! permutations of FR..BR edges
N_SLICE1 = 495    # (12 choose 4) possible positions of FR..BR edges
N_SLICE2 = 24     # 4! permutations of FR..BR edges in phase 2

N_URFtoDLF = 20160  # 8!/(8-6)! permutations of URF..DLF corners

# The URtoDF move table is only computed for phase 2 because the full
# table would have >650000 entries
N_URtoDF = 20160  # 8!/(8-6)! permutation of UR..DF edges in phase 2

N_URtoUL = 1320  # 12!/(12-3)! permutations of UR..UL edges
N_UBtoDF = 1320  # 12!/(12-3)! permutations of UB..DF edges

# The move table for parity is so small that it's included here
Cube.moveTables =
  parity: [
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  ]
  twist: null
  flip: null
  FRtoBR: null
  URFtoDLF: null
  URtoDF: null
  URtoUL: null
  UBtoDF: null
  mergeURtoDF: null

# Other move tables are computed on the fly
moveTableParams =
  # name: [scope, size]
  twist: ['corners', N_TWIST]
  flip: ['edges', N_FLIP]
  FRtoBR: ['edges', N_FRtoBR]
  URFtoDLF: ['corners', N_URFtoDLF]
  URtoDF: ['edges', N_URtoDF]
  URtoUL: ['edges', N_URtoUL]
  UBtoDF: ['edges', N_UBtoDF]
  mergeURtoDF: []  # handled specially

Cube.computeMoveTables = (tables...) ->
  if tables.length is 0
    tables = (name for name of moveTableParams)

  for tableName in tables
    # Already computed
    continue if @moveTables[tableName] isnt null

    if tableName is 'mergeURtoDF'
      @moveTables.mergeURtoDF = do ->
        for URtoUL in [0..335]
          for UBtoDF in [0..335]
            mergeURtoDF(URtoUL, UBtoDF)
    else
      [scope, size] = moveTableParams[tableName]
      @moveTables[tableName] = computeMoveTable(scope, tableName, size)

  this


# Phase 1: All moves are valid
allMoves1 = [0..17]

# The list of next valid phase 1 moves when the given face was turned
# in the last move
nextMoves1 = do ->
  for lastFace in [0..5]
    next = []
    # Don't allow commuting moves, e.g. U U'. Also make sure that
    # opposite faces are always moved in the same order, i.e. allow
    # U D but no D U. This avoids sequences like U D U'.
    for face in [0..5] when face isnt lastFace and face isnt lastFace - 3
      for power in [0..2]  # single, double or inverse move
        next.push(face * 3 + power)
    next

# Phase 2: Double moves of all faces plus quarter moves of U and D
allMoves2 = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16]

nextMoves2 = do ->
  for lastFace in [0..5]
    next = []
    for face in [0..5] when face isnt lastFace and face isnt lastFace - 3
      # Allow all moves of U and D and double moves of others
      powers = if face in [0, 3] then [0..2] else [1]
      for power in powers
        next.push(face * 3 + power)
    next

# 8 values are encoded in one number
pruning = (table, index, value) ->
  pos = index % 8
  slot = index >> 3
  shift = pos << 2

  if value?
    # Set
    table[slot] &= ~(0xF << shift)
    table[slot] |= (value << shift)
    value
  else
    # Get
    (table[slot] & (0xF << shift)) >>> shift

computePruningTable = (phase, size, currentCoords, nextIndex) ->
  # Initialize all values to 0xF
  table = (0xFFFFFFFF for x in [0..Math.ceil(size / 8) - 1])

  if phase is 1
    moves = allMoves1
  else
    moves = allMoves2

  depth = 0
  pruning(table, 0, depth)
  done = 1

  # In each iteration, take each state found in the previous depth and
  # compute the next state. Stop when all states have been assigned a
  # depth.
  while done isnt size
    for index in [0..size - 1] when pruning(table, index) is depth
      current = currentCoords(index)
      for move in moves
        next = nextIndex(current, move)
        if pruning(table, next) is 0xF
          pruning(table, next, depth + 1)
          done++
    depth++

  table

Cube.pruningTables =
  sliceTwist: null
  sliceFlip: null
  sliceURFtoDLFParity: null
  sliceURtoDFParity: null

pruningTableParams =
  # name: [phase, size, currentCoords, nextIndex]
  sliceTwist: [
    1,
    N_SLICE1 * N_TWIST,
    (index) -> [index % N_SLICE1, index / N_SLICE1 | 0],
    (current, move) ->
      [slice, twist] = current
      newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0
      newTwist = Cube.moveTables.twist[twist][move]
      newTwist * N_SLICE1 + newSlice
  ]
  sliceFlip: [
    1
    N_SLICE1 * N_FLIP
    (index) -> [index % N_SLICE1, index / N_SLICE1 | 0],
    (current, move) ->
      [slice, flip] = current
      newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0
      newFlip = Cube.moveTables.flip[flip][move]
      newFlip * N_SLICE1 + newSlice
  ]
  sliceURFtoDLFParity: [
    2,
    N_SLICE2 * N_URFtoDLF * N_PARITY,
    (index) ->
      [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0]
    (current, move) ->
      [parity, slice, URFtoDLF] = current
      newParity = Cube.moveTables.parity[parity][move]
      newSlice = Cube.moveTables.FRtoBR[slice][move]
      newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move]
      (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity
  ]
  sliceURtoDFParity: [
    2,
    N_SLICE2 * N_URtoDF * N_PARITY,
    (index) ->
      [index % 2, (index / 2 | 0) % N_SLICE2, (index / 2 | 0) / N_SLICE2 | 0]
    (current, move) ->
      [parity, slice, URtoDF] = current
      newParity = Cube.moveTables.parity[parity][move]
      newSlice = Cube.moveTables.FRtoBR[slice][move]
      newURtoDF = Cube.moveTables.URtoDF[URtoDF][move]
      (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity
  ]

Cube.computePruningTables = (tables...) ->
  if tables.length is 0
    tables = (name for name of pruningTableParams)

  for tableName in tables
    # Already computed
    continue if @pruningTables[tableName] isnt null

    params = pruningTableParams[tableName]
    @pruningTables[tableName] = computePruningTable(params...)

  this

Cube.initSolver = ->
  Cube.computeMoveTables()
  Cube.computePruningTables()

Cube::solveUpright = (maxDepth=22) ->
  # Names for all moves, i.e. U, U2, U', F, F2, ...
  moveNames = do ->
    faceName = ['U', 'R', 'F', 'D', 'L', 'B']
    powerName = ['', '2', "'"]

    result = []
    for face in [0..5]
      for power in [0..2]
        result.push(faceName[face] + powerName[power])

    result

  class State
    constructor: (cube) ->
      @parent = null
      @lastMove = null
      @depth = 0

      @init(cube) if cube

    init: (cube) ->
      # Phase 1 coordinates
      @flip = cube.flip()
      @twist = cube.twist()
      @slice = cube.FRtoBR() / N_SLICE2 | 0

      # Phase 2 coordinates
      @parity = cube.cornerParity()
      @URFtoDLF = cube.URFtoDLF()
      @FRtoBR = cube.FRtoBR()

      # These are later merged to URtoDF when phase 2 begins
      @URtoUL = cube.URtoUL()
      @UBtoDF = cube.UBtoDF()

      this

    solution: ->
      if @parent
        @parent.solution() + moveNames[@lastMove] + ' '
      else
        ''

    ## Helpers

    move: (table, index, move) ->
      Cube.moveTables[table][index][move]

    pruning: (table, index) ->
      pruning(Cube.pruningTables[table], index)

    ## Phase 1

    # Return the next valid phase 1 moves for this state
    moves1: ->
      if @lastMove isnt null then nextMoves1[@lastMove / 3 | 0] else allMoves1

    # Compute the minimum number of moves to the end of phase 1
    minDist1: ->
      # The maximum number of moves to the end of phase 1 wrt. the
      # combination flip and slice coordinates only
      d1 = @pruning('sliceFlip', N_SLICE1 * @flip + @slice)

      # The combination of twist and slice coordinates
      d2 = @pruning('sliceTwist', N_SLICE1 * @twist + @slice)

      # The true minimal distance is the maximum of these two
      max(d1, d2)

    # Compute the next phase 1 state for the given move
    next1: (move) ->
      next = freeStates.pop()
      next.parent = this
      next.lastMove = move
      next.depth = @depth + 1

      next.flip = @move('flip', @flip, move)
      next.twist = @move('twist', @twist, move)
      next.slice = @move('FRtoBR', @slice * 24, move) / 24 | 0

      next


    ## Phase 2

    # Return the next valid phase 2 moves for this state
    moves2: ->
      if @lastMove isnt null then nextMoves2[@lastMove / 3 | 0] else allMoves2

    # Compute the minimum number of moves to the solved cube
    minDist2: ->
      index1 = (N_SLICE2 * @URtoDF + @FRtoBR) * N_PARITY + @parity
      d1 = @pruning('sliceURtoDFParity', index1)

      index2 = (N_SLICE2 * @URFtoDLF + @FRtoBR) * N_PARITY + @parity
      d2 = @pruning('sliceURFtoDLFParity', index2)

      max(d1, d2)

    # Initialize phase 2 coordinates
    init2: (top=true) ->
      if @parent is null
        # Already assigned for the initial state
        return

      # For other states, the phase 2 state is computed based on
      # parent's state.
      @parent.init2(false)

      @URFtoDLF = @move('URFtoDLF', @parent.URFtoDLF, @lastMove)
      @FRtoBR = @move('FRtoBR', @parent.FRtoBR, @lastMove)
      @parity = @move('parity', @parent.parity, @lastMove)
      @URtoUL = @move('URtoUL', @parent.URtoUL, @lastMove)
      @UBtoDF = @move('UBtoDF', @parent.UBtoDF, @lastMove)

      if top
        # This is the initial phase 2 state. Get the URtoDF coordinate
        # by merging URtoUL and UBtoDF
        @URtoDF = @move('mergeURtoDF', @URtoUL, @UBtoDF)

    # Compute the next phase 2 state for the given move
    next2: (move) ->
      next = freeStates.pop()
      next.parent = this
      next.lastMove = move
      next.depth = @depth + 1

      next.URFtoDLF = @move('URFtoDLF', @URFtoDLF, move)
      next.FRtoBR = @move('FRtoBR', @FRtoBR, move)
      next.parity = @move('parity', @parity, move)
      next.URtoDF = @move('URtoDF', @URtoDF, move)

      next


  solution = null

  phase1search = (state) ->
    depth = 0
    for depth in [1..maxDepth]
      phase1(state, depth)
      break if solution isnt null
      depth++

  phase1 = (state, depth) ->
    if depth is 0
      if state.minDist1() is 0
        # Make sure we don't start phase 2 with a phase 2 move as the
        # last move in phase 1, because phase 2 would then repeat the
        # same move.
        if state.lastMove is null or state.lastMove not in allMoves2
          phase2search(state)

    else if depth > 0
      if state.minDist1() <= depth
        for move in state.moves1()
          next = state.next1(move)
          phase1(next, depth - 1)
          freeStates.push(next)
          break if solution isnt null

  phase2search = (state) ->
    # Initialize phase 2 coordinates
    state.init2()

    for depth in [1..maxDepth - state.depth]
      phase2(state, depth)
      break if solution isnt null
      depth++

  phase2 = (state, depth) ->
    if depth is 0
      if state.minDist2() is 0
        solution = state.solution()
    else if depth > 0
      if state.minDist2() <= depth
        for move in state.moves2()
          next = state.next2(move)
          phase2(next, depth - 1)
          freeStates.push(next)
          break if solution isnt null

  freeStates = (new State for x in [0..maxDepth + 1])
  state = freeStates.pop().init(this)
  phase1search(state)
  freeStates.push(state)

  # Trim the trailing space
  if solution.length > 0
    solution = solution.substring(0, solution.length - 1)

  solution

faceNums =
  U: 0
  R: 1
  F: 2
  D: 3
  L: 4
  B: 5

faceNames =
  0: 'U'
  1: 'R'
  2: 'F'
  3: 'D'
  4: 'L'
  5: 'B'

Cube::solve = (maxDepth=22) ->
  clone = @clone()
  upright = clone.upright()
  clone.move upright
  rotation = new Cube().move(upright).center
  uprightSolution = clone.solveUpright maxDepth
  solution = []
  for move in uprightSolution.split ' '
    solution.push faceNames[rotation[faceNums[move[0]]]]
    if move.length > 1
      solution[solution.length - 1] += move[1]
  solution.join ' '

Cube.scramble = ->
  Cube.inverse(Cube.random().solve())
