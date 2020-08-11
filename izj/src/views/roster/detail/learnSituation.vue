<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-loading="loading">
    <el-button type="text" style="float: right" @click="btnSearchMore" v-if="showMore">查看更多></el-button>
    <h3 style="color: #525E71">教材信息</h3>
    <p v-if="!showMore" class="no-task">暂无信息</p>
    <el-row class="body"
            v-for="(item, index) in learnSituations"
            :key="index">
      <ul class="body-row">
        <li class="body-column width-20">
          <span class="label">科目：</span>
          <span>
            {{item.subjectName}}
          </span>
          <el-button type="primary" class="margin-left" :disabled="!canSearch" @click="btnExamination(item)">考情分析</el-button>
        </li>
        <li class="body-column width-33">
          <span>教材版本：</span>
          <span>
            {{item.versionName}}
          </span>
          <el-button type="primary" class="margin-left" :disabled="!canSearch" @click="learningAnalysis(item)">学情分析</el-button>
        </li>
      </ul>

      <!--<ul class="body-row">-->
        <!--<li class="body-column width-20">-->
          <!--<span>考试分数：{{item.scoresStr}}</span>-->
        <!--</li>-->
        <!--<li class="body-column width-33">-->
          <!--<span class="label">班级排名：</span>-->
          <!--<span>{{item.classRankStr}}</span>-->
        <!--</li>-->
        <!--<li class="body-column width-other">-->
          <!--<span>年级排名</span>-->
          <!--<span>{{item.gradeRankStr}}</span>-->
        <!--</li>-->
      <!--</ul>-->
    </el-row>

    <el-dialog
      :visible.sync="searchMore.show"
      custom-class="el-dialog-md"
      :append-to-body="true"
      width="73%">
      <p slot="title" style="border-bottom: 1px solid #666; padding-bottom: 5px; margin: 0">
        <b>教材信息</b>
      </p>
      <el-form inline ref="searchMore" :model="searchMore">
        <el-form-item label="提交时间" style="margin-left: 20px" prop="enterTime">
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
        <el-form-item label="学科：" prop="subjectId">
          <el-select v-model="searchMore.subjectId" placeholder="请选择">
            <el-option
              v-for="item in options.subject"
              :key="item.value"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :disabled="!canSearch" @click="getList">搜索</el-button>
        <el-button type="primary" :disabled="!canSearch" @click="closeSearchMore">重置</el-button>
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
import ExpandTable from '@/components/ExpandTable'
export default {
  components: {
    ExpandTable
  },
  name: 'detail-learn-situation',
  props: {
    rosterId: {
      required: true
    },
    studentInfo: {
      required: true
    },
    indexInit: Function
  },
  data() {
    return {
      searchMore: {
        show: false,
        enterTime: [],
        subjectId: ''
      },
      options: {
        subject: []
      },
      showMore: false,
      learnSituations: [],
      canSearch: true,
      loading: false,
      columns: [
        { 'value': 'subjectName', 'text': '学科' },
        { 'value': 'versionName', 'text': '版本' },
        { 'value': 'scoresStr', 'text': '分数' },
        { 'value': 'classRankStr', 'text': '班级排名' },
        { 'value': 'gradeRankStr', 'text': '年级排名' },
        { 'value': 'attendSchool', 'text': '所属学校' }
      ],
      rows: []
    }
  },
  mounted() {

  },
  created() {
    this.getData()
    this.setOptions()
  },
  methods: {
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
      this.$http.get('student_studyStateLog', {
        params: _query
      }).then(res => {
        if (res.data) {
          if (res.data.list.length === 0) {
            this.rows = []
            return
          }
          let newArr = []
          res.data.list.forEach(val => {
            newArr.push({ subjectName: val.time })
            newArr = [...newArr, ...val.data]
          })
          this.rows = newArr
        }
      }).catch(console.log).finally(() => {
        this.loading = false
        this.canSearch = true
      })
    },
    getData() {
      this.loading = true
      this.$http.get('student_studyState', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        if (res.data && res.data.list.length !== 0) {
          this.showMore = true
          this.learnSituations = res.data.list
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    setOptions() {
      this.$http.get('student_getNewSubject', { isFilterUrl: true }).then(res => {
        if (res.data) {
          this.options.subject = res.data
        }
      }).catch(console.log)
    },
    btnSearchMore() {
      this.searchMore.show = true
      this.getList()
    },
    closeSearchMore() {
      this.$refs['searchMore'].resetFields()
    },
    btnExamination(item) {
      this.canSearch = false
      this.$http.post('student_getTestInfo', {
        isBuried: '1',
        pageSourceType: '2',
        actionId: '6',
        regionId: this.studentInfo.country_id,
        actionBaseAttrId: item.subjectId,
        studentIntentionId: this.rosterId,
        provinceId: this.studentInfo.province_id,
        gradeId: this.studentInfo.grade_id,
        subjectId: item.subjectId,
        cityId: this.studentInfo.city_id
      }).then(res => {
        if (res.data && res.data.id) {
          this.$router.push({ path: `/schoolSituation/examination/${this.rosterId}`, query: {
            isBuried: '1',
            pageSourceType: '2',
            actionId: '6',
            regionId: this.studentInfo.country_id,
            actionBaseAttrId: item.subjectId,
            studentIntentionId: this.rosterId,
            provinceId: this.studentInfo.province_id,
            cityId: this.studentInfo.city_id,
            gradeId: this.studentInfo.grade_id,
            subjectId: item.subjectId
          }})
        } else {
          this.$message.warning('暂无数据')
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    },
    learningAnalysis(item) {
      this.canSearch = false
      this.$http.get('student_getLearnInfo', {
        params: {
          isBuried: '1',
          pageSourceType: '2',
          actionId: '7',
          provinceId: this.studentInfo.province_id,
          cityId: this.studentInfo.city_id,
          regionId: this.studentInfo.country_id,
          actionBaseAttrId: item.versionId,
          studentIntentionId: this.rosterId,
          bookVersionId: item.versionId,
          gradeId: this.studentInfo.grade_id,
          subjectId: item.subjectId
        }
      }).then(res => {
        if (res.data && res.data.length) {
          window.open(res.data[0].pdf_url)
        } else {
          this.$message.warning('暂无数据')
        }
      }).catch(console.log).finally(() => {
        this.canSearch = true
      })
    }
  }

}
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/learnSituation.sass'
</style>
