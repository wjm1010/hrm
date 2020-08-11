<template>
  <div class="main-content">
    <div class="fr" v-if="addRecordShow">
      <el-button type="primary" @click="addRecord">+添加沟通记录</el-button>
    </div>
    <h4>沟通记录</h4>
    <expand-table
      :pagination="paging"
      @get-list="getList"
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :slot-name-arr="slotNameArr">

        <template slot-scope="scope" slot="resumeRecordInfo">
          <el-popover trigger="hover" placement="top" v-if="scope.row['resumeRecordInfo'].length>10" width="500">
            <p>{{scope.row['resumeRecordInfo']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['resumeRecordInfo'].slice(0,10)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['resumeRecordInfo']}}</p>
        </template>

    </expand-table>

    <el-dialog
      :visible.sync="dialog.show"
      custom-class="el-dialog-md"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogEvent">
      <div style="text-align:center;font-size:14px;margin-bottom:20px;font-weight:bold">添加沟通记录</div>
      <el-form :model="dialog.query" :ref="dialog.query" :rules="dialog.rules" class="ClassFrom" v-loading="loading" label-width="140px">
        <el-form-item prop="resumeRecordStatus" label="候选人状态更改：">
          <el-select v-model="dialog.query.resumeRecordStatus" clearable filterable placeholder="请选择">
            <el-option
              v-for="(item,index) in dialog.options.resumeStatus"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="resumeRecordIntention" label="沟通意向：" v-if="dialog.query.resumeRecordStatus==='-2'">
          <el-radio-group v-model="dialog.query.resumeRecordIntention">
            <el-radio v-for="item in dialog.options.communicationIntention" :key="item.id" :label="item.id">
              {{item.value}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="resumeOutReasonId" label="淘汰原因：" v-if="dialog.query.resumeRecordStatus==='5'">
          <el-cascader
            :options="dialog.options.weedOutCause"
            :props="props"
            clearable
            @change="handleChange"
            v-model="dialog.query.resumeOutReasonId">
          </el-cascader>
        </el-form-item>
        <el-form-item label="说明原因：" prop="resumeInfoGiveupOther"
          v-if="dialog.query.resumeRecordStatus==='5' && dialog.reasonId === '21' || dialog.query.resumeRecordStatus==='5' && dialog.reasonId === '35'">
          <el-input
            type="textarea"
            placeholder="请说明说明原因"
            :maxlength="200"
            v-model.trim="dialog.query.resumeInfoGiveupOther">
          </el-input>
        </el-form-item>
        <el-form-item label="沟通内容：" prop="resumeRecordInfo">
          <el-input
            type="textarea"
            placeholder="请输入沟通内容"
            :maxlength="200"
            v-model.trim="dialog.query.resumeRecordInfo">
          </el-input>
        </el-form-item>
        <el-form-item label="下次沟通时间：" prop="resumeRecordNextTime">
          <el-date-picker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="dialog.query.resumeRecordNextTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogEvent">取消</el-button>
        <el-button type="primary" @click="addContractBtn" :disabled="!isCanSearch">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import expandTable from '@/components/ExpandTable'
export default {
  name: 'recordCommunication',
  data() {
    return {
      isCanSearch: true,
      loading: false,
      rows: [],
      columns: [
        { 'value': 'resumeRecordAddTime', 'text': '沟通时间' },
        { 'value': 'userName', 'text': '添加人' },
        { 'value': 'resumeRecordStatusName', 'text': '状态更改' },
        { 'value': 'resumeRecordInfo', 'text': '沟通内容' },
        { 'value': 'resumeRecordNextTime', 'text': '下次沟通时间' },
        { 'value': 'resumeRecordWayName', 'text': '沟通方式' }
      ],
      slotNameArr: ['resumeRecordInfo'],
      paging: {
        page: '1', // 当前第几页
        pageSize: '20', // 一页多少条
        totalRows: '0' // 一共多少条
      },
      dialog: {
        show: false,
        query: {
          resumeRecordStatus: '',
          resumeRecordIntention: '',
          resumeInfoGiveupOther: '',
          resumeRecordInfo: '',
          resumeRecordNextTime: '',
          resumeOutReasonId: []
        },
        reasonId: '',
        options: {
          resumeStatus: [],
          communicationIntention: [],
          weedOutCause: []
        },
        rules: {
          resumeRecordStatus: [
            { required: true, message: '请选择候选人状态', trigger: 'change' }
          ],
          resumeRecordIntention: [
            { required: true, message: '请选择沟通意向', trigger: 'change' }
          ],
          resumeOutReasonId: [
            { required: true, message: '请选择淘汰原因', trigger: 'change' }
          ],
          resumeInfoGiveupOther: [
            { required: true, message: '请输入说明原因', trigger: 'change' }
          ],
          resumeRecordInfo: [
            { required: true, message: '请输入沟通内容', trigger: 'change' }
          ],
          resumeRecordNextTime: [
            { required: true, message: '请选择下次沟通时间', trigger: 'change' }
          ]
        }
      },
      props: {
        value: 'causeId',
        label: 'causeContent',
        children: 'data'
      },
      addRecordShow: false
    }
  },
  props: {
    path: {
      require: true
    },
    userId: {
      require: true
    }
  },
  components: {
    expandTable
  },
  created() {
    this.getList()
    this.path.indexOf('look') > 0 ? this.addRecordShow = false : this.addRecordShow = true
  },
  mounted() {

  },
  watch: {
    'dialog.query.resumeRecordStatus'(value) {
      if (value) {
        this.dialog.query.resumeOutReasonId = []
        this.dialog.query.resumeInfoGiveupOther = ''
        this.dialog.query.resumeRecordIntention = ''
      }
    },
    'dialog.query.resumeOutReasonId'(value) {
      if (value) {
        this.dialog.query.resumeInfoGiveupOther = ''
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.post('resume_getLinkUp', { resumeId: this.userId }, { paging: this.paging }).then(res => {
        if (res.data) {
          if (res.data.whereData.length === 0 || !res.data.whereData) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.paging.totalRows = res.data.count
          this.rows = res.data.whereData
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }, // 列表
    addRecord() {
      this.dialog.show = true
      this.loading = true
      this.$http.post('resume_getResumeOne').then(res => {
        if (res.data) {
          this.dialog.options = res.data
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    }, // 添加沟通记录 获取弹框的值
    handleChange(value) {
      this.dialog.reasonId = value[value.length - 1]
    },
    closeDialogEvent() {
      this.dialog.show = false
      this.$refs[this.dialog.query].resetFields()
    },
    addContractBtn() {
      this.$refs[this.dialog.query].validate((valid) => {
        if (valid) {
          this.isCanSearch = false
          const _query = Object.assign({}, this.dialog.query)
          _query.resumeOutReasonId = this.dialog.query.resumeOutReasonId[this.dialog.query.resumeOutReasonId.length - 1]
          _query.resumeId = this.userId

          this.$http.post('resume_Addlinkup', _query).then(res => {
            if (res.data) {
              this.$message.success(res.message)
              this.dialog.show = false
              this.$emit('refresh-status')
              this.getList()
            }
            return false
          }).catch(console.log).finally(() => {
            this.isCanSearch = true
          })
        }
        return false
      })
    } // 提交沟通记录
  }
}
</script>


