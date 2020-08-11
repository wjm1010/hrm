export const table = {
  data() {
    return {
      listParams: {}, // 列表参数
      list: [], // 列表数据
      listApi: '', // 列表api地址
      loading: false, // 是否显示loading框
      selectedData: [], // 列表单选框回调数值
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
    }
  },
  created: function() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList() {
      // 没有api不用调用
      if (!this.listApi) return
      this.loading = !this.loading
      const res = await this.$http.post(this.listApi, this.listParams, { paging: this.paging })
      this.loading = !this.loading
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      if (!res.data.data.length) {
        this.$message.warning('没有符合条件的数据')
        this.paging.totalRows = '0'
        this.list = []
        return
      }
      this.list = res.data.data
      this.paging.totalRows = res.data.count
      this.getListCb && this.getListCb()
    },
  }
}
