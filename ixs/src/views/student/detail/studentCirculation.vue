<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <div class="pos-top">
      <img :src="sptiteIcon" alt="" class="pos-img">
      <span class="title-font" style="">学生流转</span>
    </div>
    <div class="offset-list">
      <expand-table
        :rows="rows"
        :loading="loading"
        :columns="columns">
      </expand-table>
    </div>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  import sptiteIcon from '../icons/circulation.png'
  export default {
    name: 'student-circulation',
    components: {
      ExpandTable
    },
    props: {
      rosterId: {
        required: true
      },
    },
    data() {
      return {
        sptiteIcon,
        rows: [],
        columns: [
          {
            value: 'indexNumber', text: '序号'
          },
          {
            value: 'operate_time', text: '获取时间'
          },
          {
            value: 'name', text: '获取人'
          },
          {
            value: 'role_name', text: '角色'
          }
        ],
        loading: false,
        noHidden: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // get
      getTeacherLatelyFollower() {
        return this.$http.get('lesson_latelyFollower', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      getList() {
        this.loading = true
        this.getTeacherLatelyFollower().then(res => {
          if (res.data) {
            if (res.data.length === 0) {
              this.rows = []
              return
            }
            this.noHidden = true
            this.rows = res.data.map((val, index) => {
              val.indexNumber = index + 1
              return val
            })
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
  @import '../../../styles/student/detail/studentCirculation.sass'
</style>
