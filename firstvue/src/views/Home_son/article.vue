<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label="">全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" placeholder="请选择"  clearable>
              <el-option
               v-for="item in channelList"
               :key="item.id"
               :label="item.name"
               :value="item.id"
               ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择："></el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      // 搜索表单数据对象
      searchForm: {
        status: ''
      }
    }
  }
}
</script>

<style>

</style>
