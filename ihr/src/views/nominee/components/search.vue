<template>
  <el-form label-width="130px" inline>
    <el-form-item label="跟进专员：" v-if="specialistSwitch">
      <el-select v-model="query.directList" clearable filterable placeholder="请选择" @change="$emit('changeRole')">
        <el-option
          v-for="item in options.directList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
      <el-select v-model="query.resumeDirectorId" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in SecondDirect"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="岗位性质：">
      <el-select v-model="query.resumeProperty" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.propery"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="年级：">
      <el-select v-model="query.resumeGrade" clearable filterable placeholder="请选择" @change="$emit('changeGrade')">
        <el-option
          v-for="(item,index) in options.grade"
          :key="index"
          :label="index"
          :value="index">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学科：">
      <el-select v-model="query.resumeSubject" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in GRADE"
          :key="item"
          :label="item"
          :value="item">
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
      <el-select v-model="query.resumeSecondChannel" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in secondChannel"
          :key="item.channelId"
          :label="item.channelName"
          :value="item.channelId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="小学招聘要求：">
      <el-select v-model="query.isGrade" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.primaryRequire"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="初高中招聘要求：">
      <el-select v-model="query.isSenior" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.hightRequire"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="视频上传：">
      <el-select v-model="query.isVideo" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.videoUpload"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="简历上传：">
      <el-select v-model="query.isResume" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.appendixUpload"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标签：">
      <el-select v-model="query.resumeTags" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.tags"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagId">
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
    <el-form-item label="地区：">
      <el-select v-model="query.workPlace" multiple clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.workPlace"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item><br>
    <el-form-item label="学校类型：">
      <el-checkbox-group v-model="query.resumeSchoolProperty">
        <el-checkbox v-for="item in options.schoolType" :key="item.id" :label="item.id">
          {{item.value}}
          </el-checkbox>
      </el-checkbox-group>
    </el-form-item><br>
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
    </el-form-item><br>
    <el-form-item>
      <el-select v-model="query.resumeTimeType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in options.searchTime"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="query.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('getList')" icon="el-icon-search" :disabled="!isCanSearch">查询</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default{
  name: 'hxr-search',
  props: ['query', 'specialistSwitch', 'options', 'SecondDirect', 'GRADE', 'secondChannel', 'isCanSearch'],
}
</script>
