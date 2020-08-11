export const dialog = {
  data() {
    return {
      dialogApi: '', // 弹出层Api地址
      dialogOptions: {}, // 获取弹出层选项值
      dialogParamsBack: {}, // 弹出层参数备份
      dialogListBack: [], // 弹出层列表备份
      dialogList: [], // 弹出层的列表数据
      dialogParams: {}, // 弹出层的选项值
      dialogVisible: false // 弹出层显示隐藏，默认隐藏
    }
  },
  created: function() {
    this.back()
    this.getOptionRecordOption()
  },
  methods: {
    /**
     * 获取弹出层条件
     * @return {[type]} [description]
     */
    async getOptionRecordOption() {
      if (!this.dialogApi) return
      const res = await this.$http.post(this.dialogApi)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.dialogOptions = res.data
      this.getOptionRecordOptionCb && this.getOptionRecordOptionCb()
    },
    /**
     * 备份参数
     * @return {[type]} [description]
     */
    back() {
      this.dialogListBack = this.$cloneParams(this.dialogList)
      this.dialogParamsBack = this.$cloneParams(this.dialogParams)
    },
  }
}
