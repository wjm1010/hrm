<template>
  <div class="status-bar">
    <p v-for="(v, i) in phase" :key="v" class="item">
      <span :class="statustxt(v.default)">{{v.name}}</span><span class="line" v-if="!(i===phase.length-1)"></span>
    </p> 
  </div>
</template>

<script>
export default {
  name: 'statusBar',
  props: {
    phase: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
    }
  },
  methods: {
    statustxt(color) {
      const mapObj = {
        '1': 'blue',
        '0': 'gray',
        '2': ''
      }
      return mapObj[color]
    }
  }

}
</script>

<style lang="sass" scoped>
  .status-bar
    display: flex;
    align-items: center;
    font-size: 12px;
    .blue
      color: #409EFF;
    .gray
      color: #ccc;
    .item
      display: flex;
      align-items: center;
    .line
      display: inline-block;
      height: 1px;
      width: 16px;
      margin: 0 4px;
      background-color: #ccc;
</style>

