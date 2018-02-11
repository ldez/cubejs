# Centers
[U, R, F, D, L, B] = [0..5]

# Corners
[URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0..7]

# Edges
[UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0..11]

[centerFacelet, cornerFacelet, edgeFacelet] = do ->
  _U = (x) -> x - 1
  _R = (x) -> _U(9) + x
  _F = (x) -> _R(9) + x
  _D = (x) -> _F(9) + x
  _L = (x) -> _D(9) + x
  _B = (x) -> _L(9) + x
  [
    # Centers
    [4, 13, 22, 31, 40, 49],
    # Corners
    [
      [_U(9), _R(1), _F(3)], [_U(7), _F(1), _L(3)],
      [_U(1), _L(1), _B(3)], [_U(3), _B(1), _R(3)],
      [_D(3), _F(9), _R(7)], [_D(1), _L(9), _F(7)],
      [_D(7), _B(9), _L(7)], [_D(9), _R(9), _B(7)],
    ],
    # Edges
    [
      [_U(6), _R(2)], [_U(8), _F(2)], [_U(4), _L(2)], [_U(2), _B(2)],
      [_D(6), _R(8)], [_D(2), _F(8)], [_D(4), _L(8)], [_D(8), _B(8)],
      [_F(6), _R(4)], [_F(4), _L(6)], [_B(6), _L(4)], [_B(4), _R(6)],
    ],
  ]

centerColor = ['U', 'R', 'F', 'D', 'L', 'B']

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
    @newCenter = (0 for x in [0..5])
    @newCp = (0 for x in [0..7])
    @newEp = (0 for x in [0..11])
    @newCo = (0 for x in [0..7])
    @newEo = (0 for x in [0..11])

  init: (state) ->
    @center = state.center.slice 0
    @co = state.co.slice 0
    @ep = state.ep.slice 0
    @cp = state.cp.slice 0
    @eo = state.eo.slice 0

  identity: ->
    # Initialize to the identity cube
    @center = [0..5]
    @cp = [0..7]
    @co = (0 for x in [0..7])
    @ep = [0..11]
    @eo = (0 for x in [0..11])

  toJSON: ->
    center: @center
    cp: @cp
    co: @co
    ep: @ep
    eo: @eo

  asString: ->
    result = []

    for i in [0..5]
      result[9 * i + 4] = centerColor[@center[i]]

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

    for i in [0..5]
      for j in [0..5]
        if str[9 * i + 4] is centerColor[j]
          cube.center[i] = j

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
    clone = @clone()
    clone.move clone.upright()

    for cent in [0..5]
      return false if clone.center[cent] isnt cent

    for c in [0..7]
      return false if clone.cp[c] isnt c
      return false if clone.co[c] isnt 0

    for e in [0..11]
      return false if clone.ep[e] isnt e
      return false if clone.eo[e] isnt 0

    true

  # Multiply this Cube with another Cube, restricted to centers.
  centerMultiply: (other) ->
    for to in [0..5]
      from = other.center[to]
      @newCenter[to] = @center[from]
    
    [@center, @newCenter] = [@newCenter, @center]
    this

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
    @centerMultiply(other)
    @cornerMultiply(other)
    @edgeMultiply(other)
    this

  @moves: [
    # U
    {
      center: [0..5]
      cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # R
    {
      center: [0..5]
      cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR]
      co: [2, 0, 0, 1, 1, 0, 0, 2]
      ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # F
    {
      center: [0..5]
      cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB]
      co: [1, 2, 0, 0, 2, 1, 0, 0]
      ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR]
      eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]
    }

    # D
    {
      center: [0..5]
      cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # L
    {
      center: [0..5]
      cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB]
      co: [0, 1, 2, 0, 0, 2, 1, 0]
      ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    # B
    {
      center: [0..5]
      cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL]
      co: [0, 0, 1, 2, 0, 0, 2, 1]
      ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB]
      eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]
    }

    # E
    {
      center: [U, F, L, D, B, R]
      cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UR, UF, UL, UB, DR, DF, DL, DB, FL, BL, BR, FR]
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
    }

    # M
    {
      center: [B, R, U, F, L, D]
      cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UR, UB, UL, DB, DR, UF, DL, DF, FR, FL, BL, BR]
      eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
    }

    # S
    {
      center: [L, U, F, R, D, B]
      cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB]
      co: [0, 0, 0, 0, 0, 0, 0, 0]
      ep: [UL, UF, DL, UB, UR, DF, DR, DB, FR, FL, BL, BR]
      eo: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
    }
  ]

  faceNums =
    U: 0
    R: 1
    F: 2
    D: 3
    L: 4
    B: 5
    E: 6
    M: 7
    S: 8
    x: 9
    y: 10
    z: 11
    u: 12
    r: 13
    f: 14
    d: 15
    l: 16
    b: 17

  faceNames =
    0: 'U'
    1: 'R'
    2: 'F'
    3: 'D'
    4: 'L'
    5: 'B'
    6: 'E'
    7: 'M'
    8: 'S'
    9: 'x'
    10: 'y'
    11: 'z'
    12: 'u'
    13: 'r'
    14: 'f'
    15: 'd'
    16: 'l'
    17: 'b'

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

  upright: ->
    clone = @clone()
    result = []
    for i in [0..5]
      break if clone.center[i] is F
    switch i
      when D then result.push "x"
      when U then result.push "x'"
      when B then result.push "x2"
      when R then result.push "y"
      when L then result.push "y'"
    if result.length then clone.move result[0]
    for j in [0..5]
      break if clone.center[j] is U
    switch j
      when L then result.push "z"
      when R then result.push "z'"
      when D then result.push "z2"
    result.join ' '

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

  # x
  Cube.moves.push new Cube().move("R M' L'").toJSON()

  # y
  Cube.moves.push new Cube().move("U E' D'").toJSON()

  # z
  Cube.moves.push new Cube().move("F S B'").toJSON()

  # u
  Cube.moves.push new Cube().move("U E'").toJSON()

  # r
  Cube.moves.push new Cube().move("R M'").toJSON()

  # f
  Cube.moves.push new Cube().move("F S").toJSON()

  # d
  Cube.moves.push new Cube().move("D E").toJSON()

  # l
  Cube.moves.push new Cube().move("L M").toJSON()

  # b
  Cube.moves.push new Cube().move("B S'").toJSON()

## Globals

if module?
  module.exports = Cube
else
  @Cube = Cube
