<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <div class="main">
      <expandTable
        :loading="loading"
        :pagination="paging"
        @get-list="getList"

        :rows="rows"
        :columns="columns"
        :slotNameArr="slotNameArr">

        <template slot-scope="scope" slot="content">
          <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>10" width="500">
            <span>{{scope.row['content']}}</span>
            <div slot="reference" class="name-wrapper">
              <span>{{scope.row['content'].slice(0,10)}}...</span>
            </div>
          </el-popover>
          <span v-else>{{scope.row['content']}}</span>
        </template>

        <template slot-scope="scope" slot="operating">
          <el-button type="text" @click="changeTableViewSelect(scope.row)" class="actionItems">沟通详情</el-button>
        </template>
      </expandTable>
    </div>
  </div>
</template>

<script>
  import expandTable from '@/components/ExpandTable'

  export default {
    name: 'assistant',
    components: { expandTable },
    data() {
      return {
        columns: [
          { text: '学生姓名', value: 'studentName' },
          { text: '学生编号', value: 'studentNo' },
          { text: '电话号码', value: 'phone' },
          { text: '状态', value: 'careerStatusName' },
          { text: '阶段', value: 'saleStage2Name' },
          { text: '最后沟通时间', value: 'endTime' },
          { text: '最后沟通情况', value: 'content' },
          { text: '班主任', value: 'assistantName' },
          { text: '操作', value: 'operating' }
        ],
        slotNameArr: ['operating', 'content'],
        rows: [],
        paging: {
          page: '1', // 当前第几页
          pageSize: '10', // 一页多少条
          totalRows: '0'// 一共多少条
        },
        query: {
          page: '',
          pageSize: ''
        },
        loading: false,
        isCanSearch: true
      }
    },
    computed: {},
    created() {
      this.getList()
    },
    watch: {
    },
    methods: {
      getList() {
        this.loading = true
        this.isCanSearch = false
        this.$http.post('lesson_saleFirstLesson', this.query, { paging: this.paging }).then(res => {
          if (res.data) {
            if (res.data.result.length === 0) {
              this.rows = []
              this.$message.warning('没有符合条件的数据！')
              this.paging.totalRows = '0'
              return false
            }
            this.paging.totalRows = res.data.count
            this.rows = res.data.result
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
          this.isCanSearch = true
        })
      },
      changeTableViewSelect(row) {
        if (row.studentIntentionId) {
          this.$eventBus.$emit('show-no-permission-dialog', row.studentIntentionId)
        } else {
          this.$message.error('系统错误！')
          return
        }
      } // 沟通详情
    }
  }
</script>
