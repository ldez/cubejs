Cube = @Cube or require('./cube')

Extend =
  asyncOK: !!window.Worker

  _asyncSetup: (workerURI) ->
    return if @_worker
    @_worker = new window.Worker(workerURI)
    @_worker.addEventListener('message', (e) => @_asyncEvent(e))
    @_asyncCallbacks = {}

  _asyncEvent: (e) ->
    callbacks = @_asyncCallbacks[e.data.cmd]
    return unless callbacks and callbacks.length
    callback = callbacks[0]
    callbacks.splice(0, 1)
    callback(e.data)

  _asyncCallback: (cmd, callback) ->
    @_asyncCallbacks[cmd] or= []
    @_asyncCallbacks[cmd].push(callback)

  asyncInit: (workerURI, callback) ->
    @_asyncSetup(workerURI)
    @_asyncCallback('init', -> callback())
    @_worker.postMessage(cmd: 'init')

  _asyncSolve: (cube, callback) ->
    @_asyncSetup()
    @_asyncCallback('solve', (data) -> callback(data.algorithm))
    @_worker.postMessage(cmd: 'solve', cube: cube.toJSON())

  asyncScramble: (callback) ->
    @_asyncSetup()
    @_asyncCallback('solve', (data) -> callback(Cube.inverse(data.algorithm)))
    @_worker.postMessage(cmd: 'solve', cube: Cube.random().toJSON())


Include =
  asyncSolve: (callback) ->
    Cube._asyncSolve(this, callback)


for key, value of Extend
  Cube[key] = value

for key, value of Include
  Cube::[key] = value
