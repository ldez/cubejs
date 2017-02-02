# Corners
[URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0..7]

# Edges
[UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0..11]

[cornerFacelet, edgeFacelet] = do ->
  U = (x) -> x - 1
  R = (x) -> U(9) + x
  F = (x) -> R(9) + x
  D = (x) -> F(9) + x
  L = (x) -> D(9) + x
  B = (x) -> L(9) + x
  [
    # Corners
    [
      [U(9), R(1), F(3)], [U(7), F(1), L(3)],
      [U(1), L(1), B(3)], [U(3), B(1), R(3)],
      [D(3), F(9), R(7)], [D(1), L(9), F(7)],
      [D(7), B(9), L(7)], [D(9), R(9), B(7)],
    ],
    # Edges
    [
      [U(6), R(2)], [U(8), F(2)], [U(4), L(2)], [U(2), B(2)],
      [D(6), R(8)], [D(2), F(8)], [D(4), L(8)], [D(8), B(8)],
      [F(6), R(4)], [F(4), L(6)], [B(6), L(4)], [B(4), R(6)],
    ],
  ]

cornerColor = [
  ['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'],
  ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B'],
]

edgeColor = [
  ['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'],
  ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R'],
]

class Cube
  constructor: (other) ->
    if other?
      @init other
    else
      @identity()

    # For moves to avoid allocating new objects each time
    @newCp = (0 for x in [0..7])
    @newEp = (0 for x in [0..11])
    @newCo = (0 for x in [0..7])
    @newEo = (0 for x in [0..11])

  init: (state) ->
    @co = state.co.slice 0
    @ep = state.ep.slice 0
    @cp = state.cp.slice 0
    @eo = state.eo.slice 0

  identity: ->
    # Initialize to the identity cube
    @cp = [0..7]
    @co = (0 for x in [0..7])
    @ep = [0..11]
    @eo = (0 for x in [0..11])

  toJSON: ->
    cp: @cp
    co: @co
    ep: @ep
    eo: @eo

  asString: ->
    result = []

    # Initialize centers
    for [i, c] in [[4, 'U'], [13, 'R'], [22, 'F'], [31, 'D'], [40, 'L'], [49, 'B']]
      result[i] = c

    for i in [0..7]
      corner = @cp[i]
      ori = @co[i]
      for n in [0..2]
        result[cornerFacelet[i][(n + ori) % 3]] = cornerColor[corner][n]

    for i in [0..11]
      edge = @ep[i]
      ori = @eo[i]
      for n in [0..1]
        result[edgeFacelet[i][(n + ori) % 2]] = edgeColor[edge][n]

    result.join('')

  @fromString: (str) ->
    cube = new Cube

    for i in [0..7]
      for ori in [0..2]
        break if str[cornerFacelet[i][ori]] in ['U', 'D']
      col1 = str[cornerFacelet[i][(ori + 1) % 3]]
      col2 = str[cornerFacelet[i][(ori + 2) % 3]]

      for j in [0..7]
        if col1 is cornerColor[j][1] and col2 is cornerColor[j][2]
          cube.cp[i] = j
          cube.co[i] = ori % 3

    for i in [0..11]
      for j in [0..11]
        if (str[edgeFacelet[i][0]] is edgeColor[j][0] and
            str[edgeFacelet[i][1]] is edgeColor[j][1])
          cube.ep[i] = j
          cube.eo[i] = 0
          break
        if (str[edgeFacelet[i][0]] is edgeColor[j][1] and
            str[edgeFacelet[i][1]] is edgeColor[j][0])
          cube.ep[i] = j
          cube.eo[i] = 1
          break

    cube

  clone: ->
    new Cube @toJSON()

  randomize: do ->
    randint = (min, max) ->
      min + (Math.random() * (max - min + 1) | 0)

    mixPerm = (arr) ->
      max = arr.length - 1
      for i in [0..max - 2]
        r = randint(i, max)

        # Ensure an even number of swaps
        if i isnt r
          [arr[i], arr[r]] = [arr[r], arr[i]]
          [arr[max], arr[max - 1]] = [arr[max - 1], arr[max]]

    randOri = (arr, max) ->
      ori = 0
      for i in [0..arr.length - 2]
        ori += (arr[i] = randint(0, max - 1))

      # Set the orientation of the last cubie so that the cube is
      # valid
      arr[arr.length - 1] = (max - ori % max) % max

    result = ->
      mixPerm(@cp)
      mixPerm(@ep)
      randOri(@co, 3)
      randOri(@eo, 2)
      this

    result

  # A class method returning a new random cube
  @random: ->
    new Cube().randomize()

  isSolved: ->
    for c in [0..7]
      return false if @cp[c] isnt c
      return false if @co[c] isnt 0

    for e in [0..11]
      return false if @ep[e] isnt e
      return false if @eo[e] isnt 0

    true

  # Multiply this Cube with another Cube, restricted to corners.
  cornerMultiply: (other) ->
    for to in [0..7]
      from = other.cp[to]
      @newCp[to] = @cp[from]
      @newCo[to] = (@co[from] + other.co[to]) % 3

    [@cp, @newCp] = [@newCp, @cp]
    [@co, @newCo] = [@newCo, @co]
    this

  # Multiply this Cube with another Cube, restricted to edges
  edgeMultiply: (other) ->
    for to in [0..11]
      from = other.ep[to]
      @newEp[to] = @ep[from]
      @newEo[to] = (@eo[from] + other.eo[to]) % 2

    [@ep, @newEp] = [@newEp, @ep]
    [@eo, @newEo] = [@newEo, @eo]
    this

  # Multiply this cube with another Cube
  multiply: (other) ->
    @cornerMultiply(other)
    @edgeMultiply(other)
    this

  @moves: [
    # U
    {
      cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # R
    {
      cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR]
      co: [2, 0, 0, 1, 1, 0, 0, 2]
      ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # F
    {
      cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB]
      co: [1, 2, 0, 0, 2, 1, 0, 0]
      ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR]
      eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]
    }

    # D
    {
      cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # L
    {
      cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB]
      co: [0, 1, 2, 0, 0, 2, 1, 0]
      ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # B
    {
      cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL]
      co: [0, 0, 1, 2, 0, 0, 2, 1]
      ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB]
      eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]
    }
  ]

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

  parseAlg = (arg) ->
    if typeof arg is 'string'
      # String
      for part in arg.split(/\s+/)
        if part.length is 0
          # First and last can be empty
          continue

        if part.length > 2
          throw new Error "Invalid move: #{part}"

        move = faceNums[part[0]]
        if move is undefined
          throw new Error "Invalid move: #{part}"

        if part.length is 1
          power = 0
        else
          if part[1] is '2'
            power = 1
          else if part[1] is "'"
            power = 2
          else
            throw new Error "Invalid move: #{part}"

        move * 3 + power

    else if arg.length?
      # Already an array
      arg

    else
      # A single move
      [arg]

  move: (arg) ->
    for move in parseAlg(arg)
      face = move / 3 | 0
      power = move % 3
      @multiply(Cube.moves[face]) for x in [0..power]

    this

  @inverse: (arg) ->
    result = for move in parseAlg(arg)
      face = move / 3 | 0
      power = move % 3
      face * 3 + -(power - 1) + 1

    result.reverse()

    if typeof arg is 'string'
      str = ''
      for move in result
        face = move / 3 | 0
        power = move % 3
        str += faceNames[face]
        if power is 1
          str += '2'
        else if power is 2
          str += "'"
        str += ' '
      str.substring(0, str.length - 1)

    else if arg.length?
      result

    else
      result[0]


## Globals

if module?
  module.exports = Cube
else
  @Cube = Cube
