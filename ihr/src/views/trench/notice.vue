<template>
  <div class='notice dashboard-container'>
    <search-from :list='searchList' :selectOptions='options' @click='getList'/>
    <div class="fr">
      <el-button type="primary" @click="dealFrom(1)">新增公告</el-button>
    </div>
    <expand-table @change-table-sort="changeTableSort" :pagination="paging" @get-list="getList" :rows="list" :loading="loading" :columns="columns" :slot-name-arr="slotNameArr">
      <template slot-scope="scope" slot="operating">
        <el-button type="text" size="small" class="actionItems" @click="dealFrom(0, scope.row)">编辑</el-button>
      </template>
    </expand-table>
    <dialog-from v-if='dialogVisible' lableWidth='150px' :title='dialogTitle' btnTitle='确定' @click='save' :list='dialogList' :selectOptions='dialogOptions'/>
  </div>
</template>
<script>
  import { searchTable, dialog } from '@/mixins'
  export default{
    mixins: [searchTable, dialog],
    name: 'trench-notice',
    data() {
      return {
        searchApi: 'channel_getNoticeOption',
        listApi: 'channel_getNotice',
        searchList: [{
          title: '状态',
          type: 'select',
          modelKey: 'noticeStatus',
          model: '1',
          warp: true
        }, {
          title: '关键字',
          type: 'input',
          placeholder: '关键词搜索',
          modelKey: 'keyword',
        }, {
          title: '查询',
          type: 'btn',
        }],
        slotNameArr: ['operating'],
        columns: [
          { 'value': 'noticeId', 'text': '编号' },
          { 'value': 'noticeTitle', 'text': '公共标题' },
          { 'value': 'noticeSort', 'text': '排序号', sortable: 'custom' },
          { 'value': 'noticeLink', 'text': '公告链接' },
          { 'value': 'noticeStatusName', 'text': '状态' },
          { 'value': 'operating', 'text': '操作', width: 200 }
        ],
        dialogOptions: {},
        dialogTitle: '',
        options: {},
        noticeId: '',
        dialogVisible: false,
        dialogList: [{
          maxlength: 60,
          title: '公告名称',
          type: 'input',
          placeholder: '请输入公告名称',
          modelKey: 'noticeTitle'
        }, {
          title: '公告链接',
          type: 'input',
          placeholder: '请输入公告链接',
          modelKey: 'noticeLink'
        }, {
          naviveType: 'number',
          title: '排序号',
          type: 'input',
          placeholder: '数值越大，排序越靠前',
          modelKey: 'noticeSort'
        }, {
          title: '状态',
          type: 'select',
          modelKey: 'noticeStatus'
        }],
      }
    },
    methods: {
      getRecordOptionCb() {
        this.options.noticeStatus = this.searchOptions
        this.dialogOptions.noticeStatus = [this.searchOptions[0], this.searchOptions[1]]
      },
      dealFrom(type, item) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = type ? '新增公告' : '修改公告'
        this.noticeId = ''
        if (item) {
          this.noticeId = item.noticeId
          this.dialogList.forEach(t => {
            t.model = item[t.modelKey] || ''
          })
        } else {
          this.dialogList.forEach(t => {
            t.model = ''
            if (t.modelKey === 'noticeStatus') {
              t.model = '1'
            }
          })
        }
      },
      changeTableSort(prop, order) {
        this.searchParams.sequence = prop
        this.searchParams.sort = order
        this.getList()
      },
      async save(params, url = 'channel_addNotice') {
        const reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
        if (!reg.test(params.noticeLink)) {
          this.$message.info('请输入正确格式的链接！')
          return
        }
        if (this.noticeId) {
          url = 'channel_editNotice'
          params.noticeId = this.noticeId
        }
        const res = await this.$http.post(url, params)
        if (!res.data) {
          this.$message.error(res.message)
          return
        }
        this.getList()
      }
    }
  }
</script>
<style scoped>
</style>
