<template>
  <el-dialog
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="el-dialog-md"
    :title="dialogTitle"
    @close="$emit('closeEv')">
      <h4>课时费</h4>
      <ul>
        <li><label>{{resumeTrainAll.className}}：</label><i>{{resumeTrainAll.classFee}}</i></li>
      </ul>
      <h4>兼职时间</h4>
      <ul>
        <li><label>每周可安排固定课时：</label><i>{{resumeTrainAll.weekHours}}</i></li>
        <li><label>兼职时间：</label><i>{{resumeTrainAll.partTime}}</i></li>
        <li><label>寒暑假兼职：</label><i>{{resumeTrainAll.holidayOk}}</i></li>
      </ul>
      <h4>培训事宜</h4>
      <ul>
        <li><label>是否能够安排培训期：</label><i>{{resumeTrainAll.trainingOk}}</i></li>
        <li><label>通用培训时间：</label><i>{{resumeTrainAll.normalTrainingOk}}</i></li>
        <li><label>学科培训时间：</label><i>{{resumeTrainAll.subjectTrainingOk}}</i></li>
        <li><label>电脑设备确认：</label><i v-html="resumeTrainAll.computerCheck"></i></li>
      </ul>
      <h4>培训协议书：</h4>
      <ul>
        <li><i style="margin-left:20px">{{resumeTrainAll.sign}}</i></li>
      </ul>
  </el-dialog>
</template>
<script>
export default{
  mounted() {
    this.dialogShow = true
  },
  data() {
    return {
      dialogShow: false,
      dialogTitle: this.dialogTitleName + '入培信息'
    }
  },
  props: {
    resumeTrainAll: {
      type: Object
    },
    dialogTitleName: {
      type: String
    }
  },
  created() {
  },
  methods: {

  }
}
</script>
<style lang="sass" scoped>
ul,h4
  list-style: none
  color: #333333
  font-size: 14px
  font-weight: 400
  li:last-child
    border-bottom: 1px solid #cccccc
  li
    font-size: 13px
    border: 1px solid #cccccc
    border-bottom: none
    display: flex
    label,i
      display: inline-block
      margin-right: 20px
      padding: 15px 0
      vertical-align: middle
    label
      width: 30%
      text-align: right
      font-weight: 400
      border-right: 1px solid #cccccc
      background: #f2f2f2
    i
      width: 60%
</style>

