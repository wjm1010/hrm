<template>
  <div class="dashboard-container training-attendance">
    <search-from :list='searchList' :selectOptions='searchOptions' @click='search' dateFormat='yyyy-MM-dd' />
    <div class="fr">
      <el-button type="primary" @click="openAddTrain(0)">新增培训场次</el-button>
    </div>
    <expandTable :loading="loading" ref="channelTable" :pagination="paging" @get-list="getList" :rows="list" :columns="columns" rowKeyName="trainManageId" :slot-name-arr="slotNameArr" tableExpandSlotName="secondTable" :expandRowKeys="expandRowKeys" class="channel-first-table" @expandChange="keys => {this.expandRowKeys = keys}" v-if='showTable'>
      <!-- 二级表格 -->
      <template slot-scope="scope" slot="secondTable" v-if='expandRowKeys.length'>
        <expandTable :loading="loading" v-if="scope.row.data && expandRowKeys.length" :rows="scope.row.data" :columns="tableExpandSlotName" :slotNameArr="['operating','trainManageQRcode']" class="channel-second-table">
          <template slot-scope="scope" slot="trainManageQRcode">
            <el-button type="text" size="small" class="actionItems"><a :href="scope.row.trainManageQRcode" target="_blank" download>下载</a></el-button>
          </template>
          <template slot-scope="scope" slot="operating">
            <el-button type="text" size="small" class="actionItems" @click="addQrcodeFn(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row)">设置为{{+scope.row.trainManageStatus?'无效':'有效'}}</el-button>
          </template>
        </expandTable>
      </template>
      <template slot-scope="scope" slot="trainManageId" v-if="scope.row.trainManageId">
        <el-button type="text" v-if="scope.row.trainManagePid === '0' && scope.row.data" @click="toggleRowExpansion(scope.row)">{{expandRowKeys.includes(scope.row.trainManageId) ? '收起' : '展开'}}</el-button>
        <span>{{scope.row.trainManageId}}</span>
      </template>
      <template slot-scope="scope" slot="trainManageQRcode">
        <el-button type="text" size="small" class="actionItems"><a :href="scope.row.trainManageQRcode" target="_blank" download>下载</a></el-button>
      </template>
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="openAddTrain(scope.row)">编辑</el-button>
        <el-button type="text" size="small" class="actionItems" @click="addQrcodeFn(scope.row, 1)">添加</el-button>
        <el-button type="text" size="small" class="actionItems" @click="setStatus(scope.row)">设置为{{+scope.row.trainManageStatus?'无效':'有效'}}</el-button>
      </template>
    </expandTable>
    <!-- 新增和编辑 -->
    <dialog-from v-if='addTrainDialogVisible' lableWidth='150px' :title='addTrainTitle' @click='addTrain
' :list='addTrainDialogList' :selectOptions='searchOptions' id='addTrain' @change='addTrainChange' :modelOptions='modelOptions' :disabledDateTimeOut="disabledDateTimeOut" />
    <!-- 添加二维码 -->
    <dialog-from v-if='addQrcodeDialogVisible' title='添加二维码' @click='addQrcode' :list='addQrcodeDialogList' :selectOptions='searchOptions' id='addQrcode' dateFormat='yyyy-MM-dd HH:mm' />
  </div>
