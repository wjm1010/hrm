<template>
  <el-menu class="navbar" mode="horizontal" :class="{'no-sidebar-navbar-width':!sidebar.opened}">

    <div class="right-menu">

      <div class="searchContent">
        <span v-if="callMessage.min" style="font-size: 14px;display: inline-block">
          <span style="margin-right: 10px">今日通话：<span style="color: #0099FF">{{callMessage.min}}</span>min<span
            style="color: #0099FF">{{callMessage.sec}}</span>s</span>
          <span style="margin-right: 10px">今日通次：<span>{{callMessage.total}}次</span></span>
        </span>

        <span class="go-dashboard">
          <template v-if="callStatus === '1'">
            <i class="green-round" v-if="isNoOtherSignUp"></i>
            <el-button type="text" class="el-icon-error red-round" v-if="!isNoOtherSignUp"></el-button>
          </template>
          <el-button type="text" @click="$router.push('/dashboard')" v-if=" Object.keys(visitGetTotal)">待回访：{{visitGetTotal.total}}</el-button>
        </span>

        <el-input :placeholder="searchPlaceHolder" class="input-with-select" v-model.trim="query.kw" clearable>
          <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 110px" @change="selectChange">
            <el-option label="搜索学员" value="1"></el-option>
            <el-option label="拨打" value="2" v-if="callStatus ==='1'"></el-option>
          </el-select>
          <el-button v-if="select === '1'" slot="append" icon="el-icon-search" @click="inquire" :disabled="!canSearch"></el-button>
          <el-button @click="callPhone" v-else slot="append" :disabled="!isCanCallPhone">
            <img :src="phoneIcon">
          </el-button>
          <div class="searchList" v-show="list" slot="prepend">
            <li v-show="haveListData" v-for="item in searchList" :key="item.value"
                @click="nameLists(item.text,item.value)">{{item.text}}
            </li>
            <div v-show="!haveListData" class="no-data-message">暂无数据</div>
          </div>
        </el-input>

        <div class="name-and-phone">
          <div class="name-and-phone-body">
            <span>{{name}}</span>
            <el-button type="text" @click="editCallPhone = true">{{bindPhone}}</el-button>
          </div>
        </div>

        <bind-call-phone title="请绑定呼叫号码" v-if="isBind === '1'"></bind-call-phone>
        <bind-call-phone title="修改呼叫号码" :is-edit.sync="editCallPhone" v-if="bindPhone"></bind-call-phone>

        <div callIdAttr="call-phone-dialog" class="avatar-container right-menu-item" @click="$router.push('/personalInfo/index')">
          <div class="avatar-wrapper">
            <svg-icon icon-class="girl" class="user-avatar" v-if="sex!==1"></svg-icon>
            <svg-icon icon-class="boy" class="user-avatar" v-else></svg-icon>
          </div>
        </div>

      </div>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getUserInfoByCallPhone } from '@/utils/getInfoMethods'
  import phoneIcon from '@/assets/detail_images/phone.png'
  import { isvalidUsername } from '@/lib/validate.js'
  import bindCallPhone from '@/components/bindCallPhone'
  import { setToken } from '@/utils/auth'

  export default {
    components: {
      bindCallPhone
    },
    data() {
      return {
        phoneIcon,
        isCanCallPhone: true,
        editCallPhone: false,
        query: {
          kw: ''
        },
        callMessage: {
          min: '',
          sec: '',
          total: ''
        },
        searchPlaceHolder: '姓名/手机号/学生编号',
        select: '1',
        isNoOtherSignUp: true,
        canSearch: true,
        list: false,
        searchList: [],
        nameList: '',
        haveListData: false
      }
    },
    mounted() {
      document.addEventListener('click', this.hideList)
      this.init()
    },
    destroyed() {
      document.removeEventListener('click', this.hideList)
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'sex',
        'userId',
        'avatar',
        'callStatus',
        'visitGetTotal',
        'bindPhone',
        'isBind'
      ])
    },
    methods: {
      // 通话时长，通话次数
      getCallDuration() {
        return this.$http.get('student_todayCallDuration')
      },
      getCallTotal() {
        return this.$http.get('student_todayCallTotal')
      },
      async init() {
        const [durationData, totalData] = await Promise.all([this.getCallDuration(), this.getCallTotal()])
        if (durationData.data && totalData.data) {
          this.callMessage.min = durationData.data.min
          this.callMessage.sec = durationData.data.sec
          this.callMessage.total = totalData.data[0].total
        }
      },
      inquire() {
        this.canSearch = false
        this.$http.post('index_searchUser', {
          kw: this.query.kw
        }).then(res => {
          if (res.data) {
            if (res.data.length) {
              this.haveListData = true
            } else {
              this.haveListData = false
            }
            this.list = true
            this.searchList = res.data
          } else {
            this.haveListData = false
            this.$message.warning('没有符合要求的数据！')
          }
        }).catch(error => {
          console.log(error)
          this.haveListData = false
        }).finally(() => {
          this.canSearch = true
        })
      },
      nameLists(text, value) {
        this.query.kw = text
        this.list = false
        if (value) {
          this.$eventBus.$emit('show-no-permission-dialog', value)
        } else {
          this.$message.error('系统错误！')
        }
      },
      hideList() {
        this.list = false
      },
      callPhone() {
        if (!isvalidUsername(this.query.kw)) {
          return this.$message.error('手机号格式错误')
        }
        const userinfo = getUserInfoByCallPhone()
        if (userinfo && userinfo.unFinishCallStudentIntentionId) {
          this.$message.error(`您刚才对${userinfo.studentName}（${userinfo.studentNo}）的电话还未添加沟通记录，请填写并保存沟通记录后再继续其它操作`)
          return false
        }
        this.isCanCallPhone = false

        this.$http.post('call_index', {
          businessUid: this.userId,
          callType: 3,
          phone: this.query.kw
        }, { remote: 'iCP', disableTime: 5 }).then(({ data } = {}) => {
          if (!data || data.isStudent !== '1') return
          this.$message.success('呼叫成功')
          const {
            studentIntentionId: unFinishCallStudentIntentionId,
            callPhone: phone,
            serial_number: serialNumber,
            parent_relationship: phoneName,
            name: studentName,
            student_no: studentNo
          } = data.callTypeData
          const userInfo = {
            unFinishCallStudentIntentionId,
            unFinishCallId: data.call_id,
            phoneName,
            phone,
            studentName,
            studentNo,
            serialNumber
          }
          setToken('user_info_local', JSON.stringify(userInfo))
          this.$eventBus.$emit('clearCallSetTimeOut')
          this.$eventBus.$emit('startCallSetTimeOut')
          this.$router.push(`/roster/detail/${unFinishCallStudentIntentionId}`)
          this.$eventBus.$emit(`${unFinishCallStudentIntentionId}callLocal`)
        }).catch(console.log).finally(() => {
          this.isCanCallPhone = true
        })
      },
      selectChange(val) {
        if (val === '1') {
          this.searchPlaceHolder = '姓名/手机号/学生编号'
        } else if (val === '2') {
          this.searchPlaceHolder = '手机号'
        }
        this.query.kw = ''
        this.searchList = []
        this.list = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    width: calc(100% - 180px);
    z-index: 301;
    position: fixed;
    .right-menu {
      height: 100%;
      position: absolute;
      right: 5px;
      &:focus {
        outline: none;
      }
      .searchContent {
        .go-dashboard {
          display: inline-block;
          .el-button--text {
            color: #000000 !important;
          }
        }
        .red-round {
          color: #F56C6C;
          font-size: 12px;
        }
        .green-round {
          background-color: #56E26D;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          display: inline-block;
        }
        .input-with-select {
          position: relative;
          top: 0;
          width: 355px !important;
        }
        .name-and-phone {
          position: relative;
          display: inline-block;
          top: -8px;
          line-height: 35px;
          height: 35px;
          margin-top: -10px;
          padding: 0;
          .name-and-phone-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            span {
              font-size: 14px;
              line-height: 5px;
              padding: 0;
            }
          }
        }
        .searchList {
          position: absolute;
          width: 187px;
          left: 110px;
          top: 38px;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          border-top: 0;
          background: #fff;
          z-index: 222;
          text-align: left;
          padding: 3px 20px;
        }
        li {
          cursor: pointer;
          line-height: 30px;
        }
        li:hover {
          color: red
        }
      }
      .right-menu-item {
        display: inline-block;
        margin: 0;
      }
      .avatar-container {
        .avatar-wrapper {
          cursor: pointer;
          position: relative;
          .user-avatar {
            width: 2em;
            position: relative;
            height: 2em;
            top: 10px;
          }
        }
      }
    }
  }

  .no-sidebar-navbar-width {
    width: calc(100% - 54px);
  }

  .no-data-message {
    text-align: center;
    color: #606266;
  }
</style>
