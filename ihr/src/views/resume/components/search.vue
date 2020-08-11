<template>
  <el-form label-width="120px" inline>
    <el-form-item label="抽回原因：" v-if="config[this.$route.name].searchWithdrawReason">
      <el-select v-model="query.resumeRevulsionId" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.withdrawReason"
          :key="item.causeId"
          :label="item.causeContent"
          :value="item.causeId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="废弃原因：" v-if="config[this.$route.name].searchScrapReason">
      <el-select v-model="query.resumeDiscardId" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.scrapReason"
          :key="item.causeId"
          :label="item.causeContent"
          :value="item.causeId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="跟进专员：" v-if="!config[this.$route.name].searchNoDirectList">
      <el-select v-model="query.resumeDirectorIdA" clearable filterable placeholder="请选择" @change="$emit('changeRole')" multiple
                 collapse-tags>
        <el-option
          v-for="item in options.directList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
      <el-select v-model="query.resumeDirectorIdB" clearable filterable placeholder="请选择" multiple
                 collapse-tags>
        <el-option
          v-for="item in SecondDirect"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="一级渠道：">
      <el-select v-model="query.resumeFirstChannel" clearable filterable placeholder="请选择" @change="$emit('changeSecondChannel')">
        <el-option
          v-for="item in options.firstChannel"
          :key="item.channelId"
          :label="item.channelName"
          :value="item.channelId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级渠道：">
      <el-select v-model="query.resumeSecondChannel" multiple clearable filterable placeholder="请选择" reserve-keyword>
        <el-option
          v-for="item in secondChannel"
          :key="item.channelId"
          :label="item.channelName"
          :value="item.channelId">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="关键字：">
      <el-select v-model="query.searchType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.searchType"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model.trim="query.keywords" placeholder="请输入要搜索的内容" class="item-input"></el-input>
    </el-form-item>
    <el-form-item label="工作方式：">
      <el-select v-model="query.workType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.workType"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="岗位性质：">
      <el-select v-model="query.resumeProperty" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.propery"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="年级：">
      <el-select v-model="query.resumeGrade" clearable filterable placeholder="请选择" @change="$emit('changeSubject')">
        <el-option
          v-for="(item,index) in options.grade"
          :key="index"
          :label="index"
          :value="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学科：">
      <el-select v-model="query.resumeSubject" multiple clearable filterable placeholder="请选择">
        <el-option
          v-for="item in secondSubject"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="地区：">
      <el-select v-model="query.workPlace" multiple clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.workPlace"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="query.resumeTimeType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.timeType"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="time">
      <el-date-picker
        v-model="query.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item><br>
    <el-form-item label="沟通次数：">
      <el-input v-model.trim="query.resumeRecordUp" class="item-input"></el-input>至
          <el-input v-model.trim="query.resumeRecordOff" class="item-input"></el-input>
    </el-form-item><br>
    <el-form-item label="教学部：">
      <el-select v-model="query.resumeTeachingDept" multiple placeholder="请选择">
        <el-option
          v-for="item in options.resumeTeachingDept"
          :key="item.teachingDeptId"
          :label="item.teachingDeptName"
          :value="item.teachingDeptId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="教师资格证">
      <el-select v-model="query.resumeInfoTeacherCert" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.resumeInfoTeacherCert"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="合同类型">
      <el-select v-model="query.resumeInfoContractType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.resumeInfoContractType"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('getList')" icon="el-icon-search" :disabled="!isCanSearch">确认搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default{
  name: 'hxr-search',
  props: ['query', 'SecondDirect', 'secondSubject', 'options', 'secondChannel', 'isCanSearch', 'rckScrapData', 'rckWithdrawData', 'all', 'config']
}
</script>
<style lang="sass" scoped>
  .item-input
    width: 200px
</style>
