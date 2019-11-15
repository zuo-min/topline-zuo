<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
          <el-form-item label="标题 :" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容 :" prop="content">
              <quillEditor v-model="addForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面 :">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道 :" prop="channel_id">
            <el-select v-model="addForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addarticle()">发布</el-button>
            <el-button @click="addarticle()">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ArticleAdd',
  components: {
    quillEditor
  },
  data () {
    return {
      channelList: [],
      addForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
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
        .then(res => {
          if (res.data.message === 'OK') {
            this.channelList = res.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.err('获取文章频道出错' + err)
        })
    },
    // flag = true 发布草稿
    // flag = false 正式发布
    addarticle (flag) {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          var pro = this.$http.post('/articles', this.addForm, { params: { draft: flag } })
          pro
            .then(res => {
              this.$message.success('文章发布成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    }
  }
}

</script>

<style lang="less" scoped>

.quill-editor /deep/ .ql-container {
  height: 200px;
}
</style>
