<template>
  <!-- 命令行生成的模板 -->
  <div class="main class-techer-new" v-if="noHidden">
    <Panel
      title="课程老师"
      kind="classTeacher"
    >
      <template slot="list">
        <el-carousel trigger="click" height="360px" :autoplay="false">
          <el-carousel-item v-for="(key, index) in infoArray" :key="index">
            <el-row type="flex" :gutter="20" class="body">
              <el-col :span="8" v-for="(item, index2) in key" :key="index2">
                <div class="panel">
                  <div class="top">
                    <div class="panelName">
                      <div class="course">
                        <span>{{item.subject_name | firstPart}}</span>
                        <span>{{item.subject_name | lastPart}}</span>
                      </div>
                      <div>
                        <p class="teacher-rate">
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
                    <div class="panelInfo">
                      <ul>
                        <li class="name">
                          <span>{{item.name}}</span>
                          <span>
                            <i v-if="item.sex==='1'">男</i>
                            <i v-else>女</i>
                          </span>
                        </li>
                        <li>
                          <template v-if="item.phone">
                            <span>
                              {{item.phone}}
                            </span>
                          </template>
                          <CommitDetailDialog
                            :phoneIconStyle = "{height: '20px', width: '20px' }"
                            :fixDialog="fixDialog"
                            :studentInfo = "studentInfo"
                            :isStudent="isStudent"
                            :teacherId="item.teacher_id"
                            :phone="item.phone">
                          </CommitDetailDialog>
                        </li>
                        
                        <li class="team">
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :disabled="item.teachDepartment.length<=7"
                            :content="item.teachDepartment">
                            <span slot="reference">
                              组别：{{item.teachDepartment.length > 7 ? `${item.teachDepartment.slice(0, 7)}...` : item.teachDepartment }}
                            </span>
                        </el-popover>
                        </li>
                        <li>
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :disabled="item.weixin_id.length<=7"
                            :content="item.weixin_id">
                              <span slot="reference">
                                微信号：{{item.weixin_id.length > 7 ? `${item.weixin_id.slice(0, 7)}...` : item.weixin_id }}
                              </span>
                            </el-popover>
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
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :disabled="item.province.length<=7"
                            :content="item.province">
                              <span slot="reference">
                                地区：{{item.province.length > 7 ? `${item.province.slice(0, 7)}...` : item.province }}
                              </span>
                            </el-popover>
                        </li>
                        <li>
                          <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :disabled="item.instruction_type.length<=7"
                            :content="item.instruction_type">
                              <span slot="reference">
                                风格：{{item.instruction_type.length > 7 ? `${item.instruction_type.slice(0, 7)}...` : item.instruction_type }}
                              </span>
                            </el-popover>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="summary">
                    {{item.external_introduction}}
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-carousel-item>
        </el-carousel>
      </template>
    </Panel>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import CommitDetailDialog from '../dialog/commitDetailDialog.vue'
  import Panel from '../components/component/panel'
  
  export default {
    name: 'detail-classTeacher',
    components: {
      CommitDetailDialog,
      Panel
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
    filters: {
      firstPart: function(value) {
        if (!value) return ''
        value = value.toString()
        return value.substr(0, 2)
      },
      lastPart: function(value) {
        if (!value) return ''
        value = value.toString()
        return value.substr(2, 2)
      }
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
  @import '../../../styles/student/detail/classTeacher'
</style>
