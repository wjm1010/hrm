<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <h3 style="color: #525E71">学生流转</h3>
    <expand-table
      :rows="rows"
      :loading="loading"
      :columns="columns">
    </expand-table>
  </div>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'

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
      this.init()
    },
    methods: {
      // get
      getTeacherLatelyFollower() {
        return this.$http.get('teacher_latelyFollower', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      init() {
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
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/studentCirculation.sass'
</style>
