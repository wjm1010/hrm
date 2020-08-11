<template>
	<div>
		<h3 class="float-left">消息记录</h3>
    <el-button type="text" class="float-right" @click="dialogShow = true">发送消息</el-button>

		<ExpandTable
      :pagination="paging"
      @get-list="getList"
			:loading="loading"
			:rows="rows"
			:columns="columns">
		</ExpandTable>

    <el-dialog title="信息回复"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialogEvent"
      custom-class="el-dialog-md">
      <el-form label-width="100px">
        <el-form-item label="发送内容"  class="padding-right-40">
          <el-input v-model.trim="content" type="textarea" :maxlength="500" placeholder="请输入内容，最多500字" :rows="8"></el-input>          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogEvent">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="!canSearch">提 交</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
import ExpandTable from '@/components/ExpandTable'
import { mapGetters } from 'vuex'
export default {
  name: 'messageRecord',
  components: {
    ExpandTable
  },
  props: {
    strategyId: {
      required: true
    }
  },
  data() {
    return {
      columns: [
        { 'value': 'content', 'text': '消息内容' },
        { 'value': 'send_user_name', 'text': '填写人' },
        { 'value': 'create_time', 'text': '填写日期' },
        { 'value': 'type_name', 'text': '事因' }
      ],
      rows: [],
      loading: false,
      dialogShow: false,
      content: '',
      canSearch: true,
      paging: {
        totalRows: '0',
        page: '1',
        pageSize: '10'
      }
    }
  },
  computed: {
    ...mapGetters(['userId', 'name'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.get('courseApplication_messageRecord', {
        params: {
          strategyId: this.strategyId
        },
        paging: this.paging
      }).then(res => {
        if (res.data) {
          if (!res.data.list || res.data.list.length === 0) {
            this.rows = []
            this.paging.totalRows = '0'
            return false
          }
          this.rows = res.data.list
          this.paging.totalRows = res.data.paging.dataCount
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    closeDialogEvent() {
      this.dialogShow = false
      this.content = ''
    },
    // 发送短信
    submit() {
      this.canSearch = false
      this.$http.post('courseApplication_saveMessage', {
        strategyId: this.strategyId,
        content: this.content,
        userId: this.userId,
        userName: this.name,
        type: '2'
      }).then(res => {
        if (res.data) {
          this.$message.success(res.message)
          this.getList()
        }
      }).catch(console.log).finally(() => {
        this.dialogShow = false
        this.canSearch = true
      })
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../styles/lessonplanDetails/detail/messageRecord.sass'
</style>


