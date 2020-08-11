<template>
  <el-dialog
    :visible="isShow"
    append-to-body
    title="友情提示"
    @close="dialogCloseEvent"
    custom-class="el-dialog-md"
  >
    <div style="margin-bottom: 20px">您所申请的排课中，有<span style="color: red">{{data.length}}</span>节课冲突，冲突的课将不在本次的排课申请中生效！</div>

    <div class="tableStyle">
      <table class="table">
        <tr v-for="(item,index) in data" :key="index">
          <td style="color: red">{{item.time}}</td>
          <td>{{item.class_period}}课时</td>
          <td>{{item.message}}</td>
        </tr>
      </table>
    </div>

    <div style="overflow: hidden;margin: 20px 0">
      <div style="float: right">确定，继续排课吗？</div>
    </div>

    <template slot="footer">
      <el-button @click="dialogCloseEvent">取消</el-button>
      <el-button @click="dialogSubmitEvent" type="primary" :disabled="!obj.isCanSearch">确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'
  export default {
    name: 'badLessonDialog',
    components: {
      ExpandTable
    },
    props: {
      isShow: {
        required: true,
        type: Boolean
      },
      data: {
        required: true,
        type: Array
      },
      strategyId: {
        default: ''
      },
      newStrategyId: {
        default: ''
      },
      studentIntentionId: {
        required: true
      },
      studentName: {
        required: true
      },
      studentNo: {
        required: true
      }
    },
    data() {
      return {
        obj: {
          isCanSearch: true
        }
      }
    },
    methods: {
      dialogCloseEvent() {
        if (this.strategyId) {
          this.$emit('update:isShow', false)
        } else {
          this.goEditView()
        }
      },
      goEditView() {
        this.$router.replace({
          path: `/newLesson/edit/${this.newStrategyId}`, query: {
            studentIntentionId: this.studentIntentionId,
            studentName: this.studentName,
            studentNo: this.studentNo
          }
        })
        return this.$store.dispatch('delVisitedViews', { name: 'newLessonAdd', path: '/newLesson/add' })
      },
      async dialogSubmitEvent() {
        this.obj.isCanSearch = false
        this.$emit('submit-event', this.obj)
      }
    }
  }
</script>

<style scoped lang="sass">
  td
    border: 1px solid #000!important
    height: 30px
  .tableStyle
    width: 401px
    max-height: 301px
    overflow-y: auto
    .table
      border: 1px solid #000 !important
      border-collapse: collapse !important
      width: 384px
      text-align: center
</style>
