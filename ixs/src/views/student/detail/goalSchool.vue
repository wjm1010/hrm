<template>
  <div class="main-sec" v-loading="loading">
  <div class="panel">
    <div class="panel-head">
      <img src="../icons/icon-09.png">
      <span>学习信息</span>
    </div>
    
    <div class="panel-body">
      <div class="panel-title">
        <span class="name">目标院校</span>
        <el-button type="text" class="btn" @click="btnSearchMore" v-if="showMore">查看更多></el-button>
      </div>
      <div v-if="!showMore" class="no-task">
        目前暂无目标院校
      </div>
      <template v-else>
        <div class="panel-item" v-for="(item, index) in goalSchools" :key="index">
          <i class="left" :style="{ backgroundImage: `url(${icons[index]})`}"></i>
          <span class="name blue" @click="btnGoalSchool(item)">{{item.targetSchool}}</span>
        </div>
      </template>
    </div>
  </div>

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
import first from '../icons/icon-21.png'
import secd from '../icons/icon-22.png'
import three from '../icons/icon-23.png'

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
      icons: {
        0: first,
        1: secd,
        2: three
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
      var provinceIdD = ''
      var cityIdD = ''
      var actionIdD = ''
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
        studentIntentionId: this.rosterId,
        regionId: countryIdD,
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
              studentIntentionId: this.rosterId,
              regionId: countryIdD,
              provinceId: provinceIdD,
              cityId: cityIdD,
              schoolType: school_type,
              schoolName: item.targetSchoolName,
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
  @import '../../../styles/student/detail/goalSchool.sass'
</style>
