export function focusOn ({ id = '', className = '' }) {
  setTimeout(function () {
    let element = id
      ? document.getElementById(id)
      : document.getElementsByClassName(className)[0]
    if (element) {
      console.log('element', element)
      element.focus()
    } else {
      console.log(id,': ', 'element not found')
    }
  }, 100)
}
