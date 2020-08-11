<template>
  <div class="main" v-if="isShow">
    <h3 style="color: #525E71">成单信息</h3>
    <expand-table
      :pagination="paging"
      @get-list="getList"

      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

      <template slot-scope="scope" slot="contractId">
        <span @click="openOrderInformation(scope.row)" class="blue">{{scope.row['contractId']}}</span>
      </template>

      <template slot-scope="scope" slot="course">
        <el-popover trigger="hover" placement="top" v-if="scope.row['course'].length>20" width="500">
          <span>{{scope.row['course']}}</span>
          <div slot="reference" class="name-wrapper">
            <span>{{scope.row['course'].slice(0,20)}}...</span>
          </div>
        </el-popover>
        <span v-else>{{scope.row['course']}}</span>
      </template>
    </expand-table>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import { mapGetters } from 'vuex'

  export default {
    name: 'orderInformation',
    components: {
      ExpandTable
    },
    data() {
      return {
        slotNameArr: ['contractId', 'course'],
        rows: [],
        loading: false,
        isShow: false,
        columns: [
          { value: 'submitTime', text: '成单登记日期' },
          { value: 'contractId', text: '成单登记编号', width: 160 },
          { value: 'sum', text: '登记总金额' },
          { value: 'bigTypeName', text: '课程类型' },
          { value: 'course', text: '报名课程' },
          { value: 'period', text: '购买课时' },
          { value: 'donatePeriod', text: '赠送课时' },
          { value: 'status', text: '成单状态' },
          { value: 'submit_user_name', text: '提交人' },
          { value: 'effectiveDate', text: '成单生效日期' }
        ],
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '20'
        }
      }
    },
    computed: {
      ...mapGetters(['rosterId', 'studentInfo'])
    },
    created() {
      this.getList()
    },
    methods: {
      getOcContractList() {
        return this.$http.get('student_getOcContractList', {
          params: { studentIntentionId: this.rosterId },
          paging: this.paging
        })
      },
      getList() {
        this.loading = true
        this.getOcContractList().then(({ data } = {}) => {
          if (!data || !data.data.length) return
          this.rows = data.data
          this.paging.totalRows = data.paging.dataCount
          this.isShow = true
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      openOrderInformation(row) {
        if (row.contractId) {
          this.$router.push(`/contract/detail/check/${row.contractId}`)
        } else {
          this.$message.error('系统错误！')
          return
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  .main
    background-color: #fff
    margin-top: 10px
    padding: 10px
    > h3
      padding: 0 0 0 10px
      margin: 0
      margin-bottom: 10px
</style>
