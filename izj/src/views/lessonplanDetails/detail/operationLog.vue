<template>
	<div>
		<h4>操作日志</h4>
		<el-row>
			<el-form inline>
				<el-form-item label="操作时间">
					<el-date-picker
            v-model="query.operationTime"
            type="daterange"
            range-separator="到"
            start-placeholder="年-月-日"
            end-placeholder="年-月-日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
				</el-form-item>
				<el-form-item label="操作人">
					<el-select v-model="query.operateUserId" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in options.operator"
              :key="index"
              :label="item.operate_user_name"
              :value="item.operate_user_id">
            </el-option>
          </el-select>
				</el-form-item>
				<el-button type="primary" icon="el-icon-search" :disabled="!canSearch" @click="getList">查询</el-button>
			</el-form>
		</el-row>
		<ExpandTable
			:pagination="paging"
			:loading="loading"
			:rows="rows"
			:columns="columns"
      @get-list="getList">
		</ExpandTable>
	</div>
</template>
<script>
import { formatDate } from '@/lib/date.js'
import ExpandTable from '@/components/ExpandTable'
export default {
  name: 'operationLog',
  components: {
    ExpandTable
  },
  props: {
    strategyId: {
      required: true
    }
  },
  data() {
    return {
      query: {
        operationTime: [formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), 'YYYY-MM-DD'), formatDate(new Date(), 'YYYY-MM-DD')],
        operateStartTime: '',
        operateEndTime: '',
        operateUserId: ''
      },
      options: {
        operator: []
      },
      columns: [
        { 'value': 'operate_time', 'text': '操作时间' },
        { 'value': 'operate_user_name', 'text': '操作人' },
        { 'value': 'type_name', 'text': '操作事件' },
        { 'value': 'remark', 'text': '备注' }
      ],
      rows: [],
      loading: false,
      canSearch: true,
      paging: {
        totalRows: '0',
        page: '1',
        pageSize: '10'
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
    this.getOperator()
  },
  methods: {
    getList() {
      this.canSearch = false
      this.loading = true
      const _query = Object.assign({}, this.query)
      if (_query.operationTime === null || _query.operationTime.length === 0) {
        _query.operateStartTime = ''
        _query.operateEndTime = ''
      } else {
        _query.operateStartTime = _query.operationTime[0]
        _query.operateEndTime = _query.operationTime[1]
      }
      _query.strategyId = this.strategyId
      this.$delete(_query, 'operationTime')
      this.$http.get('courseApplication_operationLog', {
        params: _query,
        paging: this.paging
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.rows = res.data.list
          this.paging.totalRows = res.data.paging.dataCount
        } else {
          this.$message.error(res.message)
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
        this.loading = false
      })
    },
    // 操作人
    getOperator() {
      this.$http.get('courseApplication_getLogWhere', {
        params: {
          strategyId: this.strategyId
        }
      }).then(res => {
        if (res.data) {
          if (res.data.length === 0) {
            this.options.operator = []
            return false
          }
          this.options.operator = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../styles/lessonplanDetails/detail/messageRecord.sass'
</style>


