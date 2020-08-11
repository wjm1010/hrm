<template>
  <div class="rest-wrap" v-if="noHidden">
    <Panel
      title="剩余课时"
      kind="restTime"
    >
      <template slot="list">
        <div class="content">
          <div class="wrap">
            <total-time
              :max="getParam.all.total"
              :format-tooltip="allformat"
              :current="getParam.all.used_period"
              :tooltip-class="alltooltip"
              kind="我的总课时"
            />
          </div>
          <div class="wrap normal-time">
            <normal-time
              :max="getParam.common.total"
              :format-tooltip="commonformatTooltip"
              :current="getParam.common.used_period"
              :tooltip-class="commontooltip"
              kind="普通课时"
            />
          </div>
          <div class="wrap">
            <normal-time
              :max="getParam.star.total"
              :format-tooltip="starformatTooltip"
              :current="getParam.star.used_period"
              :tooltip-class="startooltip"
              kind="五星课时"
            />
          </div>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script>
import Panel from '../components/component/panel'
import totalTime from '../components/component/totalTime'
import normalTime from '../components/component/normalTime'

export default {
  name: 'rest-time',
  components: {
    Panel,
    totalTime,
    normalTime
  },
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
  .content
    display: flex
    width: 100%
    padding: 24px 0
    .wrap
      flex: 1
    .normal-time
      border-left: 1px solid #E8EBF0
      border-right: 1px solid #E8EBF0
</style>

