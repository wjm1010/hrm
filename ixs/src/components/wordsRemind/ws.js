class Ws {
  init(config) {
    this.config = { ...this.config, ...config }
    return this
  }

  /**
   * 连接websocket
   */
  connect() {
    const protocol = (window.location.protocol === 'http:') ? 'ws://' : 'wss://'
    this.host = protocol + this.config.url

    window.WebSocket = window.WebSocket || window.MozWebSocket
    if (!window.WebSocket) {
      this.error('Error: WebSocket is not supported .')
      return
    }
    this.config.nowConnectNum++

    this.socket = new WebSocket(this.host)
    this.socket.onopen = () => {
      this.config.nowConnectNum = 0
      this.onopen()
      // 心跳
      // this.startCheckConnect()
    }
    this.socket.onmessage = (message) => {
      this.onmessage(message)
    }
    this.socket.onclose = () => {
      // 清理
      // this.clearCheckConnect()
      this.socket = null

      this.onclose()
    }
    this.socket.onerror = (errorMsg) => {
      this.onerror(errorMsg)
      // 重新连接
      // this.reConnect()
    }
    return this
  }

  /**
   * 自定义异常函数
   * @param {Object} errorMsg
   */
  error(errorMsg) {
    this.onerror(errorMsg)
  }

  /**
   * 消息发送
   */
  send(message) {
    if (this.socket) {
      this.socket.send(message)
      return true
    }
    this.error('未连接，不能发送')
    return false
  }

  close() {
    if (this.socket !== undefined && this.socket !== null) {
      this.socket.close()
      // this.clearCheckConnect()
    } else {
      this.error('未连接，无需关闭')
    }
  }

  /**
   * 消息回調
   * @param {Object} message
   */
  onmessage(message) {
  }

  /**
   * 链接回调函数
   */
  onopen() {
  }

  /**
   * 关闭回调
   */
  onclose() {
  }

  /**
   * 异常回调
   */
  onerror() {
  }

  /**
   * 重新连接
   */
  reConnect() {
    if (this.config.nowConnectNum < this.config.MAX_CONNECT_NUM) {
      console.error('错误，尝试重新连接')
      this.connect()
    }
  }

  /**
   * 开始心跳
   */
  startCheckConnect() {
    this.config.intervalId = setInterval(() => {
      this.socket.send('success')
    }, 5000)
  }

  /**
   * 清除心跳
   */
  clearCheckConnect() {
    clearInterval(this.config.intervalId)
  }
}

Ws.config = {
  url: '', // 链接地址
  nowConnectNum: 0, // 尝试链接次数
  MAX_CONNECT_NUM: 10, // 最大链接次数
  // OVER_TIME: 18000, // 超时时间
  intervalId: ''
}

export default Ws
