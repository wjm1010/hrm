<template>
  <!-- 命令行生成的模板 -->
  <div class="main" v-if="noHidden">
    <h3 style="color: #525E71">课程老师</h3>
    <el-carousel trigger="click" height="280px" :autoplay="false">
      <el-carousel-item v-for="(key, index) in infoArray" :key="index">
        <el-row type="flex" :gutter="20" class="body">
          <el-col :span="8" v-for="(item, index2) in key" :key="index2">
            <div class="panel clearfix">
              <div class="left panelName">
                <div class="course">
                  {{item.subject_name}}
                </div>
                <div>
                  <p>
                    <el-rate
                      v-model="item.scoreAvg"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                  </p>
                  <p class="satisfaction">
                    满意度：<i>{{Math.round(item.scoreAvg*20*10)/10}} %</i>
                  </p>
                </div>
              </div>
              <div class="left panelInfo">
                <ul>
                  <li>
                    <el-button
                      style="color:#525e71;cursor: initial"
                      type="text">
                      {{item.name}}
                    </el-button>
                    <template v-if="item.phone">
                      <span style="margin-left: 5px">
                        {{item.phone}}
                      </span>
                    </template>
                    <CommitDetailDialog
                      :fixDialog="fixDialog"
                      :studentInfo = "studentInfo"
                      :isStudent="isStudent"
                      :teacherId="item.teacher_id"
                      :phone="item.phone">
                    </CommitDetailDialog>
                  </li>
                  <li>微信号：{{item.weixin_id}}</li>
                  <li>
                    <span>
                      <i v-if="item.sex==='1'">男</i>
                      <i v-else>女</i>
                    </span>
                    <span>
                      {{item.teachDepartment}}
                    </span>
                  </li>
                  <li>
                    <span>学历：
                      <i v-if="item.educational==='1'">大专</i>
                      <i v-else-if="item.educational==='2'">本科</i>
                      <i v-else-if="item.educational==='3'">研究生</i>
                      <i v-else-if="item.educational==='4'">硕士</i>
                      <i v-else>博士</i>
                    </span>
                    <span>
                      <i v-if="item.college_type==='1'">985</i>
                      <i v-else-if="item.college_type==='2'">211</i>
                      <i v-else>其他</i>
                    </span>
                  </li>
                  <li>
                    所在省份：{{item.province}}
                  </li>
                  <li>
                    上课风格：{{item.instruction_type}}
                  </li>
                  <li class="margin-right-0">
                    <el-popover trigger="hover" placement="top" v-if="item.external_introduction.length>30" width="300">
                      <span>{{item.external_introduction}}</span>
                      <div slot="reference" class="name-wrapper">
                        <span>对外简介：{{item.external_introduction.slice(0,30)}}...</span>
                      </div>
                    </el-popover>
                    <span v-else>对外简介：{{item.external_introduction}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  export default {
    name: 'detail-classTeacher',
    components: {
      CommitDetailDialog
    },
    data() {
      return {
        isStudent: false,
        noHidden: true,
        infoArray: [],
        info: []
      }
    },
    props: {
      rosterId: {
        required: true
      },
      studentId: {
        required: true
      },
      studentInfo: {
        required: true
      },
      fixDialog: Object,
      indexInit: Function
    },
    computed: {
      ...mapGetters(['name', 'userId', 'getPhone'])
    },
    created() {
      this.obtainInfo()
    },
    mounted() {
    },
    methods: {
      obtainInfo() {
        this.$http.get('student_getTeacherInfo', {
          params: {
            studentIntentionId: this.rosterId
          }
        }).then(res => {
          if (res.data) {
            if (!res.data.info || !res.data.info.length) {
              this.noHidden = false
              return false
            }
            var result = []
            this.info = res.data.info
            for (var i = 0; i < this.info.length; i += 3) {
              result.push(this.info.slice(i, i + 3))
            }
            this.infoArray = result
            this.info.forEach(item => {
              item.scoreAvg = parseFloat(item.scoreAvg) / 20
            })
          }
        }).catch(console.log)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../../styles/roster/detail/classTeacher'
</style>
