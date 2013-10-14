importScripts('cube.js', 'solve.js')

initialized = false

init = ->
  return if initialized
  Cube.initSolver()
  initialized = true


solve = (args) ->
  return unless initialized

  if args.scramble
    cube = new Cube
    cube.move(args.scramble)
  else if args.cube
    cube = new Cube(args.cube)

  cube.solve()


self.onmessage = (event) ->
  args = event.data

  switch args.cmd
    when 'init'
      init()
      self.postMessage(cmd: 'init', status: 'ok')

    when 'solve'
      self.postMessage(cmd: 'solve', algorithm: solve(args))
