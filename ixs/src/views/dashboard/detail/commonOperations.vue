<template>
  <!-- 命令行生成的模板 -->
  <!-- 常用操作 -->
  <div v-loading="loading">
    <div class="common-operations">
      <h3>常用操作</h3>
      <el-row type="flex" class="operations-body" justify="space-around">
        <el-col>
          <div class="operation-content" @click="newList">
            <img :src="imgSrc.newList">
            <div class="message">新名单</div>
            <div class="number">{{options.new}}人</div>
          </div>
        </el-col>
        <el-col>
          <div class="operation-content" @click="followingUp">
            <img :src="imgSrc.following">
            <div class="message">跟进中</div>
            <div class="number">{{options.now}}人</div>
          </div>
        </el-col>
        <el-col>
          <div class="operation-content" @click="audition">
            <img :src="imgSrc.audition">
            <div class="message">待试听</div>
            <div class="number">{{options.waitFollow}}人</div>
          </div>
        </el-col>
        <el-col>
          <div class="operation-content" @click="contract">
            <img :src="imgSrc.contract">
            <div class="message">成单中</div>
            <div class="number">{{options.order}}人</div>
          </div>
        </el-col>
        <el-col v-if="jurisdiction">
          <div class="operation-content" @click="management">
            <img :src="imgSrc.management">
            <div class="message">名单管理</div>
            <div class="number">{{options.total}}人</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import newList from '@/assets/homePageImg/newList.png'
  import audition from '@/assets/homePageImg/audition.png'
  import contract from '@/assets/homePageImg/contract.png'
  import following from '@/assets/homePageImg/following.png'
  import management from '@/assets/homePageImg/management.png'

  export default {
    name: 'commonOperations',
    data() {
      return {
        jurisdiction: false,
        isCanSearch: true,
        loading: true,
        imgSrc: {
          newList,
          audition,
          contract,
          following,
          management
        },
        options: {
          new: '',
          now: '',
          waitFollow: '',
          order: '',
          total: ''
        }
      }
    },
    computed: {
      ...mapGetters(['roleCode'])
    },
    created() {
      this.getOperationNumber()
    },
    mounted() {
    },
    watch: {
    },
    methods: {
      getOperationNumber() {
        this.$http.get('index_summaryNum').then(res => {
          if (res.data) {
            this.options = res.data
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
        if (this.roleCode === 'XS-ZY') {
          this.jurisdiction = false
        } else {
          this.jurisdiction = true
        }
      },
      newList() {
        this.$router.push('/tasks/newTasks')
      },
      followingUp() {
        this.$router.push('/tasks/followingUpTasks')
      },
      audition() {
        this.$router.push('/audition/waitCommunicated')
      },
      contract() {
        this.$router.push('/contract/contractIng')
      },
      management() {
        this.$router.push('/management/roster')
      }
    }
  }
</script>
<style lang="sass">
  @import '../../../styles/dashboard/index.sass'

</style>
