<template>
  <div class="detail">
    <el-popover
      placement="top"
      width="350"
      trigger="hover"
      v-for="v in lessonArr"
      :key="v.id"
      :disabled="!v.bubble"
      >
      <div>
        <p  class="bubble" v-for="v in v.bubble" :key="v">{{v}}</p>
      </div>
      <div class="try" slot="reference">
        <span class="name">{{v.title}}</span>
        <span>{{v.state}}</span>
        <span>{{v.content}}</span>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'Lessons',
  props: {
    infoExp: {
      type: Object,
      required: true
    },
    infoTrl: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    lessonArr() {
      return [
        { id: '1', title: '体验课', ...this.infoExp },
        { id: '2', title: '试听课', ...this.infoTrl }
      ]
    }
  },

}
</script>
<style lang="sass" scoped>
  .detail
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #ccc;
    .name
      color: #333;
    .try
      margin-top: 10px;
      overflow: hidden; 
      white-space: nowrap; 
      text-overflow: ellipsis;
      width: 400px;
  .bubble
    padding: 0;
    margin: 0 0 6px 0;
    font-size: 12px;

</style>

