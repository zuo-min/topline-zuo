<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态 :">
            <el-radio-group v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表 :">
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择 :">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList">
          <!-- prop: 定义当前列数据来源的字段名称，来自data数据对象的成员属性名字 -->
          <el-table-column label="图标">
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="没有图标"
              width="150"
              height="100"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题" width="300"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="info">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="success">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <!-- 把要修改的文章的id传给修改文章的路由aid -->
              <el-button type="primary" size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
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
      timetotime: '',
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      channelList: [],
      articleList: [],
      tot: 0
    }
  },
  created () {
    this.getChannelList()
    this.getArticleList()
  },
  watch: {
    timetotime (newval) {
      if (newval) {
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    },
    searchForm: {
      handler: function (newv, oldv) {
        this.getArticleList()
      },
      deep: true
    }
  },
  methods: {
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let pro = this.$http.delete(`/articles/${id}`)
          pro
            .then(res => {
              this.$message.success('文章删除成功!')
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章错误：' + err)
            })
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      this.searchForm.per_page = val
      // this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      // this.getArticleList()
    },
    getChannelList () {
      var pro = this.$http.get('/channels')
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.channelList = res.data.data.channels
            // console.log(res)
          }
        })
        .catch(err => {
          return this.$message.err('获取文章频道出错' + err)
        })
    },
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }
      var pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            // console.log(res)
            this.articleList = res.data.data.results
            this.tot = res.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.err('获取文章列表出错' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
