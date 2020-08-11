<template>
    <div>
			<el-dialog
				@close="closeDialog"
        :visible.sync="showDialog.show"
				custom-class="el-dialog-md"
				:append-to-body="true"
        :loading="loading"
				width="55%">
				<p slot="title" class="dialog-title">
					<b>添加课后进步变化反馈</b>
				</p>
				<div class="dialog-padding">
					<p>家长对成绩变化的感受：</p>
					<expand-table
						:rows="rows"
						:loading="loading"
						:columns="columns"
						:slot-name-arr="slotNameArr">
						
            <template slot="currPlan" slot-scope="scope">
							<p
                v-for="(item, index) in scope.row['currPlan']"
                :key="index"
                v-text="item.currPlanName"
                style="margin: 0; padding: 0">
							</p>
						</template>

						<template slot="feeling" slot-scope="scope">
							<el-radio-group v-model="scope.row['feeling']">
								<el-radio label="1">未反馈</el-radio>
								<el-radio label="2">明显退步</el-radio>
								<el-radio label="3">变化不大</el-radio>
								<el-radio label="4">明显进步</el-radio>
							</el-radio-group>
						</template>
					</expand-table>

					<div class="rank-padding">
						<p class="float-left">备注：</p>
						<div class="float-left">
							<el-input 
								type="textarea" 
								v-model="remark" 
								class="width-500"
								:maxlength="300"
								:autosize="{minRows: 5, maxRows: 8}"
								placeholder="家长对老师有任何建议、意见，均可以在此填写。（限300字）">
							</el-input>
						</div>						
					</div>					
				</div><br>
				<p class="message-padding">以上信息将直接反馈至教学组，用于提升老师的教学质量</p>
				<div style="float: right">
					<el-button type="primary" @click="submit">确定</el-button>
				</div>     
			</el-dialog>
		</div>
</template>
<script>
import ExpandTable from '@/components/ExpandTable'
export default {
  components: {
    ExpandTable
  },
  props: {
    showDialog: {
      required: true
    },
    rosterId: {
      required: true
    },
    indexInit: Function
  },
  data() {
    return {
      remark: '',
      columns: [
        { 'value': 'currPlan', 'text': '近30天在读课程', width: '120' },
        { 'value': 'subjectName', 'text': '科目', width: '100' },
        { 'value': 'feeling', 'text': '家长主观感受' }
      ],
      rows: [],
      slotNameArr: ['feeling', 'currPlan'],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.get('scoreFeedback_formData', {
        params: {
          studentIntentionId: this.rosterId
        }
      }).then(res => {
        if (res.data.list && res.data.list.length) {
          this.rows = res.data.list
          this.remark = res.data.remark
        } else {
          this.$message.warning('该学生近30天没有在读课程')
        }
      }).catch(console.log).finally(() => {
        this.loading = false
      })
    },
    closeDialog() {
      this.showDialog.canShow = false
      this.showDialog.show = false
      this.indexInit(true)
    },
    submit() {
      this.$http.post('console_submitFormData', {
        studentIntentionId: this.rosterId,
        recordId: this.showDialog.commtRecord,
        remark: this.remark,
        list: this.rows
      }).then(res => {
        if (res.data) {
          this.closeDialog()
          this.indexInit(true)
        }
      }).catch(console.log)
    }
  }
}
</script>
<style lang="sass" scoped>
.dialog-title
	border-bottom: 1px solid #666
	padding-bottom: 5px
	margin: 0
.content-padding
	padding-left: 25px
.dialog-footer
	float: right
.message-padding
	padding: 30px 0 30px 30px
.dialog-padding
	padding-left: 30px 	
	.rank-padding
		padding: 50px 0 100px
		.float-left
			float: left
			.width-500
				width: 600px	
</style>



