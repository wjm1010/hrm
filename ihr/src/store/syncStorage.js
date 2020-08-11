export function syncStorage(option) {
  function setState(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log(e)
    }
  }

  function getState(key, value) {
    try {
      return (value = localStorage.getItem(key)) && typeof value !== 'undefined' ? JSON.parse(value) : undefined
    } catch (e) {
      console.log(e)
    }
    return undefined
  }

  function setAllState(store) {
    const state = store.state
    const localStorageState = getState('store')
    if (!localStorageState) return
    store.replaceState(Object.assign({}, state, localStorageState))
    // if (Object.keys(sessionStorage).length) {
    //   for (const [key, value] of Object.entries(sessionStorage)) {
    //     store.commit(key, JSON.parse(value))
    //   }
    // }
  }
  // 当 store 初始化后调用
  return function(store) {
    setAllState(store)
    store.subscribe((mutation, state) => {
      setState('store', state)
      // setState(mutation.type, mutation.payload)
      // store.commit(mutation.type, data)
      // if ((typeof mutation.payload === 'object' && !Object.keys(mutation.payload).length) || !mutation.payload) {
      // }
    })
    // setAllState(store)
    return store
  }
}
