<template>
  <el-row>
    <el-form label-width="130px" inline>
      <template v-for='(i, index)  in resultList'>
        <el-form-item :label="`${isTypeBtn(i) ? '' : i.title+'：'}`">
          <!-- 单选框 -->
          <template v-if='isTypeRadio(i)'>
            <el-radio-group v-model="i.model" @change='val=>change(i, val)'>
              <el-radio v-for="item in selectOptions[i.optionkey || i.modelKey]" :label="labelKey(item, i, 1)" :key="labelKey(item, i, 0)">{{labelKey(item, i, 0)}}</el-radio>
            </el-radio-group>
          </template>
          <!-- 多选框 -->
          <template v-if='isTypeCheckbox(i)'>
            <el-checkbox-group v-model="i.model" @change='val=>change(i, val)'>
              <el-checkbox v-for="item in selectOptions[i.optionkey || i.modelKey]" :label="labelKey(item, i, 1)" :key="labelKey(item, i, 0)"></el-checkbox>
            </el-checkbox-group>
          </template>
          <!-- 下拉框 -->
          <template v-if='isTypeSelect(i)'>
            <el-select v-model="i.model" clearable filterable :placeholder="_default.selectPlaceholder" @change='val=>change(i, val)'>
              <el-option v-for="item in selectOptions[i.optionkey || i.modelKey]" :label="labelKey(item, i, 1)" :key="labelKey(item, i, 0)" :value="labelKey(item, i, 0)">
              </el-option>
            </el-select>
          </template>
          <!-- 日期选择 -->
          <template v-if='isTypeDate(i) || isTypeDatePicker(i)'>
            <el-date-picker v-model="i.model" :type="dataType(i.type)" :range-separator="_default.rangeSeparator" :start-placeholder="_default.startPlaceholder" :format="_dateFormat(i.type)" :value-format="_dateFormat(i.type)" :end-placeholder="_default.endPlaceholder" placeholder="选择日期" clearable @change='val=>change(i, val)' :class="isTypeDate(i) ? 'item-input':''">
            </el-date-picker>
          </template>
          <!-- 输入框 -->
          <template v-if='isTypeTextarea(i) || isTypeInput(i)'>
            <el-input :type="i.type" v-model="i.model" @change='val=>change(i, val)' :required='requiredItem(i)' :placeholder='i.placeholder' class="item-input" clearable></el-input>
          </template>
        </el-form-item>
        <br v-if='i.warp'>
      </template>
      <!-- 按钮 -->
      <template>
        <el-button :type="_default.buttonType" @click="handleClick" :icon="'el-icon-search'" :disabled="!$parent.isCanSearch">{{btnTitle}}</el-button>
      </template>
    </el-form>
  </el-row>
</template>
<script>
export default {

  name: 'searchFrom',

  data() {
    return {
      resultList: [],
      typeList: ['btn', 'radio', 'checkbox', 'select', 'date', 'datePicker', 'textarea', 'input'],
    }
  },
  props: {
    /**
     * 选择器的列表
     * @type {Object}
     */
    selectOptions: {
      type: Object,
      required: true
    },
    /**
     * 提交按钮
     * @type {Object}
     */
    btnTitle: {
      type: String,
      default: '查询'
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
     * 时间默认值
     * @type {Object}
     */
    dateFormat: {
      type: String
    }
  },
  computed: {
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
        selectOptionKey: 'id', // 下拉框默认key值
        selectOptionValue: 'value', // 下拉框默认value值
        buttonType: 'primary' // 按钮默认颜色
      }
    },
    requiredItem() {
      return function(i) {
        return i.required !== undefined ? i.required : this._default.required
      }
    },
    labelKey() {
      return function(item, i, index) {
        if (item === 'string') {
          return item
        }
        return item[i.prop ? i.prop[index] : ['id', 'value'][index]]
      }
    },
    _dateFormat() {
      return function(type) {
        if (this.dateFormat) return this.dateFormat
        return type === 'date' ? 'yyyy-MM-dd HH' : 'yyyy-MM-dd HH:mm'
      }
    },
    dataType() {
      return function(type) {
        return type === 'date' ? 'date' : 'datetimerange'
      }
    }
  },
  created() {
    this.until()
    this.listBack = this.$cloneParams(this.list)
    this.resultList = this.init()
  },
  methods: {
    /**
     * 初始化
     * @param  {[type]} groupDefalt [description]
     * @return {[type]}             [description]
     */
    init() {
      const arr = []
      let i = this.listBack.length
      while (i--) {
        const item = this.listBack[i]
        if (item.modelKey) {
          const val = item.model || ''
          this.$parent.searchParams[item.modelKey] = val
          // 时间选择器单独做处理
          if (item.type === 'datePicker') {
            item.modelKey && (this.$parent.searchParams[item.modelKey] = val.toString())
            this.$parent.searchParams[item.startModel] = val[0] || ''
            this.$parent.searchParams[item.endModel] = val[1] || ''
          }
        }
        if (!item.optionkey) {
          item.optionkey = item.modelKey
        }
        if (item.type === 'checkbox') {
          this.$set(item, 'checkList', []) // 数组需要响应式创建
        }
        arr.unshift(item)
      }
      return arr
    },
    until() {
      this.typeList.forEach(t => {
        const str = t.substring(0, 1).toUpperCase() + t.substring(1)
        this[`isType${str}`] = (item) => {
          return item.type === t
        }
      })
    },
    /**
     * 下拉框，时间选择器，输入框数值改变的回调
     * @return {[type]} 返回所有绑定的值
     */
    change(item, val) {
      const res = this.$parent.searchParams
      item.modelKey && (res[item.modelKey] = val)
      // 时间选择器单独做处理
      if (item.type === 'datePicker') {
        item.startModel && (res[item.startModel] = val ? val[0] : '')
        item.endModel && (res[item.endModel] = val ? val[1] : '')
        item.modelKey && (res[item.modelKey] = val.toString())
      }
      this.$parent.searchParams = res
      this.$emit('change', res)
    },
    hasType(type) {
      return this.typeList.includes(type)
    },
    /**
     * 按钮点击事件
     * @param  {[type]} item  当前按钮
     * @param  {[type]} index 索引值，如果有多个按钮可以根据这个判断
     * @return {[type]}       [description]
     */
    handleClick(item, index) {
      this.$emit('click', event, index)
    }
  }
}

</script>
<style lang="css" scoped>
.item-input {
  width: 195px;
}

</style>
