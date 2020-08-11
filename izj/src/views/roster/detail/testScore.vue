<template>
  <!-- 命令行生成的模板 -->
  <div class="main2">
    <h3 style="color: #525E71">考试成绩</h3>
    <el-button type="primary" class="add-button" @click="handleAdd">+新增考试成绩</el-button>
    <el-carousel v-if="isHaveData" trigger="click" :autoplay="false">
      <el-carousel-item v-for="(key, index) in infoArray" :key="index">
        <el-row type="flex" :gutter="20" class="body">
          <el-col :span="6" v-for="(item, index2) in key" :key="index2">
            <div class="panel clearfix">
              <el-button type="primary" class="edit-button" @click="handleEdit(item.examId)">编辑</el-button>
              <div class="header">
                <span class="subject-name">{{item.subjectName}}</span>
                <span class="margin-let-10">{{item.typeName}}</span>
                <div class="subject-score">
                  <span>
                  <el-popover trigger="hover" placement="top" v-if="item.score.length>4">
                    <span>{{item.score}}</span>
                    <span slot="reference" class="name-wrapper">
                      <span>{{item.score.slice(0,3)}}..</span>
                    </span>
                  </el-popover>
                  <span v-else>{{item.score}}</span>
                  /
                  <span v-if="item.scoreTotal">
                    <el-popover trigger="hover" placement="top" v-if="item.scoreTotal.length>4">
                    <span>{{item.scoreTotal}}</span>
                    <span slot="reference" class="name-wrapper">
                      <span>{{item.scoreTotal.slice(0,3)}}..</span>
                    </span>
                    </el-popover>
                    <span v-else>{{item.scoreTotal}}</span>
                  </span>
                  <span v-else>未知</span>
                </span>
                </div>
              </div>

              <ul class="body">
                <li style="margin-bottom: 10px">
                  <span v-if="item.remark">
                    <el-popover trigger="hover" placement="top" v-if="item.remark.length>15">
                    <div>{{item.remark}}</div>
                    <div slot="reference" class="name-wrapper space-nowrap">
                      <div>{{item.remark}}</div>
                    </div>
                  </el-popover>
                  <div v-else>{{item.remark}}</div>
                  </span>
                  <span v-else class="no-data">（暂无数据）</span>
                </li>
                <li>考试日期：<span v-if="item.examDate">{{item.examDate}}</span><span v-else class="no-data">（暂无数据）</span>
                </li>
                <li>班级排名：
                  <span v-if="item.classRank">
                    <el-popover trigger="hover" placement="top" v-if="item.classRank.length>13">
                    <span>{{item.classRank}}</span>
                    <span slot="reference" class="name-wrapper">
                      <span>{{item.classRank.slice(0,10)}}...</span>
                    </span>
                    </el-popover>
                    <span v-else>{{item.classRank}}</span>
                  </span>
                  <span v-else class="no-data">（暂无数据）</span>
                </li>
                <li>年级排名：
                  <span v-if="item.gradeRank">
                    <el-popover trigger="hover" placement="top" v-if="item.gradeRank.length>13">
                    <span>{{item.gradeRank}}</span>
                    <span slot="reference" class="name-wrapper">
                      <span>{{item.gradeRank.slice(0,10)}}...</span>
                    </span>
                    </el-popover>
                    <span v-else>{{item.gradeRank}}</span>
                  </span>
                  <span v-else class="no-data">（暂无数据）</span>
                </li>
                <li>更新角色：<span v-if="item.userCodeName">{{item.userCodeName}}</span><span v-else class="no-data">（暂无数据）</span></li>
                <li>是否进步：<span v-if="item.progress">{{item.progress}}</span><span v-else class="no-data">（暂无数据）</span></li>
              </ul>
              <div class="footer">
                <el-button type="primary" class="look-phone" v-if="item.photoExist === '20'"
                           @click="handleLook(item.examId)">查看试卷照片（{{item.photoNums}}张）
                </el-button>
                <el-button type="info" class="look-phone" v-else disabled>暂无试卷图片</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
    <div v-if="!isHaveData">暂无数据</div>

    <lookPictureDialog
      :rosterId="rosterId"
      :examId="examId"
      v-if="isPictureDialogShow"
      :isShow.sync="isPictureDialogShow">
    </lookPictureDialog>
    <addEditTestScoreDialog
      :isEdit="isEdit"
      :obtainInfo="obtainInfo"
      :rosterId="rosterId"
      :examId="examId"
      v-if="isAddEditDialogShow"
      :isShow.sync="isAddEditDialogShow">
    </addEditTestScoreDialog>
  </div>
</template>

<script>
  import lookPictureDialog from '../dialog/lookPictureDialog'
  import addEditTestScoreDialog from '../dialog/addEditTestScoreDialog'

  export default {
    name: 'test-score',
    components: {
      lookPictureDialog,
      addEditTestScoreDialog
    },
    props: ['rosterId'],
    data() {
      return {
        isHaveData: false,
        isPictureDialogShow: false,
        isAddEditDialogShow: false,
        isEdit: true,
        examId: '',
        infoArray: []
      }
    },
    created() {
      this.obtainInfo()
    },
    methods: {
      examGetList() {
        return this.$http.get('exam_getList', {
          params: {
            studentIntentionId: this.rosterId
          }
        })
      },
      async obtainInfo() {
        try {
          const { data } = await this.examGetList()
          if (!data) return
          if (data.list.length === 0) return
          data.list.forEach(obj => {
            if (obj.progress === '1') {
              obj.progress = '是'
            } else if (obj.progress === '2') {
              obj.progress = '否'
            } else {
              obj.progress = '无变化'
            }
          })
          const result = []
          for (let i = 0, len = data.list.length; i < len; i += 4) {
            result.push(data.list.slice(i, i + 4))
          }
          this.infoArray = result
          this.isHaveData = true
        } catch (e) {
          console.error(e)
        }
      },
      handleEdit(examId) {
        this.isEdit = true
        this.examId = examId
        this.isAddEditDialogShow = true
      },
      handleAdd() {
        this.isEdit = false
        this.examId = ''
        this.isAddEditDialogShow = true
      },
      handleLook(examId) {
        this.examId = examId
        this.isPictureDialogShow = true
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/testScore.sass'
</style>

<style lang="sass">
  .main2
    .el-carousel__indicators
      display: none
    .el-carousel__container
      height: 395px
</style>
