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
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
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
      articlelist: []
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
    }
  },
  created () {
    this.getChannelList()
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
    }
  }
}
</script>

<style>

</style>
