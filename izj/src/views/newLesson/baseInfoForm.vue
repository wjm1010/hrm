<template>
  <el-form
    :model="query"
    ref="form"
    label-position="left"
    label-width="120px"
    :rules="rules"
    v-loading="formLoading"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="选择学生">
          {{studentName}}（{{studentNo}}）
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="选择课时类型" prop="contractType">
          <el-select v-model="query.contractType" clearable filterable @change="contractTypeChange">
            <el-option
              v-for="item in options.contractTypeOps"
              :key="item.code"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
          <span style="margin-left: 10px">剩余可排课时</span>
          <span>{{this.query.contractUsable}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    name: 'baseInfoForm',
    props: {
      query: {
        required: true,
        type: Object
      },
      studentIntentionId: {
        required: true
      },
      studentName: {
        required: true
      },
      studentNo: {
        required: true
      }
    },
    data() {
      return {
        formLoading: true,
        options: {
          contractTypeOps: {}
        },
        rules: {
          contractType: { required: true, message: '请选择' }
        },
        contractUsable: {
          1: '',
          2: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      getContractType() {
        return this.$http.get('courseApplication_getContractType')
      },
      getContractUsable() {
        return this.$http.get('courseApplication_getContractUsable', {
          params: {
            studentIntentionId: this.studentIntentionId
          }
        })
      },
      async init() {
        try {
          const [contractTypeRes, contractUsableRes] = await Promise.all([this.getContractType(), this.getContractUsable()])
          if (!contractTypeRes.data || !contractUsableRes.data) {
            return
          }
          this.options.contractTypeOps = contractTypeRes.data.contractType
          const { common, star } = contractUsableRes.data
          this.contractUsable['1'] = common
          this.contractUsable['2'] = star
          this.query.contractUsable = this.contractUsable[this.query.contractType]
          if (this.query.contractUsable === '0') {
            this.$message.error('该类型没有可排课时')
          }
          this.formLoading = false
        } catch (e) {
          console.log(e)
          this.$message.error('数据错误')
        }
      },
      contractTypeChange(val) {
        if (val) {
          this.query.contractUsable = this.contractUsable[val]
          if (this.query.contractUsable === '0') {
            this.$message.error('该类型没有可排课时')
          }
        } else {
          this.query.contractUsable = ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
