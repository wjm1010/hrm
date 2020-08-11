<template>
  <el-dialog
    :visible.sync="showReferral"
    width="55%"
    :append-to-body="true"
    @closed="closeDialog">
    <p class="title">内推有奖</p>
    <div class="content" v-loading="loading">
      <div class="qrCode" ref="qrcode">
        <div class="img-pos">
          <QrcodeVue
            v-if="referralUrl"
            :value="referralUrl"
            :size="180"
            level="H">
          </QrcodeVue>
        </div>
      </div>
      <div class="content-font">
        <p class="font-offset">1.微信转发图片给你的亲朋好友，打开图片长按直接识别图中二维码，注册成功后，登录工作台首页，进入温馨小助手>内部推荐学生，直接跟进试听哦！</p>
        <p class="font-offset">
          <span> 2.直接发送推送链接</span><br/>
          <a :href="referralUrl" class="link-color">{{referralUrl}}</a>
          <span>，打开链接即可注册，注册成功后，登录工作台首页，进入温馨小助理>内部推荐学生，直接跟进试听哦！</span>
         </p>
         <el-button type="primary" class="btn-pos" @click="savePicture">保存图片</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import referralImg from './referral.png'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
export default {
  name: 'referralDialog',
  components: {
    QrcodeVue
  },
  props: {
    showReferral: {
      required: true
    }
  },
  data() {
    return {
      dataURL: '', // 生成的base64码（图片）
      referralUrl: '', // 推荐码
      referralImg, // 背景图片
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.makeQrcode()
      this.createdPicture()
    },
    closeDialog() {
      this.$emit('close-referral-dialog')
    },
    /*
    生成图片
    */
    createdPicture() {
      if (!this.referralUrl) {
        this.$message.warning('抱歉，系统错误')
        this.loading = false
      } else {
        html2canvas(this.$refs.qrcode, {
          backgroundColor: null
        }).then((canvas) => {
          const dataURL = canvas.toDataURL('image/png')
          this.dataURL = dataURL
        }).finally(() => {
          this.loading = false
        })
      }
    },
    /*
    保存图片
    */
    savePicture() {
      const a = document.createElement('a')
      a.download = 'hfjy' || 'pic'
      a.href = this.dataURL
      a.click()
    },
    /*
    生成二维码
    */
    makeQrcode() {
      this.loading = true
      return this.$http.get('users_myQrCode').then(res => {
        if (res.data) {
          this.referralUrl = res.data.url
        }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../styles/dashboard/referralDialog'
</style>
