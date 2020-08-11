export const searchTable = {
  data() {
    return {
      searchOptions: {}, // 搜索选项值
      searchParams: {}, // 搜索条件参数
      searchApi: '', // 搜索api地址
      list: [], // 列表数据
      listApi: '', // 列表api地址
      isCanSearch: true, // 能否搜索
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
    Promise.all([this.getRecordOption(), this.getList()])
  },
  methods: {
    /**
     * 获取搜索条件
     * @return {[type]} [description]
     */
    async getRecordOption() {
      if (!this.searchApi) return
      const res = await this.$http.post(this.searchApi)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.searchOptions = res.data
      this.getRecordOptionCb && this.getRecordOptionCb()
    },
    /**
     * 获取列表
     * @return {[type]} [description]
     */
    async getList(cb) {
      // 没有api不用调用
      if (!this.listApi) return
      this.loading = !this.loading
      this.isCanSearch = !this.isCanSearch
      const res = await this.$http.post(this.listApi, this.searchParams, { paging: this.paging, isFilterUrl: true })
      this.loading = !this.loading
      this.isCanSearch = !this.isCanSearch
      if (!res.data) {
        this.getListRejectCb && this.getListRejectCb()
        this.$message.error(res.message)
        return
      }
      if (!res.data.data.length) {
        this.getListRejectCb && this.getListRejectCb()
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
