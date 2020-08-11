<template>
  <!-- 命令行生成的模板 -->
  <div class="main">
    <div>
      <ul class="left-list">
        <li
          v-for="(item,index) in listData"
          :key="index"
          @click="item.clickEvent"
        >
          <template v-if="item.iconFont">
            <i :class="item.iconFont" class="icon-gray"></i>
          </template>
          <template v-else>
            <svg-icon :icon-class="item.svg" class="icon-gray"></svg-icon>
          </template>
          <br/>
          <span v-if="index===0" class="height-color">{{item.text}}</span>
          <span v-else>{{item.text}}</span>
        </li>
      </ul>
    </div>

    <el-dialog
      :visible.sync="dialog.addClients.show"
      :append-to-body="true"
      custom-class="el-dialog-md"
      class="dialog-add-clients">
      <h2 class="title"><i class="el-icon-warning"></i>注意</h2>
      <div class="content" v-loading="loading">
        <b class="color-blue">学生{{studentInfo.name}}</b>
        <span>的号码</span>
        <b class="color-blue">{{studentInfo.phone}}</b>
        <span>将开通海风智学中心账号。</span>
        <div style="color: #FF0000">密码默认为hfjy+手机号后四位</div>
      </div>
      <div slot="footer">
        <el-button
          @click="dialog.addClients.submitEvent"
          type="primary"
          class="dialog-submit"
          :disabled="!canSearch">确定
        </el-button>
        <el-button
          @click="dialog.addClients.show=false">取消，先沟通
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'detail-operating',
    data() {
      return {
        leftList: {
          complement: { iconFont: 'el-icon-edit-outline', text: '补全资料', clickEvent: this.materialBtnEvent },
          audition: { svg: 'book', text: '申请试听课', clickEvent: this.trialLessonBtnEvent },
          openClient: { svg: 'addClients', text: '开通客户端', clickEvent: this.openClientBtnEvent },
          knowledge: { iconFont: 'el-icon-search', text: '知识库搜索', clickEvent: this.knowledgeSearch },
        },
        listData: [],
        dialog: {
          addClients: {
            title: '开通客户通',
            show: false,
            submitEvent: this.addClientsSubmitEvent
          }
        },
        loading: false,
        canSearch: true,
      }
    },
    props: {
      indexInit: {
        type: Function,
        required: true
      }
    },
    computed: {
      ...mapGetters(['rosterId', 'studentInfo'])
    },
    created() {
      this.init()
    },
    methods: {
      getMenus() {
        return this.$http.get('recycle_getMenus', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      async init() {
        try {
          const { data } = await this.getMenus()
          if (!data) return
          this.listData = data.map((val) => {
            return this.leftList[val]
          })
        } catch (e) {
          console.error(e)
        }
      },
      materialBtnEvent() {
        const judge = '0'
        this.$router.push(`/roster/material/${this.rosterId}/${judge}`)
      },
      // 申请试听课
      trialLessonBtnEvent() {
        if (this.rosterId) {
          if (!this.studentInfo.sex) {
            this.$message.warning('请完善学生性别')
            return
          }
          if (!this.studentInfo.country_id || !this.studentInfo.city_id || !this.studentInfo.province_id) {
            this.$message.warning('学生的所在区域必须精确到区/县，请完善')
            return
          }
          window.open(`${window.location.origin}#/roster/lessonplanorderCreate/${this.rosterId}`)
        } else {
          this.$message.error('没有rosterId')
        }
      },
      // 开通客户端
      openClientBtnEvent() {
        this.dialog.addClients.show = true
      },
      knowledgeSearch() {
        this.$router.push(`/roster/knowledge`)
      },
      getStudentOpenClient() {
        return this.$http.get('student_openClient', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      addClientsSubmitEvent() {
        if (this.canSearch) {
          this.canSearch = false
          this.loading = true
          this.getStudentOpenClient().then(res => {
            if (res.data) {
              this.$message.success('开通成功')
              this.dialog.addClients.show = false
              this.indexInit(true)
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.canSearch = true
            this.loading = false
          })
        } else {
          this.$message.warning('操作频繁')
        }
      },
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/accessList/detail/operating.sass'
</style>

