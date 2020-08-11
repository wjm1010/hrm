<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-loading="loading">
		<el-button type="text" style="float: right" @click="btnSearchMore" v-if="showMore">查看更多></el-button>
    <h3 style="color: #525E71">目标院校</h3>
    <p v-if="!showMore" class="no-task">暂无信息</p>
    <el-row class="body" v-if="showMore">
      <ul class="body-row">
        <li :class="judgeClass(index)"
          v-for="(item, index) in goalSchools"
          :key="index">
          <span class="label" v-text="judgeLabel(item)"></span>
          <el-button type="text" @click="btnGoalSchool(item)">
            {{item.targetSchool}}
          </el-button>
        </li>
      </ul>
    </el-row>
    <el-dialog
      :visible.sync="searchMore.show"
      custom-class="el-dialog-md"
      :append-to-body="true"
      width="50%">
      <p slot="title" style="border-bottom: 1px solid #666; padding-bottom: 5px; margin: 0">
        <b>目标院校</b>
      </p>
      <el-form inline>
        <el-form-item label="录入时间：" style="margin-left: 20px">
          <el-date-picker
            v-model="searchMore.enterTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" :disabled="!canSearch" @click="getList">搜索</el-button>
      </el-form>
      <expand-table
        :rows="rows"
        :loading="loading"
        :columns="columns">
      </expand-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExpandTable from '@/components/ExpandTable'
export default {
  name: 'goal-school-info',
  components: {
    ExpandTable
  },
  props: {
    studentInfo: {
      required: true
    },
    rosterId: {
      required: true
    },
    indexInit: Function
  },
  data() {
    return {
      searchMore: {
        show: false,
        enterTime: []
      },
      canSearch: true,
      loading: false,
      showMore: false,
      goalSchools: [],
      columns: [
        { 'value': 'firstSchool', 'text': '第一志愿' },
        { 'value': 'secondSchool', 'text': '第二志愿' },
        { 'value': 'thirdSchool', 'text': '第三志愿' },
        { 'value': 'date', 'text': '录入时间' }
      ],
      rows: []
    }
  },
  computed: {
    ...mapGetters([
      'studentId',
      'userId'
    ])
  },
  params: {
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.$http.get('student_targetSchool', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        if (res.data) {
          if (res.data.list.length !== 0) {
            this.showMore = true
            this.goalSchools = res.data.list
          } else {
            this.showMore = false
            return
          }
        } else {
          this.showMore = false
          return
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    getList() {
      this.loading = true
      this.canSearch = false
      const _query = Object.assign({}, this.searchMore)
      if (_query.enterTime === null || _query.enterTime.length === 0) {
        _query.startTime = ''
        _query.endTime = ''
      } else {
        _query.startTime = _query.enterTime[0]
        _query.endTime = _query.enterTime[1]
      }
      _query.studentIntentionId = this.rosterId
      this.$delete(_query, 'enterTime')
      this.$delete(_query, 'show')
      this.$http.get('student_targetSchoolLog', {
        params: _query
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            return
          }
          this.rows = res.data.list
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    },
    btnSearchMore() {
      this.searchMore.show = true
      this.getList()
    },
    btnGoalSchool(item) {
      var school_type = ''
      var actionIdD = ''
      var provinceIdD = ''
      var cityIdD = ''
      var countryIdD = ''
      if (this.studentInfo.grade_id <= 2) {
        school_type = 1
        provinceIdD = this.studentInfo.province_id
        cityIdD = this.studentInfo.city_id
        countryIdD = this.studentInfo.country_id
      } else if (this.studentInfo.grade_id <= 5) {
        school_type = 14
        provinceIdD = item.provinceId
        cityIdD = item.cityId
        countryIdD = item.countryId
      } else {
        school_type = 13
        provinceIdD = item.provinceId
        cityIdD = item.cityId
        countryIdD = item.countryId
      }
      if (item.serialNumber === '1') {
        actionIdD = '3'
      } else if (item.serialNumber === '2') {
        actionIdD = '4'
      } else if (item.serialNumber === '3') {
        actionIdD = '5'
      }
      this.$http.post('student_getSchoolInfo', {
        isBuried: '1',
        pageSourceType: '2',
        actionId: actionIdD,
        regionId: countryIdD,
        studentIntentionId: this.rosterId,
        provinceId: provinceIdD,
        cityId: cityIdD,
        schoolType: school_type,
        schoolName: item.targetSchoolName,
      }, { isFilterUrl: true }).then(res => {
        if (school_type !== 1) {
          if (res.data && res.data.id) {
            this.$router.push({ path: `/schoolSituation/index/${this.rosterId}`, query: {
              isBuried: '1',
              pageSourceType: '2',
              actionId: actionIdD,
              regionId: countryIdD,
              studentIntentionId: this.rosterId,
              provinceId: provinceIdD,
              cityId: cityIdD,
              schoolType: school_type,
              schoolName: item.targetSchoolName
            }})
          } else {
            this.$message.warning('暂无信息')
          }
        } else {
          if (res.data && res.data.pdf_url) {
            window.open(res.data.pdf_url)
          } else {
            this.$message.warning('暂无信息')
          }
        }
      }).catch(console.log)
    },
    judgeClass(index) {
      if (index === 0) {
        return 'body-column width-20'
      }
      if (index === 1) {
        return 'body-column width-33'
      }
      if (index === 2) {
        return 'body-column width-other'
      }
    },
    judgeLabel(item) {
      if (item.serialNumber === '1') {
        return '第一志愿：'
      }
      if (item.serialNumber === '2') {
        return '第二志愿：'
      }
      if (item.serialNumber === '3') {
        return '第三志愿：'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/goalSchool.sass'
</style>
