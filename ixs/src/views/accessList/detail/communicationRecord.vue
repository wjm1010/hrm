<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <h3 style="color: #525E71">沟通记录</h3>
    <expand-table
      :pagination="paging"
      @get-list="getList"

      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

      <template slot-scope="scope" slot="content">
        <el-popover trigger="hover" placement="top" v-if="scope.row['content'].length>30" width="500">
          <span>{{scope.row['content']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['content'].slice(0,30)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['content']}}</span>
      </template>
    </expand-table>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import {
    mapGetters
  } from 'vuex'

  export default {
    components: {
      ExpandTable
    },
    name: 'detail-communication-details',
    data() {
      return {
        slotNameArr: ['content'],
        rows: [],
        loading: false,
        columns: [
          {
            value: 'endTime', text: '沟通时间'
          },
          {
            value: 'name', text: '沟通人'
          },
          {
            value: 'roleName', text: '沟通角色'
          },
          {
            value: 'content', text: '沟通内容'
          },
          {
            value: 'toolName', text: '沟通工具'
          },
          {
            value: 'nextCommunicationTime', text: '下次沟通提醒'
          }
        ],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '20'
        }
      }
    },
    computed: {
      ...mapGetters(['rosterId', 'studentId'])
    },
    created() {
      this.getList()
    },
    methods: {
      getTeacherCommunicationRecordList(params) {
        return this.$http.post('lesson_communicationRecordList', Object.assign(params, {
          studentIntentionId: this.rosterId
        }), { paging: this.paging })
      },
      getList() {
        this.loading = true
        const _query = {}
        _query.opt = 'oc'
        this.getTeacherCommunicationRecordList(_query).then(res => {
          if (res.data) {
            if (res.data.data.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = res.data.data
            this.paging.totalRows = res.data.count
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/communicationDetails'
</style>
