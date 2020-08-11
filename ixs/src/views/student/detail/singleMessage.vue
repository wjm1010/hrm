<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <Panel
      title="成单信息"
      kind="orderInfo"
    >
      <template slot="list">
        <expand-table
          :pagination="paging"
          @get-list="getList"

          :rows="rows"
          :loading="loading"
          :columns="columns"
          :tableExpandColumns="tableExpandColumns"
          :slot-name-arr="slotNameArr">
          <template slot-scope="scope" slot="paperLink">
            <a :href="scope.row.paperLink" target="_blank" v-if="scope.row.paperLink" class="download">下载</a>
            <span v-else>暂无</span>
          </template>
          <template slot-scope="scope" slot="signupLink">
            <a :href="scope.row.signupLink" target="_blank"  v-if="scope.row.signupLink" class="download">下载</a>
            <span v-else>暂无</span>
          </template>
          <template slot-scope="scope" slot="contractId">
            <el-button type="text" size="small" @click="openOrderInformation(scope.row)">
              {{scope.row['contractId']}}
            </el-button>
          </template>
        </expand-table>
      </template>
    </Panel>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import Panel from '../components/component/panel'
  export default {
    components: {
      ExpandTable,
      Panel
    },
    name: 'detail-singleMessage',
    data() {
      return {
        query: {
          studentIntentionId: ''
        },
        noHidden: true,
        rows: [],
        loading: false,
        slotNameArr: ['contractId', 'paperLink', 'signupLink'],
        columns: [
          {
            value: 'studentName', text: '学生姓名', fixed: 'left'
          },
          {
            value: 'studentNo', text: '学生编号'
          },
          {
            value: 'contractId', text: '成单登记编号'
          },
          {
            value: 'sum', text: '登记总金额'
          },
          {
            value: 'noAccountingSum', text: '未到账金额'
          },
          {
            value: 'bigTypeName', text: '课程类型'
          },
          {
            value: 'restPeriod', text: '剩余课时'
          },
          {
            value: 'appliablePeriod', text: '可排课时'
          },
          {
            value: 'lastEffectTime', text: '成单生效日期'
          },
          {
            value: 'statusName', text: '成单状态'
          },
          {
            value: 'submitUserName', text: '提交人'
          },
          {
            value: 'submitTime', text: '成单登记日期'
          },
          {
            value: 'accountingSum', text: '到账金额'
          },
          {
            value: 'restSum', text: '剩余金额'
          },
          {
            value: 'signupLink', text: '电子合同', fixed: 'right'
          },
          {
            value: 'paperLink', text: '补充协议', fixed: 'right'
          }
        ],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '5'
        }
      }
    },
    props: {
      rosterId: {
        required: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      openRecord(row) {
      },
      getTeacherCommunicationRecordList(params) {
        return this.$http.get('student_getContractList', {
          params: Object.assign(params, {
            studentIntentionId: this.rosterId
          }), paging: this.paging
        })
      },
      openOrderInformation(row) {
        if (row.contractId) {
          this.$router.push(`/contract/detail/check/${row.contractId}`)
        } else {
          this.$message.error('系统错误！')
          return
        }
      },
      getList() {
        this.loading = true
        this.getTeacherCommunicationRecordList(this.query).then(res => {
          if (res.data) {
            if (!res.data.content || !res.data.content.length) {
              this.noHidden = false
              return false
            }
            this.rows = res.data.content
            this.paging.totalRows = res.data.dataCount
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/student/detail/singleMessage'
</style>
