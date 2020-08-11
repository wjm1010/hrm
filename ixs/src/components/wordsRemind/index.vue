<template>
  <div>
    <div callIdAttr="call-phone-dialog" v-dialogDrag v-if="messageContent.length">
      <div class="el-dialog el-drag">
        <div class="el-drag__header">
          <div class="title" @click="disclosurePanel" style="cursor: pointer">
            <p class="titleName">{{panelTitle}}</p>
            <p><i class="el-icon-arrow-down" style="font-size: 24px;color: #737070"></i></p>
          </div>
          <div v-if="packUpPanelShow" id="chatContainer" @mouseleave="leave">
            <ul>
              <li v-for="(item,index) in messageContent" :key="index">
                <el-button type="primary" plain @click="isModelDetail(item)">{{item.modelLabel}}</el-button>
              </li>
            </ul>
          </div>
          <div class="text-push-down" v-if="PackUpPanelSwitch">
            <span @click="isPackUpPanel" style="color: #fff;font-weight: normal;cursor: pointer">收起<i class="el-icon-d-arrow-right" style="font-size: 16px;color: #fff;transform: rotate(-90deg)"></i></span>
          </div>
        </div>
      </div>
    </div>

    <div v-dialogDrag v-if="ModelDetailShow">
      <div class="el-drag ModelDetailShow">
        <div class="el-drag__header" >
          <p style="text-align:right"><i class="el-icon-close" @click="IsModelDetailShow" style="color:#000;"></i></p>
          <p style="white-space: pre-wrap">{{modelDetail}}</p>
        </div>
      </div>

    </div>
  </div>


</template>

<script>
  import Ws from './ws.js'
  import { getToken, setToken } from '@/utils/auth'
