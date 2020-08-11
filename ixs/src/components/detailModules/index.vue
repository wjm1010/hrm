<script>
  export default {
    name: 'detailModules',
    props: {
      modules: {
        type: Array,
        default() {
          return []
        }
      }
    },
    render: function(createElement) {
      const _arr = []
      this.modules.forEach(val => {
        _arr.push(this.$slots[val])
      })
      return createElement(
        'div',
        _arr
      )
    }
  }
</script>

<style scoped>
</style>
