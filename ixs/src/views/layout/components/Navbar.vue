<template>
  <el-menu class="navbar" mode="horizontal" :class="{'no-sidebar-navbar-width':!sidebar.opened}">
    <div class="right-menu">
      <div class="searchContent">
        <span class="totalNum-color" v-if="canUseOc === '1'">
          <el-popover
            placement="top-start"
            trigger="hover">
            <span style="color: #666666">{{query.totalNum.newNameDetailFirst}}</span>
            <b :class="statusColor">{{query.totalNum.newNameDetailSecond}}</b>
            <p slot="reference" style="color: #0099FF;font-size: 14px;font-weight: bold;margin-left: 10px">{{query.totalNum.newNameTitle}}</p>
          </el-popover>
        </span>
        <el-button type="primary" round @click="btnAccessList" v-if="canUseOc === '1'" class="accessList-margin">获取名单</el-button>
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
            <li v-show="haveListData" v-for="item in searchList" :key="item.value" @click="nameLists(item.text,item.value)">{{item.text}}</li>
            <div v-show="!haveListData" class="no-data-message">暂无数据</div>
          </div>
        </el-input>

        <span class="go-dashboard">
          <template v-if="callStatus === '1'">
            <i class="green-round"></i>
          </template>
        </span>

        <div class="name-and-phone">
          <div class="name-and-phone-body">
            <span>{{name}}</span>
            <el-button type="text" @click="editCallPhone = true">{{bindPhone}}</el-button>
          </div>
        </div>

        <bind-call-phone title="请绑定呼叫号码" v-if="isBind === '1'"></bind-call-phone>
        <bind-call-phone title="修改呼叫号码" :is-edit.sync="editCallPhone" v-if="editCallPhone && bindPhone"></bind-call-phone>

        <div class="avatar-container right-menu-item" @click="$router.push('/personalInfo/index')" callIdAttr="call-phone-dialog">
          <div class="avatar-wrapper">
              <svg-icon icon-class="girl"  class="user-avatar" v-if="sex!==1"></svg-icon>
              <svg-icon icon-class="boy" class="user-avatar" v-else></svg-icon>
          </div>
        </div>
        <img src="../../../assets/homePageImg/help.png" alt="" class="help" @click="$router.push('/help/index')">
      </div>
    </div>

    <div
      v-if="callStatus === '1'">
      <el-dialog
        v-if="singleMessage.nameType === 'new'"
        title="提示"
        width="35%"
        :visible.sync="dialogShow"
        :append-to-body="true"
        :close-on-click-modal="false">
        <span class="dialg-font-pos">
          即将获取新名单，并且系统将在
          <span style="color: red">10秒后</span>
          自动拨通<br>此名单电话号码，您是否已做好沟通准备
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="routerJump">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-else>
      <el-dialog
        title="提示"
        width="35%"
        :visible.sync="dialogShow"
        :append-to-body="true"
        :close-on-click-modal="false">
        <span class="dialg-font-pos">
          您当前账户没有开通呼叫功能，暂不能使用该服务，请绑定坐席账号后再使用，谢谢
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
        </span>
      </el-dialog>
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
      singleMessage: {
      },
      query: {
        kw: '',
        totalNum: {}
      },
      searchPlaceHolder: '手机号/学生编号',
      select: '1',
      list: false,
      searchList: [],
      nameList: '',
      haveListData: false,
      canSearch: true,
      dialogShow: false // 获取名单弹框
    }
  },
  created() {
    this.getNewNameTotal()
  },
  mounted() {
    this.$eventBus.$on('get-newName-total', this.getNewNameTotal) // 获取新名单数量
    document.addEventListener('click', this.hideList)
  },
  destroyed() {
    document.removeEventListener('click', this.hideList)
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'sex',
      'avatar',
      'callStatus',
      'canUseOc',
      'bindPhone',
      'isBind',
      'userId'
    ]),
    statusColor() {
      if (this.query.totalNum.newNameStatus === '2') {
        return 'classB'
      } else if (this.query.totalNum.newNameStatus === '3') {
        return 'classC'
      } else if (this.query.totalNum.newNameStatus === '4') {
        return 'classD'
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    inquire() {
      this.canSearch = false
      this.$http.post('index_searchUser', { kw: this.query.kw }).then(res => {
        this.canSearch = true
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
      }).catch((res) => {
        this.canSearch = true
        this.haveListData = false
        this.$message.error(res.message)
      })
    },
    nameLists(text, value) {
      this.query.kw = text
      this.list = false
      if (value) {
        this.$eventBus.$emit('show-no-permission-dialog', value)
      } else {
        this.$message.error('系统错误！')
        return
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

        const talkData = {
          cno: data.cno,
          callId: data.call_id,
          studentIntentionId: unFinishCallStudentIntentionId,
          haveWordsRecommended: false
        }
        localStorage.setItem('CALL_TALK_MESSAGE', JSON.stringify(talkData))
        this.$eventBus.$emit('beginToConnect', true)

        this.$eventBus.$emit('clearCallSetTimeOut')
        this.$eventBus.$emit('startCallSetTimeOut')
        this.$eventBus.$emit('show-no-permission-dialog', unFinishCallStudentIntentionId)
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
    },
    // 获取名单 显示弹窗
    btnAccessList() {
      if (this.callStatus === '2') {
        this.dialogShow = true
      } else {
        this.$http.post('recycle_getOcName', { action: 'new' }).then(res => {
          this.getNewNameTotal()
          if (res.data) {
            this.singleMessage = res.data
            if (res.data.nameType === 'new') {
              this.dialogShow = true
            } else if (res.data.nameType === 'locked') {
              this.$message.warning(res.message)
              this.routerJump()
            } else {
              this.routerJump()
            }
          }
        }).catch(console.log)
      }
    },
    // 名单获取 跳转
    routerJump() {
      const { callRecordId, studentIntentionId: accessListDetailRosterId, hasCommunicationRecord } = this.singleMessage
      this.dialogShow = false
      if (this.$router.currentRoute.path === '/accessList/detail') {
        this.$router.replace({
          path: '/accessList/detail',
          query: { accessListDetailRosterId, callRecordId, hasCommunicationRecord }
        })
        return this.$store.dispatch('delVisitedViews', { name: 'accessListDetail', path: '/accessList/detail' })
      } else {
        this.$router.push({
          path: '/accessList/detail',
          query: { accessListDetailRosterId, callRecordId, hasCommunicationRecord }
        })
      }
    },
    // 获取新名单数量
    getNewNameTotal() {
      this.$http.get('recycle_newNameTotal', { isFilterUrl: true }).then(res => {
        if (res.data) {
          this.query.totalNum = res.data.newNameTotal
        }
      }).catch(console.log)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 54px;
  line-height: 50px;
  width: calc(100% - 180px);
  z-index: 1002;
  position: fixed;
  .right-menu {
    height: 100%;
    position: absolute;
    right: 20px;
    &:focus{
     outline: none;
    }
    .searchContent{
      .totalNum-color{
        color: green;
        font-size: 12px;
        width: 375px;
        display: inline-block;
        line-height: 16px;
      }
      .help{
        cursor: pointer;
        margin-left: 10px;
        vertical-align: middle;
      }
      .go-dashboard {
        display: inline-block;
        text-align: left;
      }
      .accessList-margin {
        margin-right: 110px
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
        width: 188px;
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
      li{
        cursor: pointer;
        line-height: 30px;
      }
      li:hover{
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

.small-width{
  width: 54px!important;
}
.no-data-message{
  text-align: center;
  color: #606266;
}
.dialg-font-pos {
  display: block;
  padding: 20px 40px 50px 60px;
  font-size: 15px;
  line-height: 20px;
  text-align: center
}
.no-sidebar-navbar-width {
  width: calc(100% - 54px);
}
.classB{
  color: #339999
}
.classC{
  color: #FF0000
}
.classD{
  color: #0099FF
}
</style>
