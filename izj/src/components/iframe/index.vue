<template>
  <!-- 命令行生成的模板 -->
  <div class="base-iframe">
    <iframe :src="url" frameborder="0" scrolling="yes" style="width:100%;height:1000px;"></iframe>
  </div>
</template>

<script>
  import config from '@/../config/default.js'
  import { domainReplace } from '@/utils/http/utils'

  export default {
    name: 'base-iframe',
    props: {
      src: String
    },
    data() {
      return {
        url: ''
      }
    },
    computed: {},
    created() {
      this.beforeEnter()
    },
    mounted() {

    },
    methods: {
      beforeEnter() {
        // dev, itest, 线上， 离线
        const _href = window.location.host
        if (_href.includes('hfjy.') || _href.includes('localhost')) {
          if (_href.includes('hfjy.top')) {
            config.oldLmsHost = config.oldLmsHost.map(item => domainReplace(item))
          }

          config.currentHost.forEach((element, index) => {
            if (_href.includes(element)) {
              if (this.src.indexOf('?') > -1) {
                this.url = `${location.protocol}//${config.oldLmsHost[index] + '/resource/index.html#!/' + this.src}`
              } else {
                this.url = `${location.protocol}//${config.oldLmsHost[index] + '/resource/index.html#!/' + this.src + '?' + new Date().getTime()}`
              }
            } else if (_href.includes('localhost')) {
              this.url = `${location.protocol}//${config.oldLmsHost[1] + '/resource/index.html#!/' + this.src + '?' + new Date().getTime()}`
            }
          })
        }
      }
    },
    watch: {
      'src'() {
        this.beforeEnter()
      }
    }
  }
</script>
<style lang="sass">
</style>
