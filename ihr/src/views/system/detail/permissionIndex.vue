<template>
  <div class="dashboard-container">
    <div v-loading="allLoading">
      <el-form :model="query" :rules="rules" ref="query" label-width="120px" inline>
        <el-form-item label="所属角色：" prop="roleId">
          <el-select v-model="query.roleId" placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in options.roleLevel"
              :key="item.roleDictId"
              :label="item.roleDictName"
              :value="item.roleDictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="levelId">
          <el-select v-model="query.levelId" placeholder="请选择">
            <el-option
              v-for="item in options.roleListnew"
              :key="item.levelDictId"
              :label="item.levelDictName"
              :value="item.levelDictId">
            </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="权限名称：" prop="roleAuthName">
          <el-input v-model="query.roleAuthName"></el-input>
        </el-form-item><br>
        <h5 style="margin:0 30px;font-size:14px">权限设置</h5><br>
        <el-form-item label="选择部门：" prop="deptId">
          <el-select v-model="query.deptId" placeholder="请选择" multiple
            collapse-tags>
            <el-option
              v-for="item in options.dept"
              :key="item.authId"
              :label="item.authName"
              :value="item.authId">
            </el-option>
          </el-select>
        </el-form-item><br>

        <el-form-item class="changeRole">
          <i style="color:#f56c6c">*</i> 
          <span style="font-size: 14px;color: #606266">选择权限：</span>
          <el-tree
            :data="authData"
            show-checkbox
            node-key="authId"
            ref="tree"
            :indent="40"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps">
          </el-tree>
        </el-form-item><br>

        <el-form-item>
          <el-button @click="resetForm('query')">取消</el-button>
          <el-button type="primary" @click="submitForm('query')" :disabled="isCancearch">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'permissionIndexAdd',
  data() {
    return {
      isCancearch: false,
      roleAuthId: this.$route.path !== '/system/permission/add' ? this.$route.params.userId : '',
      allLoading: false,
      query: {
        roleId: '',
        levelId: '',
        roleAuthName: '',
        deptId: []
      },
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      options: {
        roleList: [],
        roleListnew: [],
        roleLevel: [],
        dept: [],
      },
      authData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleId: [
          { required: true, message: '请选择所属角色', trigger: 'change' }
        ],
        levelId: [
          { required: true, message: '请选择所属角色', trigger: 'change' }
        ],
        roleAuthName: [
          { required: true, message: '请输入权限名称', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    /*   api   */
    getInfo() {
      return this.$http.post('auth_authorityListOne', {
        roleAuthId: this.roleAuthId
      })
    },
    getOption() {
      return this.$http.post('auth_getRoleLevelOption')
    },
    getAuthName() {
      return this.$http.post('auth_getModules')
    },
    /*   methods   */
    async init() {
      const res = await this.getOption()
      const resName = await this.getAuthName()
      if (res.data && resName.data) {
        this.options = res.data
        this.options.dept = resName.data
        this.authData = resName.data
        if (this.roleAuthId) {
          this.getEditInfo()
        }
      } else {
        this.$router.replace('/401')
      }
    }, // 初始页面
    getEditInfo() {
      this.allLoading = true
      this.getInfo().then(res => {
        if (res.data) {
          this.query = res.data
          if (this.query.roleId) {
            this.options.roleListnew = this.options.roleList[this.query.roleId]
            this.query.levelId = res.data.levelId
          }
          this.query.deptId = res.data.deptId.split(',')
          if (res.data.authIds.split(',').length === 83) {
            this.defaultCheckedKeys = res.data.authIds.split(',')
          } else {
            const dataArray = res.data.authIds.split(',')
            dataArray.shift()
            this.defaultCheckedKeys = dataArray
          }
        }
      }).catch(console.log).finally(() => {
        this.allLoading = false
      })
    }, // 编辑带入的值
    changeRole() {
      this.query.levelId = ''
      if (this.query.roleId) {
        this.options.roleListnew = this.options.roleList[this.query.roleId]
      } else {
        this.options.roleListnew = []
      }
    }, // 角色级别二级联动
    removeRouter(formName) {
      this.$router.replace('/system/permission')
      if (!this.userId) {
        this.$refs[formName].resetFields()
        this.$refs.tree.setCheckedKeys([])
        return this.$store.dispatch('delVisitedViews', { name: 'adminIndexAdd', path: '/system/permission/add' })
      }
    }, // 关闭编辑新增路由
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$refs.tree.getCheckedKeys([]).length === 0) {
            this.$message.error('请选择权限！')
            return false
          }
          const roleData = {
            authIds: this.$refs.tree.getCheckedKeys().toString().slice(0, 2) !== '1,' ? '1' + ',' + this.$refs.tree.getCheckedKeys().toString() : this.$refs.tree.getCheckedKeys().toString(),
            deptId: this.query.deptId.toString(),
            roleAuthId: this.roleAuthId ? this.roleAuthId : '',
            roleAuthName: this.query.roleAuthName,
            roleId: this.query.roleId,
            levelId: this.query.levelId
          }
          this.$http.post('auth_superProInsert', roleData).then(res => {
            if (res.data) {
              this.removeRouter(formName)
              this.$message.success(res.message)
            }
          }).catch(console.log)
        }
        return false
      })
    }, // 提交
    resetForm(formName) {
      this.removeRouter(formName)
    } // 取消
  }
}
</script>
<style lang="sass" scoped>
.el-input
  width: 200px
.el-button
  width: 150px
  margin: 30px
.el-tree
  background: #f2f2f2
  margin-left: 88px
.changeRole
  margin-left: 28px
</style>
<style lang="sass">
.el-tree__empty-text
  position: unset !important
</style>


