<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <div class="content">
      <div class="classTime">
        <span class="demonstration">所有课时</span>
        <span class="consume">已消耗课时{{getParam.all.used_period}}课时</span>
        <el-slider v-model="getParam.all.used_period" :step="8" show-stops disabled :max="getParam.all.total" :format-tooltip="allformatTooltip" :tooltip-class="alltooltip">
        </el-slider>
        <span class="classNumber">{{getParam.all.total}}课时</span>
      </div>
      <div class="classTime">
        <span class="demonstration">普通课时</span>
        <span class="consume">已消耗课时{{getParam.common.used_period}}课时</span>
        <el-slider v-model="getParam.common.used_period" :step="8" show-stops disabled :max="getParam.common.total" :format-tooltip="commonformatTooltip" :tooltip-class="commontooltip">
        </el-slider>
        <span class="classNumber">{{getParam.common.total}}课时</span>
      </div>
      <div class="classTime">
        <span class="demonstration">五星课时</span>
        <span class="consume">已消耗课时{{getParam.star.used_period}}课时</span>
        <el-slider v-model="getParam.star.used_period" :step="8" show-stops disabled :max="getParam.star.total" :format-tooltip="starformatTooltip" :tooltip-class="startooltip">
        </el-slider>
        <span class="classNumber">{{getParam.star.total}}课时</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'detail-restClass',
    data() {
      return {
        noHidden: false,
        toolTipClass: 'page-login-toolTipClass',
        allformat: '',
        commonformat: '',
        starformat: '',
        alltooltip: '',
        commontooltip: '',
        startooltip: '',
        getParam: {
          all: {
            total: 0,
            used_period: 0,
            inPeriod: '',
            lastTime: ''
          },
          common: {
            total: 0,
            used_period: 0,
            inPeriod: '',
            lastTime: ''
          },
          star: {
            total: 0,
            used_period: 0,
            inPeriod: '',
            lastTime: ''
          }
        }
      }
    },
    created() {
    },
    mounted() {
      this.periodShow()
    },
    props: {
      rosterId: {
        required: true
      }
    },
    methods: {
      allformatTooltip() {
        return this.allformat
      },
      commonformatTooltip() {
        return this.commonformat
      },
      starformatTooltip() {
        return this.starformat
      },
      periodShow() {
        this.$http.get('student_periodShow', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then(res => {
          if (res.data) {
            for (const val in res.data) {
              res.data[val].total = +res.data[val].total
              res.data[val].used_period = +res.data[val].used_period
              res.data[val].inPeriod = +res.data[val].inPeriod
            }
            this.getParam = res.data
            this.allformat = ` 两周${res.data.all.inPeriod}课时 ${res.data.all.lastTime}`
            this.commonformat = ` 两周${res.data.common.inPeriod}课时 ${res.data.common.lastTime}`
            this.starformat = ` 两周${res.data.star.inPeriod}课时 ${res.data.star.lastTime}`
            if (res.data.all.inPeriod >= 2) {
              this.alltooltip = 'el-icon-success'
            } else {
              this.alltooltip = 'el-icon-warning'
            }
            if (res.data.common.inPeriod >= 2) {
              this.commontooltip = 'el-icon-success'
            } else {
              this.commontooltip = 'el-icon-warning'
            }
            if (res.data.star.inPeriod >= 2) {
              this.startooltip = 'el-icon-success'
            } else {
              this.startooltip = 'el-icon-warning'
            }
            if (res.data.common.length === 0) {
              this.commonformat = ' 两周0课时 '
              this.getParam.common.total = 0
              this.getParam.common.used_period = 0
            }
            if (res.data.star.length === 0) {
              this.starformat = ' 两周0课时 '
              this.getParam.star.total = 0
              this.getParam.star.used_period = 0
            }
            if (res.data.all.length === 0 && res.data.common.length === 0 && res.data.star.length === 0) {
              return false
            }
            this.noHidden = true
          }
        }).catch(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/restClass'
</style>
