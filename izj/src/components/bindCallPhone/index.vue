<template>
  <el-dialog
    :visible.sync="isShow"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="isEdit ? true : false"
    @close="dialogCloseEvent"
    custom-class="el-dialog-md">
    <div class="telephone">
      <p class="telephoneTitle">
        <svg-icon icon-class="warning1"></svg-icon>
        <span>{{title}}</span>
      </p>
      <p class="announcements">
        <el-form inline :model="query" :rules="rules" ref="form" style="margin-left: -50px">
          <el-form-item>
            <el-select v-model="selectType" @change="selectTypeChangeEvent">
              <el-option label="手机号码" value="1"></el-option>
              <el-option label="座机号码" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div style="display: inline-block">
            <el-form-item prop="phone">
              <el-input v-model.trim="query.phone" :placeholder="placeholder.phone"></el-input>
            </el-form-item>
            <el-button @click="isShowDescription = true" type="text"
                       style="position: absolute;width: 150px;margin-left: -20px">如何查看座机号码？
            </el-button>
            <br>
            <el-form-item prop="againPhone">
              <el-input v-model.trim="query.againPhone" :placeholder="placeholder.againPhone"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </p>
      <div style="text-align: center">
        <el-button @click="isShow = false" v-if="isEdit ? true : false">取消</el-button>
        <el-button type="primary" @click="phoneSubmit" :disabled="!isCanSearch">确认</el-button>
      </div>
    </div>


    <el-dialog
      :visible.sync="isShowDescription"
      :append-to-body="true"
      custom-class="el-dialog-md"
    >
      <img :src="description" style="width: 600px;height: auto">
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { isvalidUsername } from '@/lib/validate.js'
  import description from './description.png'
  import { setToken } from '@/utils/auth'

  export default {
    name: 'bindCallPhone',
    props: {
      title: {
        required: true,
        type: String
      },
      isEdit: {
        type: Boolean
      }
    },
    data() {
      return {
        description,
        isShowDescription: false,
        isShow: false,
        isCanSearch: true,
        selectType: '1',
        query: {
          phone: '',
          againPhone: ''
        },
        rules: {
          phone: { validator: this.phoneValidator },
          againPhone: { validator: this.againPhoneValidator }
        },
        placeholder: {
          phone: '请输入手机号码',
          againPhone: '请确认手机号码'
        },
        defaultPhoneObj: {}
      }
    },
    computed: {
      ...mapGetters([
        'bindPhone',
        'userId',
        'isBind'
      ])
    },
    watch: {
      'isEdit'(val) {
        if (val) {
          this.isShow = true
        }
      }
    },
    mounted() {
      this.getDefaultPhone()
      this.init()
    },
    methods: {
      ...mapMutations([
        'SET_BINDPHONE',
        'SET_CALLSTATUS',
        'SET_ISBIND'
      ]),
      getPhoneDefaultApi() {
        return this.$http.post('phone_phoneDefault', {
          businessUid: this.userId
        }, { remote: 'iCP' })
      },

      phoneValidator(rule, value, callback) {
        if (!value) {
          return callback(new Error('请输入'))
        }

        if (this.selectType === '1' && !isvalidUsername(value)) {
          return callback(new Error('手机号码格式错误'))
        }
        if (this.selectType === '2' && !/^[0-9]{4}$/g.test(value)) {
          return callback(new Error('座机号码格式错误,只能4位'))
        }

        callback()
      },
      async getDefaultPhone() {
        try {
          const { data } = await this.getPhoneDefaultApi()
          if (!data) return
          data.forEach((val) => {
            if (val.isDefault) {
              this.query.phone = val.phone
              this.query.againPhone = val.phone
              this.selectType = val.type
            }
            this.defaultPhoneObj[val.type] = val
          })
        } catch (e) {
          console.log(e)
        }
      },
      againPhoneValidator(rule, value, callback) {
        if (!value) {
          return callback(new Error('请输入'))
        }

        if (value !== this.query.phone) {
          return callback(new Error('上下号码不一致'))
        }

        callback()
      },
      init() {
        if (!this.bindPhone) {
          this.isShow = true
        }
      },
      dialogCloseEvent() {
        this.$refs['form'].resetFields()
        this.$emit('update:isEdit', false)
      },
      selectTypeChangeEvent(val) {
        if (val === '1') {
          this.placeholder.phone = '请输入手机号码'
          this.placeholder.againPhone = '请确认手机号码'
        } else {
          this.placeholder.phone = '请输入座机号码'
          this.placeholder.againPhone = '请确认座机号码'
        }

        if (this.defaultPhoneObj[val]) {
          this.query.phone = this.defaultPhoneObj[val].phone
          this.query.againPhone = this.defaultPhoneObj[val].phone
        } else {
          this.query.phone = ''
          this.query.againPhone = ''
        }
      },
      phoneSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.isCanSearch = false
            this.$http.post('call_edit', {
              businessUid: this.userId,
              phone: this.query.phone,
              type: this.selectType
            }, { remote: 'iCP' }).then(res => {
              if (res.data) {
                if (this.isBind === '1') {
                  this.$message.success('绑定成功，请重新登陆')
                  this.$store.dispatch('FedLogOut').then(() => {
                    if (location.hash !== '#/login') {
                      setTimeout(() => {
                        location.reload()
                      }, 2000)
                    }
                  })
                } else {
                  this.$message.success('修改成功')
                  this.SET_BINDPHONE(this.query.phone)
                  this.SET_CALLSTATUS('1')
                  this.SET_ISBIND('')
                  setToken('bindPhone', this.query.phone)
                  setToken('callstatus', '1')
                  setToken('isBind', '')
                }
                this.isShow = false
              }
            }).catch(console.log).finally(() => {
              this.isCanSearch = true
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="sass">
  .telephone
    .telephoneTitle
      font-weight: 700
      color: #4F607B
      text-align: center
      font-size: 24px
      margin: 0
      .el-icon-warning
        color: #dfac60
    .announcements
      padding-top: 25px
      text-align: center
      background: #eaecee
      color: #4f607b
    .btn-group
      text-align: center
</style>
