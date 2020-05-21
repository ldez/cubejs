(function() {
  var Cube, Extend, key, value;

  Cube = this.Cube || require('./cube');

  Extend = {
    asyncOK: !!window.Worker,
    _asyncSetup: function(workerURI) {
      if (this._worker) {
        return;
      }
      this._worker = new window.Worker(workerURI);
      this._worker.addEventListener('message', (e) => {
        return this._asyncEvent(e);
      });
      return this._asyncCallbacks = {};
    },
    _asyncEvent: function(e) {
      var callback, callbacks;
      callbacks = this._asyncCallbacks[e.data.cmd];
      if (!(callbacks && callbacks.length)) {
        return;
      }
      callback = callbacks[0];
      callbacks.splice(0, 1);
      return callback(e.data);
    },
    _asyncCallback: function(cmd, callback) {
      var base;
      (base = this._asyncCallbacks)[cmd] || (base[cmd] = []);
      return this._asyncCallbacks[cmd].push(callback);
    },
    asyncInit: function(workerURI, callback) {
      this._asyncSetup(workerURI);
      this._asyncCallback('init', function() {
        return callback();
      });
      return this._worker.postMessage({
        cmd: 'init'
      });
    },
    _asyncSolve: function(cube, callback) {
      this._asyncSetup();
      this._asyncCallback('solve', function(data) {
        return callback(data.algorithm);
      });
      return this._worker.postMessage({
        cmd: 'solve',
        cube: cube.toJSON()
      });
    },
    asyncScramble: function(callback) {
      this._asyncSetup();
      this._asyncCallback('solve', function(data) {
        return callback(Cube.inverse(data.algorithm));
      });
      return this._worker.postMessage({
        cmd: 'solve',
        cube: Cube.random().toJSON()
      });
    },
    asyncSolve: function(callback) {
      return Cube._asyncSolve(this, callback);
    }
  };

  for (key in Extend) {
    value = Extend[key];
    Cube[key] = value;
  }

}).call(this);
