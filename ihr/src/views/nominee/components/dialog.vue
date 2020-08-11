<template>
  <el-dialog
    :loading="loading"
    :visible.sync="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="el-dialog-sl"
    title="分配数据"
    @close="$emit('closeEv')">
    <el-form>
      <el-form-item label="请选择分配后的跟进人：">
        <el-select v-model="dialogQuery" clearable filterable placeholder="请选择" multiple
            collapse-tags>
          <el-option
            v-for="item in dialogOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
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
  import { mapGetters } from 'vuex'
  export default{
    mounted() {
      this.dialogShow = true
    },
    data() {
      return {
        dialogOptions: [],
        dialogQuery: [],
        dialogShow: false,
        isCanSearch: true,
        loading: false
      }
    },
    props: {
      selectDataId: {
        type: String,
        required: true
      }
    },
    created() {
      this.getOptions()
    },
    computed: {
      ...mapGetters(['userId', 'userRole', 'userLevel'])
    },
    methods: {
      getOptions() {
        this.loading = true
        this.$http.post('auth_getSecondDirectOption', {
          userPid: this.userRole === '2' && this.userLevel === '2' ? this.userId : '',
          type: 'allot'
        }).then(res => {
          if (res.data) {
            this.dialogOptions = res.data.directList
          }
        }).catch(console.log).finally(() => {
          this.loading = false
        })
      },
      submit() {
        if (this.dialogQuery.length === 0) {
          this.$message.error('没有可以提交的内容！')
          return false
        }
        this.isCanSearch = false
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
      }
    }
  }
</script>
