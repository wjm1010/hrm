<template>
  <div v-if="show">
    <el-dialog
      :visible.sync="show"
      @close="closeExpand"
      custom-class="el-dialog-md"
      :append-to-body="true"
      width="50%"
      title="联络信息">
      <MainPhone
        :rows="mainPhoneRows"
        :columns="mainColumns"
        :slotNameArr="mainSlotNameArr">
        <template slot-scope="scope" slot="phone">
          <span class="phone-color">{{scope.row['phone']}}</span>
          <CommitDetailDialog
            :studentInfo= "studentInfo"
            :indexInit="indexInit"
            :fixDialog="fixDialog"
            :serialNumber="studentInfo.serial_number"
            :studentIntentionId="studentInfo.student_intention_id"
            :phoneName="studentInfo.parent_relationship"
            :phone="studentInfo.phone"
            class="cmtPos">
          </CommitDetailDialog>
        </template>
      </MainPhone>
      
      <expand-table
        :rows="studentInfo.extra_phone"
        :columns="extraPhoneColumns"
        :slotNameArr="extraSlotNameArr">
        <template slot-scope="scope" slot="extra_phone">
          <span class="phone-color">{{scope.row['extra_phone']}}</span>
          <CommitDetailDialog
            :studentInfo = "studentInfo"
            :indexInit="indexInit"
            :fixDialog="fixDialog"
            :serialNumber="scope.row['serial_number']"
            :studentIntentionId="studentInfo.student_intention_id"
            :phoneName="scope.row['parent_relationship']"
            :phone="studentInfo.phone"
            class="cmtPos">
          </CommitDetailDialog>
        </template>
      </expand-table>
    </el-dialog>
  </div>
</template>
<script>
import CommitDetailDialog from '../dialog/commitDetailDialog'
import ExpandTable from '@/components/ExpandTable'
import MainPhone from '@/components/ExpandTable'
export default {
  components: {
    ExpandTable,
    MainPhone,
    CommitDetailDialog
  },
  props: {
    studentInfo: {
      required: true
    },
    showView: {
      required: true
    },
    indexInit: Function,
    fixDialog: Object
  },
  created() {
    this.concetMainPhone()
  },
  data() {
    return {
      show: true,
      mainPhoneRows: [],
      mainColumns: [
        { 'value': 'phone', 'text': '主要号码' },
        { 'value': 'number_personal', 'text': '号码所属人' },
        { 'value': 'parent_relationship', 'text': '备注信息' }
      ],
      mainSlotNameArr: ['phone'],
      extraPhoneColumns: [
        { 'value': 'extra_phone', 'text': '备用号码' },
        { 'value': 'number_personal', 'text': '号码所属人' },
        { 'value': 'parent_relationship', 'text': '备注信息' }
      ],
      extraSlotNameArr: ['extra_phone'],
    }
  },
  methods: {
    concetMainPhone() {
      const { phone, number_personal, parent_relationship } = this.studentInfo
      this.mainPhoneRows.push({ phone, number_personal, parent_relationship })
    },
    closeExpand() {
      this.indexInit()
      this.show = false
      this.$emit('close-expand')
    }
  }
}
</script>
<style lang="sass" scoped>
.phone-color
  color: #2C7EFF
.cmtPos
  position: absolute
  top: 18px
  padding-left: 5px
</style>



