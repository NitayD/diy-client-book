function Router () {
  this.routes = []
}

Router.prototype.set = function (method, path, func) {
  if (!method || !path || !func) { return }
  this.routes.push({ method, path, func })
}

Router.prototype.init = function (app, path = '') {
  if (!app) { return }
  this.routes.forEach(route => {
    app[route.method](`${path}${route.path}`, route.func)
  })
}

module.exports = Router