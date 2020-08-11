<template>
  <!-- 命令行生成的模板 -->
  <div class="dashboard-container">
    <el-form :model="query" ref="query" inline>
      <el-form-item>
        <el-input
          placeholder="搜索版本名称"
          v-model.trim="query.versionName"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.courseTypeId" clearable filterable placeholder="课程类型">
          <el-option
            v-for="(item,index) in options.courseType"
            :key="index"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.chargeType" clearable filterable placeholder="扣费类型">
          <el-option
            v-for="(item,index) in options.feeType"
            :key="index"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.subjectId" clearable filterable placeholder="所含学科">
          <el-option
            v-for="(item,index) in options.subject"
            :key="index"
            :label="item.subjectName"
            :value="item.subjectId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" icon="el-icon-search" :disabled="!canSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <expand-table
      :pagination="paging"
      @get-list="getList"

      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="operating">
        <span v-if="scope.row.isApply === '1'">
          已报名
        </span>
        <el-button type="text" v-else @click="dialog.signUp.signUpBtnEvent(scope.row)">
          报名课程
        </el-button>
      </template>
    </expand-table>

    <el-dialog
      :visible.sync="dialog.signUp.show"
      custom-class="el-dialog-md"
      class="dialog-sign-up">
      <h2 class="title"><i class="el-icon-warning"></i>注意</h2>
      <div class="content">
        <span>是否报名“</span>
        <b class="color-blue">{{dialog.signUp.data.versionName}}</b>
        <span>”课程</span>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.signUp.yesEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">确认
        </el-button>
        <el-button
          @click="dialog.signUp.show=false"
          type="info">取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'

  export default {
    name: 'rostersignup',
    components: {
      ExpandTable
    },
    data() {
      return {
        query: {
          versionName: '',
          courseTypeId: '',
          chargeType: '',
          subjectId: '',
          studentId: this.$route.params.studentId
        },
        rows: [],
        slotNameArr: ['operating'],
        columns: [
          {
            value: 'indexNumber', text: '编号'
          },
          {
            value: 'versionName', text: '版本名称'
          },
          {
            value: 'currPlanName', text: '课程名称'
          },
          {
            value: 'courseType', text: '课程类别'
          },
          {
            value: 'gradeName', text: '年级'
          },
          {
            value: 'subjectName', text: '学科'
          },
          {
            value: 'chargeType', text: '扣费类型'
          },
          {
            value: 'price', text: '课程单价'
          },
          {
            value: 'operating', text: '操作'
          }
        ],
        studentId: this.$route.params.studentId,
        options: {
          courseType: [],
          subject: [],
          feeType: []
        },
        paging: {
          totalRows: '0',
          page: '1',
          pageSize: '20'
        },
        dialog: {
          signUp: {
            show: false,
            signUpBtnEvent: this.signUpBtnEvent,
            yesEvent: this.signYesEvent,
            data: {}
          }
        },
        canSearch: true,
        loading: false
      }
    },
    computed: {},
    created() {
      this.getList()
      this.getOption()
    },
    mounted() {
    },
    methods: {
      getCourseSearchApplyCourse() {
        return this.$http.get('course_searchApplyCourse')
      },
      getCourseApplyCourse(params) {
        return this.$http.get('course_applyCourse', {
          params: params,
          paging: this.paging
        })
      },
      postCourseAddApplyCourse() {
        return this.$http.post('course_addApplyCourse', {
          studentId: this.studentId,
          currPlanPropertyId: this.dialog.signUp.data.currPlanPropertyId
        })
      },
      getList() {
        this.canSearch = false
        this.loading = true
        this.getCourseApplyCourse(this.query).then(res => {
          if (res.data) {
            if (res.data.data.length === 0) {
              this.rows = []
              this.paging.totalRows = '0'
              return false
            }
            this.rows = res.data.data.map((val, index) => {
              val.indexNumber = index + 1
              return val
            })
            this.paging.totalRows = res.data.count
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.canSearch = true
          this.loading = false
        })
      },
      getOption() {
        this.getCourseSearchApplyCourse().then(res => {
          if (res.data) {
            this.options = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      signUpBtnEvent(row) {
        this.dialog.signUp.data = row
        this.dialog.signUp.show = true
      },
      signYesEvent() {
        this.postCourseAddApplyCourse().then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.dialog.signUp.show = false
            this.getList()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>
<style lang="sass">

  @import '../../styles/roster/signup.sass'

</style>