</template>
<script>
import { searchTable, dialog } from '@/mixins'
import { getNowFormatDate, getComputFormatDate } from '@/utils'
export default {
  name: 'training-attendance',
  mixins: [searchTable, dialog],
  data() {
    // 取当前日期和之后一个月的日期间隔
    const disabledDateTimeOut = (function() {
      const start = getNowFormatDate()
      const end = getComputFormatDate(start, 30)
      return [start, end]
    })()
    return {
      editQr: false,
      disabledDateTimeOut,
      searchApi: 'train_allsearch',
      listApi: 'train_trainList',
      searchList: [{
        title: '岗位性质',
        type: 'select',
        modelKey: 'trainManagePostType',
        optionkey: 'postStatus',
        warp: true
      }, {
        title: '培训日期',
        type: 'date',
        modelKey: 'trainManageTime',
        warp: true
      }, {
        title: '状态',
        type: 'select',
        modelKey: 'trainManageStatus',
        optionkey: 'status',
      }],
      // 弹出层保存参数
      addTrainDialogParams: {
        trainManageTrainStartTime: '',
        trainManageTrainEndTime: '',
        trainManageStartTime: '',
        trainManageEndTime: '',
        trainManagePostType: '',
        trainManageStatus: '',
        trainManageQQ: '',
        trainManageCode: '',
        trainManageId: ''
      },
      // 弹出层列表选项
      addTrainDialogList: [{
        title: '培训时间',
        type: 'datePicker',
        modelKey: 'trainManageTime'
      }, {
        title: '生效时间',
        type: 'datePicker',
        modelKey: 'trainManageTakeTime'
      }, {
        title: '岗位性质',
        type: 'select',
        modelKey: 'trainManagePostType',
        optionkey: 'postStatus',
        multiple: true
      }, {
        required: false,
        title: 'QQ群号',
        type: 'input',
        modelKey: 'trainManageQQ'
      }, {
        required: false,
        title: '邀请码',
        type: 'input',
        modelKey: 'trainManageCode'
      }, {
        title: '状态',
        type: 'select',
        model: '1',
        modelKey: 'trainManageStatus',
        optionkey: 'status'
      }],
      addTrainTitle: '',
      modelOptions: {},
      addQrcodeDialogParams: {
        trainManageId: '',
        trainManagePid: ''
      },
      // 添加二维码
      addQrcodeDialogList: [{
        title: '生效时间',
        type: 'datePicker',
        startModel: 'trainManageStartTime',
        endModel: 'trainManageEndTime',
        modelKey: 'trainManageTakeTime'
      }],
      addTrainDialogListBack: [],
      trainManageId: '',
      trainManagePid: '',
      expandRowKeys: [],
      addTrainDialogVisible: false,
      addQrcodeDialogVisible: false,
      showTable: false,
      slotNameArr: ['trainManageId', 'trainManagePostType', 'trainManageQRcode', 'operating'],
      columns: [
        { 'value': 'trainManageId', 'text': '编号' },
        { 'value': 'trainManageTime', 'text': '培训时间' },
        { 'value': 'trainManagePostTypeName', 'text': '岗位性质' },
        { 'value': 'trainManageTakeTime', 'text': '生效时间' },
        { 'value': 'trainManageLink', 'text': '签到短链接' },
        { 'value': 'userName', 'text': '操作人' },
        { 'value': 'trainManageQRcode', 'text': '二维码' },
        { 'value': 'operating', 'text': '操作', width: 200 }
      ],
      tableExpandSlotName: [
        { 'value': 'trainManageId', 'text': '编号' },
        { 'value': 'trainManageTime', 'text': '培训时间' },
        { 'value': 'trainManagePostTypeName', 'text': '岗位性质' },
        { 'value': 'trainManageTakeTime', 'text': '生效时间' },
        { 'value': 'trainManageLink', 'text': '签到短链接' },
        { 'value': 'userName', 'text': '操作人' },
        { 'value': 'trainManageQRcode', 'text': '二维码' },
        { 'value': 'operating', 'text': '操作', width: 200 }
      ],
    }
  },
  computed: {},
  created() {
    this.addQrcodeDialogListBack = this.$cloneParams(this.addQrcodeDialogList)
    this.addTrainDialogListBack = this.$cloneParams(this.addTrainDialogList)
  },
  methods: {
    /**
     * 添加二维码
     * @return {[type]} [description]
     */
    async addQrcode(params) {
      if (!this.editQr) {
        params.trainManagePid = ''
        params.trainManageId = this.trainManageId
      } else {
        params.trainManagePid = this.trainManageId
        params.trainManageId = ''
      }
      const res = await this.$http.post('train_addQRcode', params)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.showTable = false
      this.getList()
    },
    /**
     * 新增和编辑培训场次
     * @return {[type]} [description]
     */
    async addTrain(params) {
      params = Object.assign({}, this.addTrainDialogParams, params)
      params.trainManageTakeTime = params.trainManageTakeTime.toString()
      params.trainManageTime = params.trainManageTime.toString()
      const res = await this.$http.post('train_addTrain', params)
      if (!res.data) {
        this.$message.error(res.message)
        return
      }
      this.addTrainDialogParams.trainManageId = ''
      this.showTable = false
      this.getList()
    },
    /**
     * 培训场次设置状态
     * @return {[type]} [description]
     */
    async setStatus(item) {
      const trainManageStatus = +item.trainManageStatus
      this.$confirm(`是否设置为${trainManageStatus ? '无效' : '有效'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$http.post('train_setStatus', {
          trainManageId: item.trainManageId,
          trainManageStatus: trainManageStatus ? '0' : '1'
        })
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        this.showTable = false
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消设置'
        })
      })
    },
    /**
     * 改变培训时间，默认自动生成生效时间
     */
    addTrainChange(params, item) {
      const { trainManageTime } = params
      if (item.modelKey === 'trainManageTime' && item.model) {
        this.modelRule[0].req.trainManageTime = trainManageTime
        this.modelRule[0].res.trainManageTakeTime = trainManageTime
      }
    },
    /**
     * 打开新增和编辑培训场次
     * @return {[type]} [description]
     */
    openAddTrain(item) {
      // 给列表重新赋值
      const detaiAddTrainDialogList = () => {
        const arr = []
        let i = this.addTrainDialogList.length
        const itemBack = this.$cloneParams(item)
        if (itemBack.data) {
          delete itemBack.data
        }
        while (i--) {
          const listitem = this.addTrainDialogList[i]
          listitem.model = itemBack[listitem.modelKey] || ''
          // 时间选择器单独做处理
          if (listitem.type === 'datePicker') {
            if (listitem.modelKey === 'trainManageTakeTime') {
              listitem.model = [itemBack.trainManageStartTime, itemBack.trainManageEndTime] || []
            }
            if (listitem.modelKey === 'trainManageTime') {
              listitem.model = [itemBack.trainManageTrainStartTime, itemBack.trainManageTrainEndTime] || []
            }
          }
          if (listitem.multiple && listitem.type === 'select') {
            listitem.model = itemBack[listitem.modelKey] || []
          }
          arr.unshift(listitem)
        }
        return arr
      }
      this.addTrainDialogVisible = true
      if (item) {
        this.addTrainTitle = '编辑培训场次'
        this.addTrainDialogList = detaiAddTrainDialogList()
        this.groupDefalt = item.trainManagePostType === '2' ? 'b' : 'a'
        this.addTrainDialogParams.trainManageId = item.trainManageId
        return
      }
      this.addTrainDialogParams.trainManageId = ''
      this.modelOptions = {}
      this.addTrainTitle = '新增培训场次'
      this.groupDefalt = 'a'
      this.addTrainDialogList = this.$cloneParams(this.addTrainDialogListBack)
    },
    /**
     * 添加二维码
     * @param {[type]} item [description]
     */
    addQrcodeFn(item, isAdd) {
      this.editQr = true
      this.addQrcodeDialogVisible = true
      this.trainManagePid = ''
      this.trainManageId = ''
      if (item) {
        this.trainManagePid = item.trainManagePid
        this.trainManageId = item.trainManageId
        const { trainManageStartTime, trainManageEndTime } = item
        const addQrcodeDialogList = this.addQrcodeDialogList[0]
        addQrcodeDialogList.model = ''
        if (!isAdd) {
          this.editQr = false
          addQrcodeDialogList.model = [trainManageStartTime, trainManageEndTime]
        }
        return
      }
      this.addQrcodeDialogList = this.$cloneParams(this.addQrcodeDialogListBack)
    },
    /**
     * 二级表格
     * @return {[type]} [description]
     */
    toggleRowExpansion(row) {
      this.$refs.channelTable.$refs.tableRef.toggleRowExpansion(row)
    },
    /**
     * 获取列表之后的回调函数
     * @return {[type]} [description]
     */
    search() {
      this.showTable = false
      this.getList()
    },
    getListCb() {
      this.expandRowKeys = []
      this.showTable = true
    },
    getListRejectCb() {
      this.expandRowKeys = []
      this.showTable = true
    }
  }
}

</script>
<style type="text/css">
</style>
