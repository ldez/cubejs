describe 'Cube', ->

  it 'should serialize a cube to string for a default cube', ->
    cube = new Cube
    expect(cube.asString()).toBe 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

  it 'should initiate a cube when provide a String', ->
    cube = Cube.fromString 'UUUUUUUUUR...F...D...L...B...'
    expect(cube.asString()).toBe 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

  it 'should serialize a cube to JSON for a default cube', ->
    cube = new Cube

    expectedJSON =
      cp: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
      co: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
      ep: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
      eo: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

    expect(cube.toJSON()).toEqual expectedJSON

  it 'should rotate U face when move U', ->
    cube = new Cube
    cube.move 'U'
    expect(cube.asString()).toBe 'UUUUUUUUUBBBRRRRRRRRRFFFFFFDDDDDDDDDFFFLLLLLLLLLBBBBBB'

  it 'should rotate cuve face when apply a moves sequence', ->
    cube = new Cube
    cube.move "U R F' L'"
    expect(cube.asString()).toBe 'DURRUFRRRBRBDRBDRBFDDDFFDFFBLLBDBLDLFUUFLLFLLULRUBUUBU'

  it 'should resets the cube to the identity cube', ->
    cube = new Cube
    cube.move "U R F' L'"
    cube.identity()
    expect(cube.asString()).toBe 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

  it 'should return true when the cube is solved (default cube)', ->
    cube = new Cube
    expect(cube.isSolved()).toBe true

  it 'should return false when the cube is not solved (random cube)', ->
    cube = Cube.random()
    expect(cube.isSolved()).toBe false

  it 'should return inverse moves', ->
    moves = Cube.inverse "F B' R"
    expect(moves).toBe "R' B F'"
