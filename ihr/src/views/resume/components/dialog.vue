<template>
  <el-dialog
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="el-dialog-sl"
    :title="dialogTitle"
    @close="$emit('closeEv')">
      <el-form>
        <el-form-item :label="dialogLabel">
          <el-select v-model="dialogQuery" clearable filterable placeholder="请选择" v-if="dialogTitle==='分配数据'">
            <el-option
              v-for="item in directList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
          <el-select v-model="dialogQuery" clearable filterable placeholder="请选择" v-if="dialogTitle==='抽回数据'">
            <el-option
              v-for="item in withdrawReason"
              :key="item.causeId"
              :label="item.causeContent"
              :value="item.causeId">
            </el-option>
          </el-select>
          <el-select v-model="dialogQuery" clearable filterable placeholder="请选择" v-if="dialogTitle==='更改状态'">
            <el-option
              v-for="item in changeStatus"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeEv')">取消</el-button>
      <el-button type="primary" :disabled="!isCanSearch" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default{
  mounted() {
    this.dialogShow = true
  },
  data() {
    return {
      directList: [],
      withdrawReason: [],
      changeStatus: [],
      dialogQuery: '',
      dialogShow: false,
      isCanSearch: true
    }
  },
  props: {
    dialogLabel: {
      type: String,
      require: false
    },
    dialogTitle: {
      type: String,
      require: false
    },
    selectDataId: {
      type: String,
      required: true
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      if (this.dialogTitle === '分配数据') {
        this.$http.post('auth_getSecondDirectOption').then(res => {
          if (res.data) {
            this.directList = res.data.directList
          }
        }).catch(console.log)
      } else {
        this.$http.post('auth_getResumeHandleOption').then(res => {
          if (res.data) {
            if (this.dialogTitle === '抽回数据') {
              this.withdrawReason = res.data.withdrawReason
            } else {
              this.changeStatus = res.data.changeStatus
            }
          }
        }).catch(console.log)
      }
    },
    submit() {
      if (!this.dialogQuery) {
        this.$message.error('没有可以提交的内容！')
        return false
      }
      this.isCanSearch = false
      if (this.dialogTitle === '分配数据') {
        this.$http.post('resume_allot', {
          resumeIds: this.selectDataId,
          hrIds: this.dialogQuery
        }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.$emit('change-refresh-getlist')
            this.dialogShow = false
          }
        }).catch(console.log).finally(() => {
          this.isCanSearch = true
        })
      } else if (this.dialogTitle === '抽回数据') {
        this.$http.post('resume_revulsion', {
          resumeIds: this.selectDataId,
          resumeRevulsionId: this.dialogQuery
        }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.$emit('change-refresh-getlist')
            this.dialogShow = false
          }
        }).catch(console.log).finally(() => {
          this.isCanSearch = true
        })
      } else {
        this.$http.post('resume_updateStatus', {
          resumeIds: this.selectDataId,
          resumeStatus: this.dialogQuery
        }).then(res => {
          if (res.data) {
            this.$message.success(res.message)
            this.$emit('change-refresh-getlist')
            this.dialogShow = false
          }
        }).catch(console.log).finally(() => {
          this.isCanSearch = true
        })
      }
    }
  }
}
</script>
