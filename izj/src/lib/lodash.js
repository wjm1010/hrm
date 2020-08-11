export function debounce(fun, wait = 0) {
  let setTimId
  return function() {
    setTimId && clearTimeout(setTimId)
    setTimId = setTimeout(fun, wait, ...arguments)
  }
}
