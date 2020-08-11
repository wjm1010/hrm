<template>
  <div class="main-content">
    <expand-table
      :pagination="paging"
      @get-list="getList"
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="operateContent">
          <el-popover trigger="hover" placement="top" v-if="scope.row['operateContent'].length>10" width="500">
            <p>{{scope.row['operateContent']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['operateContent'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['operateContent']}}</p>
        </template>

    </expand-table>

  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'operationLog',
  data() {
    return {
      loading: false,
      rows: [],
      columns: [
        { 'value': 'operateType', 'text': '操作类型' },
        { 'value': 'operateContent', 'text': '操作内容' },
        { 'value': 'userName', 'text': '操作人' },
        { 'value': 'operateTime', 'text': '操作时间' }
      ],
      slotNameArr: ['operateContent'],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      }
    }
  },
  components: {
    expandTable
  },
  props: {
    userId: {
      require: true
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.loading = true
      this.$http.post('resume_getOperateLog', { resumeId: this.userId }, { paging: this.paging }).then(res => {
        if (res.data) {
          if (res.data.data.length === 0 || !res.data.data) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.paging.totalRows = res.data.count
          this.rows = res.data.data
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>


