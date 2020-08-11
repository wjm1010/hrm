<template>
  <el-dialog center custom-class="el-dialog-mi" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" :title="title" @close="close">
    <el-row>
      <el-form :label-width='lableWidth' inline>
        <slot name='head'></slot>
        <el-form-item v-for='(i, index)  in resultList' :label="`${isTypeBtn(i) ? '' : i.title+'：'}`" :key='index' :required='requiredItem(i)'>
          <!-- 单选框 -->
          <template v-if='isTypeRadio(i)'>
            <el-radio-group v-model="i.model" @change='val=>change(i, val)'>
              <el-radio v-for="item in selectOptions[i.optionkey]" :label="labelKey(item, i, 0)" :key="labelKey(item, i, 0)">{{labelKey(item, i, 1)}}</el-radio>
            </el-radio-group>
          </template>
          <!-- 多选框 -->
          <template v-if='isTypeCheckbox(i)'>
            <el-checkbox-group v-model="i.checkList" @change='val=>change(i, val)'>
              <el-checkbox v-for="item in selectOptions[i.optionkey]" :label="labelKey(item, i, 0)" :key="labelKey(item, i, 0)">{{labelKey(item, i, 1)}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <!-- 下拉框 -->
          <template v-if='isTypeSelect(i)'>
            <el-select v-model="i.model" clearable filterable :placeholder="_default.selectPlaceholder" @change='val=>change(i, val)' :multiple='i.multiple'>
              <el-option v-for="item in selectOptions[i.optionkey]" :label="labelKey(item, i, 1)" :key="labelKey(item, i, 0)" :value="labelKey(item, i, 0)">
              </el-option>
            </el-select>
          </template>
          <!-- 日期选择 -->
          <template v-if='isTypeDate(i) || isTypeDatePicker(i)'>
            <el-date-picker v-model="i.model" :type="dataType(i.type)" :range-separator="_default.rangeSeparator" :start-placeholder="_default.startPlaceholder" :format="_dateFormat(i.type)" :value-format="_dateFormat(i.type)" :end-placeholder="_default.endPlaceholder" placeholder="选择日期" clearable @change='val=>change(i, val)' :class="i.type === 'date'?'item-input':''" :picker-options="pickerOptions">
            </el-date-picker>
          </template>
          <template v-if='isTypeTextarea(i) || isTypeInput(i)'>
            <!-- 输入框 -->
            <el-input v-bind="i" :type="i.naviveType || i.type" v-model="i.model" @change='val=>change(i, val)' :placeholder='i.placeholder || _default.inputPlaceholder' :required='requiredItem(i)' class="item-input" clearable></el-input>
          </template>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 插槽默认有取消按钮 -->
    <slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button :type="_default.buttonType" :disabled="!btnDisabled" @click="handleClick" v-if='btnTitle'>{{btnTitle}}</el-button>
      </div>
    </slot>
  </el-dialog>
</template>
<script>
/* eslint-disable */
// 把普通对象包装成迭代器
function* entries(obj) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}
/**
 * 判断非空对象
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
function isEmptyObj(obj) {
  if (!obj) return false
  return Object.keys(obj).length
}
export default {
  name: 'DialogFrom',

  data() {
    return {
      typeList: ['btn', 'radio', 'checkbox', 'select', 'date', 'datePicker', 'textarea', 'input'],
      group: '',
      listBack: [],
      visible: true,
      resultList: [],
      resultParams: {}
    }
  },
  props: {
    /**
     * 提交按钮
     * @type {Object}
     */
    btnTitle: {
      type: String,
      default: '确定'
    },
    /**
     * 默认组
     * @type {Object}
     */
    groupDefalt: {
      type: [String, Number],
    },
    /**
     * 组规则
     * @type {Object}
     */
    groupRule: {
      type: [Object, Array],
    },
    /**
     * 列表文字宽度
     * @type {Object}
     */
    lableWidth: {
      type: String,
      default: '130px'
    },
    /**
     * 标题
     * @type {Object}
     */
    title: {
      type: String
    },
    /**
     * 唯一值
     * @type {Object}
     */
    id: {
      type: String
    },
    /**
     * 选择器的列表
     * @type {Object}
     */
    selectOptions: {
      type: Object,
      required: true
    },
    /**
     * 选择值的属性
     * @type {Object}
     */
    modelOptions: {
      type: Object
    },
    /**
     * 所有列表的选项配置
     * @type {Object}
     */
    list: {
      type: Array,
      required: true
    },
    /**
     * 按钮是否可以点击，默认可以
     * @type {Object}
     */
    btnDisabled: {
      type: Boolean,
      default: true
    },
    /**
     * 时间默认值
     * @type {Object}
     */
    dateFormat: {
      type: String,
    },
    /**
     * 日期时间可选范围
     * @type {Object}
     */
    disabledDateTimeOut: {
      type: Array
    }
  },
  computed: {
    /**
     * 日期时间可选范围
     * @return {[type]} [description]
     */
    pickerOptions() {
      const _this = this
      return {
        disabledDate(time) {
          const timeOut = _this.disabledDateTimeOut
          if (!timeOut || !timeOut.length) return false
          const start = timeOut[0].split('.')
          const end = timeOut[1].split('.')
          return time.getTime() > new Date(end[0], +end[1] - 1, end[2]) || time.getTime() < new Date(start[0], +start[1] - 1, +start[2])
        }
      }
    },
    /**
     * 时间参数
     * @return {[type]} [description]
     */
    _dateFormat() {
      return function(type) {
        if (this.dateFormat) return this.dateFormat
        return type === 'date' ? 'yyyy-MM-dd HH' : 'yyyy-MM-dd HH:mm'
      }
    },
    /**
     * 默认项
     * @return {[type]} [description]
     */
    _default() {
      return {
        startPlaceholder: '开始日期', // 日期控件第一个框提示语
        rangeSeparator: '至', // 日期控件中间的提示语
        endPlaceholder: '结束日期', // 日期控件第二个框提示语
        selectPlaceholder: '请选择', // 下拉框默认提示
        inputPlaceholder: '请输入', // 下拉框默认提示
        selectOptionKey: 'id', // 下拉框默认key值
        selectOptionValue: 'value', // 下拉框默认value值
        buttonType: 'primary', // 按钮默认颜色
        required: true // 默认校验还是不校验
      }
    }
  },
  created() {
    this.until()
    this.listBack = this.$cloneParams(this.list)
    // 对绑定对象做处理
    this.resultList = this.init(this.groupDefalt, this.modelOptions)
  },
  methods: {
    /**
     * 初始化
     * @param  {[type]} groupDefalt [description]
     * @return {[type]}             [description]
     */
    init(groupDefalt, modelOptions) {
      const arr = []
      const group = groupDefalt
      let i = this.listBack.length
      const localList = (item) => {
        arr.unshift(item)
        if (this.requiredItem(item)) {
          // requireParams[item.modelKey] = item
        }
      }
      while (i--) {
        const item = this.listBack[i]
        if (item.modelKey) {
          const val = item.model || ''
          item.modelKey && (this.resultParams[item.modelKey] = val)
          // 时间选择器单独做处理
          if (item.type === 'datePicker') {
            item.modelKey && (this.resultParams[item.modelKey] = val.toString())
            this.resultParams[item.startModel] = val[0] || ''
            this.resultParams[item.endModel] = val[1] || ''
          }
          if (this.resultParams.undefined) {
            delete this.resultParams.undefined
          }
        }
        if (!item.optionkey) {
          item.optionkey = item.modelKey
        }
        if (item.type === 'checkbox') {
          this.$set(item, 'checkList', []) // 数组需要响应式创建
        }
        if (!group) {
          localList(item)
          continue
        }
        if (typeof item.group === 'string' && item.group === group) {
          localList(item)
        }
        if (Array.isArray(item.group) && item.group.includes(group)) {
          localList(item)
        }
      }
      return arr
    },
    /**
     * 下拉框，时间选择器，输入框数值改变的回调
     * @return {[type]} 返回所有绑定的值
     */
    change(item, val) {
      const groupRule = this.groupRule
      const detailRule = t => {
        if (!t.req) {
          throw new Error(`少了请求的规则参数req`)
        }
        if (!t.res) {
          throw new Error(`少了逾期结果参数res`)
        }
        for (const [key, value] of entries(t.req)) {
          if (item.modelKey === key && val === value) {
            this.group = t.res
          }
        }
      }
      if (this.groupDefalt && groupRule) {
        if (Array.isArray(groupRule)) {
          groupRule.forEach(t => {
            detailRule(t)
          })
        } else {
          detailRule(groupRule)
        }
      }
      // 时间选择器单独做处理
      if (item.type === 'datePicker') {
        item.startModel && (this.resultParams[item.startModel] = val[0] || '')
        item.endModel && (this.resultParams[item.endModel] = val[1] || '')
        item.modelKey && (this.resultParams[item.modelKey] = val.toString())
      }
      item.modelKey && (this.resultParams[item.modelKey] = val)
      if (this.resultParams.undefined) {
        delete this.resultParams.undefined
      }
      this.$emit('change', this.resultParams, item)
    },
    /**
     * 验证表单
     * @return {[type]} [description]
     */
    required() {
      let result = true
      for (const i of this.resultList) {
        // 默认都需要校验
        if (this.requiredItem(i) && !i.model) {
          if (i.checkList && i.checkList.length) {
            continue
          }
          if (!i.model) {
            const message = i.type === 'select' ? `请选择${i.title}` : `请输入${i.title}`
            this.$message.warning(message)
            result = false
            break
          }
        }
      }
      return result
    },
    /**
     * 按钮点击事件
     * @param  {[type]} item  当前按钮
     */
    handleClick() {
      if (!this.required()) return
      this.$emit('click', this.resultParams)
      this.close()
    },
    /**
     * 关闭按钮
     * @return {[type]} [description]
     */
    close() {
      this.$parent.dialogVisible = false
      this.$parent[`${this.id}DialogVisible`] = false
      this.$emit('close')
    },
    /**
     * 工具函数
     * @return {[type]} [description]
     */
    until() {
      this.typeList.forEach(t => {
        const str = t.substring(0, 1).toUpperCase() + t.substring(1)
        this[`isType${str}`] = (item) => {
          return item.type === t
        }
      })
    },
    /**
     * 类型判断
     * @return {[type]} [description]
     */
    hasType(item, str) {
      return item.type === str
    },
    /**
     * 验证判断
     * @return {[type]} [description]
     */
    requiredItem(i) {
      return i.required !== undefined ? i.required : this._default.required
    },
    /**
     * 选择框的属性值判断
     * @return {[type]} 如果不填默认为id,value
     */
    labelKey(item, i, index) {
      if (typeof item === 'string') {
        return item
      }
      return item[i.prop ? i.prop[index] : ['id', 'value'][index]]
    },
    /**
     * 是不是日期类型
     * @return {Boolean} [description]
     */
    isDate(type) {
      return ['date', 'datePicker', 'date-picker'].includes(type)
    },
    /**
     * 日期格式化
     * @return {[type]} [description]
     */
    dataType(type) {
      return type === 'date' ? 'date' : 'datetimerange'
    }
  },
  watch: {
    /**
     * 监听组名，更新列表
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    group(val) {
      this.resultList = this.init(val)
    },
    groupDefalt(val) {
      this.resultList = this.init(val)
    },
    /**
     * 监听传入值，更新列表
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    'list': {
      handler(val) {
        this.listBack = this.$cloneParams(this.list)
        this.resultList = this.init(this.groupDefalt, val)
      },
      deep: true
    },
  }
}

</script>
<style lang="css" scoped>
.item-input {
  width: 195px;
}

</style>
