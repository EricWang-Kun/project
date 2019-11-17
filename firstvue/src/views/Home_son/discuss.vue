<template>
  <div>
      <template>
  <el-table
    :data="tableData"
    height="250"
    border
    style="width: 100%">
    <el-table-column
      prop="title"
      label="标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="评论状态"
      width="180">
    </el-table-column>
    <el-table-column
      prop="discuss_number"
      label="总评论数">
    </el-table-column>
    <el-table-column
      prop="munber_discuss_number"
      label="粉丝评论数">
    </el-table-column>
    <el-table-column
      label="操作">
    </el-table-column>
  </el-table>
</template>
  </div>
</template>

<script>
export default {
  name: 'Discuss',
  data () {
    return {
      tableData: {}
    }
  },
  created () {
    // this.getdiscuss()
  },
  methods: {
    getdiscuss () {
      let pro = this.$http.get('/comments')
      pro
        .then(result => {
          console.log(result)
          if (result.data.message === 'OK') {
            // 把文章赋予给articleList成员
            // this.tableData = result.data.data.results
            console.log(result.data)
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误:' + err)
        })
    }
  }

}
</script>

<style>

</style>
