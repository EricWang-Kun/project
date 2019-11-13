<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="searchForm.status" @change="getArticleList()">
            <el-radio v-model="searchForm.status" label="">全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" placeholder="请选择"  clearable @change="getArticleList">
              <el-option
               v-for="item in ChannelList"
               :key="item.id"
               :label="item.name"
               :value="item.id"
               ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
            v-model="timetotime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
           </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
    <span>共找到{{tot}}条符合条件的内容</span>
  </div>
      <div class="text item">
      <el-table :data="articleList" style="width:100%;">
      <el-table-column label="头像" width="150" >
        <img :src="stData.row.cover.images[0]" slot-scope="stData" alt="没有图标" width="150" height="100">
      </el-table-column>
      <el-table-column label="标题" prop="title" width="300"></el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template slot-scope="stData">
          <el-tag v-if="stData.row.status===0">草稿</el-tag>
          <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
          <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
          <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
          <el-tag v-else type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="pubdate" width="160"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
      </el-table-column>
      </el-table>
      </div>
      <div class="text item">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 15, 20, 40]"
      :page-size="searchForm.per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tot"
      ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      tot: 0,
      // 搜索表单数据对象
      searchForm: {
        status: '',
        channel_id: '', // 频道
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      channelList: [
        { id: 201, name: 'ios' },
        { id: 202, name: 'andriod' },
        { id: 203, name: '塞班' }
      ],
      timetotime: [],
      ChannelList: [],
      articleList: []
    }
  },
  watch: {
    // 对timetotime成员进行监听
    timetotime (newval) {
      // 把newval的值拆分分别给到 begin_pubdate和end_pubdate 里边
      if (newval) {
        // 赋予时间信息
        console.log(newval)
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        // 清空
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      this.getArticleList()
    }
  },
  created () {
    this.getChannelList()
    this.getArticleList()
  },
  methods: {
    getChannelList () {
      var pro = this.$http.get('/channels')
      pro
        .then(result => {
          // console.log(result.data.message)
          if (result.data.message.toString() === 'OK') {
            this.ChannelList = result.data.data.channels
            // console.log(this.ChannelList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          console.log(result)
          if (result.data.message === 'OK') {
            // 把文章赋予给articleList成员
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
            console.log(this.articleList)
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误:' + err)
        })
    },
    handleCurrentChange (val) {
      // val: 变化后页码的值
      // console.log(val)
      // 把val赋予给searchForm.page成员
      this.searchForm.page = val
      // 根据变化后的条件，重新获得记录信息
      this.getArticleList()
    },
    // 每页数据记录条数变化的回调处理
    handleSizeChange (val) {
    // val: 变化后的页码条数
    // console.log(val)
    // 把val赋予给searchForm.per_page
      this.searchForm.per_page = val
      // 根据变化后的per_page重新获取数据
      this.getArticleList()
    }
  }
}
</script>

<style>
.el-pagination{
  margin-top:15px;
}

</style>
