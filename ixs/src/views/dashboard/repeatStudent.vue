<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="main">
      <expandTable
        :loading="loading"
        :pagination="paging"
        @get-list="getList"
        @change-table-sort="changeTableSort"
        :rows="rows"
        :columns="columns"
        :slotNameArr="slotNameArr">
        <template slot-scope="scope" slot="phone">
          <span class="blue">{{scope.row.phone | phoneDesensitization}}</span>
        </template>
        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row.content && scope.row.content.length>15" width="500">
            <p>{{scope.row.content}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row.content.slice(0,15)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row.content}}</p>
        </template>
        <template slot-scope="scope" slot="operating">
          <el-button type="text"
            @click="linkto(scope.row.studentIntentionId, '/roster/detail/')" class="actionItems">沟通详情
          </el-button>
          <el-button type="text"
            @click="linkto(scope.row.studentIntentionId, '/lessonplanorder/list/')" class="actionItems">设班单
          </el-button>
        </template>
      </expandTable>
    </div>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'

  export default {
    name: 'repeatStudent',
    components: { expandTable },
    data() {
      return {
        columns: [
          { text: '学生姓名', value: 'name' },
          { text: '学生编号', value: 'studentNo' },
          { text: '手机号', value: 'phone' },
          { text: '意向课程', value: 'intentionSubject' },
          { text: '地区', value: 'areaName' },
          { text: '高考年份', value: 'examYear' },
          { text: '沟通数', value: 'total', 'sortable': true },
          { text: '最后沟通内容', value: 'content' },
          { text: '最后沟通时间', value: 'endTime', 'sortable': true },
          { text: '下次沟通时间', value: 'nextTime', 'sortable': true },
          { text: '跟进人', value: 'trackUserName' },
          { text: '操作', value: 'operating' }
        ],
        slotNameArr: ['phone', 'content', 'operating'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0'// 一共多少条
        },
        query: {
          sequence: '',
          sort: ''
        },
        loading: false,
        isCanSearch: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /**
       * 获取列表数据
       * @return {[type]} [description]
       */
      async getList() {
        this.loading = true
        this.isCanSearch = false
        const res = await this.$http.post('follow_repeatThread', this.query, { paging: this.paging })
        this.loading = false
        this.isCanSearch = true
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        if (!res.data.list.length) {
          this.$message.warning('没有符合条件的数据')
          this.paging.totalRows = '0'
          this.rows = []
          return
        }
        // this.rows = res.data.list
        this.rows = res.data.list.map(val => {
          val.total = +val.total
          return val
        })
        this.paging.totalRows = res.data.paging.dataCount
      },
      /**
       * 跳转
       * @return {[string]} url 路径
       */
      linkto(studentIntentionId, url) {
        if (!studentIntentionId) {
          this.$message.error('系统错误！')
          return
        }
        if (url === '/roster/detail/') {
          this.$eventBus.$emit('show-no-permission-dialog', studentIntentionId)
        } else {
          this.$router.push(`${url}${studentIntentionId}`)
        }
      },
      /**
       * 表头排序
       * @param  {[type]} sequence [description]
       * @param  {[type]} sort     [description]
       * @return {[type]}          [description]
       */
      changeTableSort(sequence, sort) {
        this.query.sequence = sequence
        this.query.sort = sort
        this.getList()
      },
    }
  }
</script>
<style>
  .blue{
    color: #2C7EFF
  }
</style>
