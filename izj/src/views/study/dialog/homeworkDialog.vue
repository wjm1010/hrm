<template>
  <el-dialog
    :visible="isShow"
    custom-class="el-dialog-md"
    :append-to-body="true"
    @close="closeDialog"
    class="dialog-homework"
  >
    <div v-loading="loading">
      <div>
        <h2 style="display: inline-block;margin-right: 20px">作业情况</h2>
        <template v-if="status === '2'">
          <span>正确{{allData['正确']}}题，</span>
          <span>错误{{allData['错误']}}题，</span>
          <span>半对半错{{allData['半对半错']}}题</span>
        </template>
      </div>
      <expand-table
        :rows="rows"
        :columns="columns"
        :slot-name-arr="slotNameArr"
      >
        <template slot-scope="scope" slot="number">
          <span>第{{scope.row.index}}题</span>
        </template>

        <template slot-scope="scope" slot="comment">
          <el-popover trigger="hover" placement="top" v-if="scope.row['comment'].length>15" width="500">
            <p>{{scope.row['comment']}}</p>
            <div slot="reference" class="name-wrapper">
              <p>{{scope.row['comment'].slice(0,15)}}...</p>
            </div>
          </el-popover>
          <p v-else>{{scope.row['comment']}}</p>
        </template>

      </expand-table>
    </div>

  </el-dialog>
</template>

<script>
  import ExpandTable from '@/components/ExpandTable'

  export default {
    name: 'homeworkDialog',
    props: {
      isShow: Boolean,
      homeWorkId: String,
      status: String
    },
    components: {
      ExpandTable
    },
    data() {
      return {
        loading: true,
        allData: {
          '正确': '1',
          '错误': '2',
          '半对半错': '3'
        },
        rows: [],
        columns: [
          { value: 'number', text: '序号' },
          { value: 'knowledgeName', text: '知识点' },
          { value: 'status', text: '答题情况' },
          { value: 'comment', text: '批改意见' }
        ],
        slotNameArr: ['number', 'comment']
      }
    },
    created() {
      this.init()
    },
    methods: {
      getLookOperationSituation() {
        return this.$http.get('evaluate_lookOperationSituation', {
          params: {
            homeWorkId: this.homeWorkId
          }
        })
      },
      closeDialog() {
        this.$emit('update:isShow', false)
      },
      async init() {
        try {
          const { data } = await this.getLookOperationSituation()
          if (!data) return
          this.allData = data.count
          this.rows = data.list.map((val, index) => {
            val.index = index + 1
            return val
          })
        } catch (e) {
          console.log(e)
          this.$message.error('系统错误001')
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped lang="sass">

</style>