export default {
    name: 'wordsRemind',
    data() {
      return {
        panelTitle: '智能话术推荐',
        packUpPanelShow: true,
        ModelDetailShow: false,
        PackUpPanelSwitch: true,
        modelDetail: '',
        messageContent: [],
        errorData: [3, 5, 99],
        websock: null,
        wordsRecommended: JSON.parse(localStorage.getItem('CALL_TALK_MESSAGE')),
        token: '',
        host: ''
      }
    },
    mounted() {
      this.init()
    },
    props: {
      refresh: Boolean
    },
    destroyed() {
      this.websock && this.websock.close()
    },
    methods: {
      async init() {
        try {
          const { data } = await this.receiveToken()
          if (!data) return
          this.token = data.tokenString

          this.initWebSocket()
        } catch (e) {
          console.error(e)
        }
      },
      // 拿到token
      receiveToken() {
        return this.$http.post('speech_getBdToken', { cno: this.wordsRecommended.cno })
      },

      /**
       * 开始连接
      */
      initWebSocket() {
        const _url = window.location.host
        if (_url === 'ixs.hfjy.com' ||
            _url === 'offline-ixs.hfjy.com' ||
            _url === 'ixs-temp.hfjy.com' ||
            _url === 'ixs.hfjy.top' ||
            _url === 'offline-ixs.hfjy.top' ||
            _url === 'ixs-temp.hfjy.top') {
          this.host = 'iai.hfjy.com/trick'
        } else {
          this.host = 't-iai.hfjy.com/trick'
        }
        this.websock = new Ws()
        this.websock.init({
          url: `${this.host}/communicate/${this.token}`
        }).connect()
        this.messageContent = getToken('antistop_content') ? JSON.parse(getToken('antistop_content')) : []

        this.websock.onopen = this.websocketonopen
        this.websock.onmessage = this.websocketonmessage
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      },

      /**
       * 连接建立时触发
      */
      websocketonopen() {
        console.log('open')
        this.$message.success('话术推荐已连接！')
      },
      /**
       * 客户端接收服务端数据时触发
      */
      getmsgTypeContent() {
        return getToken('msgType_content') ? JSON.parse(getToken('msgType_content')) : {
          actions: 'success',
          responseData: []
        }
      },
      websocketonmessage(message) {
        try {
          console.log('message')
          const messageData = JSON.parse(message.data)
          if (messageData.statusCode === 0 || messageData.statusCode === 1) return
          if (/^[4]$/.test(messageData.msgType)) return this.$message.error(messageData.data)
          if (this.errorData.includes(messageData.msgType)) {
            localStorage.setItem('CALL_TALK_MESSAGE', '')
            setToken('antistop_content', '')
            this.collectLogs()
            setToken('msgType_content', '')
            this.websock.close()
            return
          }
          this.messageContent.push(JSON.parse(messageData.data))
          setToken('antistop_content', JSON.stringify(this.messageContent))
          this.leave()

          const modelData = this.messageContent.map((key) => {
            const val = Object.assign({}, key)
            delete val.modelDetail
            return val
          })
          const sendData = {
            msgType: messageData.msgType,
            data: modelData
          }
          const updateResponseData = this.getmsgTypeContent()
          setToken('msgType_content', JSON.stringify({ ...updateResponseData, responseData: sendData }))
        } catch (e) {
          const updateResponseData = this.getmsgTypeContent()
          setToken('msgType_content', JSON.stringify({ ...updateResponseData, actions: 'error' }))
        }
      },
      /**
       * 通信发生错误时触发
      */
      websocketonerror() {
        console.error('error')
      },
      /**
       * 连接关闭时触发
      */
      websocketclose() {
        this.$emit('update:refresh', false)
        console.warn('close')
      },
      /**
       * 收集日志
      */
      collectLogs() {
        if (!getToken('msgType_content')) return
        const msgTypeContentData = JSON.parse(getToken('msgType_content'))
        this.$http.post('speech_saveLog', {
          callId: this.wordsRecommended.callId,
          action: msgTypeContentData.actions,
          studentIntentionId: this.wordsRecommended.studentIntentionId,
          requestData: this.token,
          responseData: JSON.stringify(msgTypeContentData.responseData)
        })
      },
      isModelDetail(item) {
        if (!item.modelDetail) return this.$message.warning('没有详细内容！')

        this.ModelDetailShow = true
        this.modelDetail = item.modelDetail

        if (item.modelId) {
          const modelId = JSON.stringify({ modelId: item.modelId })
          const forwardTell = {
            msgType: 101,
            data: modelId
          }
          this.websock.send(JSON.stringify(forwardTell))
        } else {
          this.$message.error('系统错误！')
        }
      }, // 显示标签详细内容 点击标签发送信息
      isPackUpPanel() {
        this.packUpPanelShow = false
        this.PackUpPanelSwitch = false
        this.ModelDetailShow = false
        this.panelTitle = '展开查看智能话术推荐'

        // 操作dom使最外层恢复初始宽高
        const wordsPanel = document.getElementsByClassName('el-dialog el-drag')[0]
        wordsPanel.style.width = '260px'
        wordsPanel.style.height = '60px'
      }, // 收起面板
      disclosurePanel() {
        this.packUpPanelShow = true
        this.PackUpPanelSwitch = true
        this.panelTitle = '智能话术推荐'
        // 操作dom使最外层恢复初始宽高
        const wordsPanel = document.getElementsByClassName('el-dialog el-drag')[0]
        wordsPanel.style.width = '520px'
        wordsPanel.style.height = '260px'
      }, // 展开面板
      IsModelDetailShow() {
        this.ModelDetailShow = false
      }, // 收起显示内容
      leave() {
        setTimeout(() => {
          var div = document.getElementById('chatContainer')
          if (div) {
            div.scrollTop = div.scrollHeight
          }
        }, 200)
      }// 鼠标离开内容的时候滚动到底部
    }
  }
</script>

<style scoped lang="sass">
  p,ul
    margin: 0
    padding: 0
  .el-dialog
    padding: 20px
    position: fixed
    background-color: rgba(174, 174, 174, 0.6)
    z-index: 5000
    left: 62%
    top: 7%
    width: 520px
    resize: both
    overflow: auto
    .title
      text-align: center
      .titleName
        font-size: 16px
        color: #0066FF
        font-weight: normal
    .text-push-down
      text-align: right
      position: absolute
      bottom: 16px
      right: 9px
    #chatContainer
      // overflow-y: scroll
      max-height: 100px
      position: relative
      li
        list-style: none
        font-weight: normal
        display: inline-block
        color: #2C7EFF
        font-size: 12px
        margin: 0 20px 5px 0px
  .ModelDetailShow
    padding: 20px
    position: fixed
    background-color: #fff
    z-index: 5000
    width: 350px
    right: 4%
    top: 240px
    border: 1px solid #ccc
    border-radius: 2px
    font-weight: normal
    font-size: 13px
    color: #333333
    resize: both
    overflow: auto
</style>
