<template>
<!-- 命令行生成的模板 -->
  <div class="dashboard-container help">
    <h2>销售工作台使用说明</h2>
    <ul>
      <li v-for="(i, index) in list" :key="index">
        <a :href="i.url" target="_blank">{{`${index+1}.${i.name}`}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      list: [{
        name: '左侧菜单栏定义',
        url: 'http://hf-paycenter.oss-cn-hangzhou.aliyuncs.com/file/20180925/t15378643726843r83.pdf'
      }, {
        name: '左侧菜单栏数字',
        url: 'http://hf-paycenter.oss-cn-hangzhou.aliyuncs.com/file/20180925/t15378643478457r54.pdf'
      }, {
        name: '常见问题调试手册',
        url: 'http://hf-paycenter.oss-cn-hangzhou.aliyuncs.com/file/20180927/t15380339607341r65.pdf'
      }]
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="sass">

@import '../../styles/help/index.sass'

</style>
