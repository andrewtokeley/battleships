export const FontAwesome = function () {
  return new Promise(function (resolve, reject) {
    const me = {}
    const FACache = {}

    function find (name) {
      const elm = document.createElement('i')
      elm.className = 'fa fa-' + name
      elm.style.display = 'none'
      document.body.appendChild(elm)
      const content = window.getComputedStyle(
        elm, ':before'
      ).getPropertyValue('content')
      document.body.removeChild(elm)
      return content
    };

    me.get = function (name) {
      if (FACache[name]) { return FACache[name] }
      const c = find(name)[1]
      FACache[name] = c
      return c
    };

    (function () {
      const l = document.createElement('link'); l.rel = 'stylesheet'
      l.onload = function () {
        document.fonts.load('48px FontAwesome')
          .then(function (e) { resolve(me) })
          .catch(reject)
      }
      l.href = '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
      const h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h)
    }())
  })
}
