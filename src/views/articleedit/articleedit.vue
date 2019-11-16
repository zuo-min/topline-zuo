<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <div class="text item">
        <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
          <el-form-item label="标题 :" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容 :" prop="content">
            <quillEditor v-model="editForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面 :">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道 :" prop="channel_id">
            <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editarticle()">修改</el-button>
            <el-button @click="editarticle()">存入草稿</el-button>
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
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleAdd',
  components: {
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      editForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      editFormRules: {
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
    this.getArticleByAid()
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    selectHandler (val) {
      // 把子组件传递过来的频道信息赋予给channel_id
      this.editForm.channel_id = val
    },
    getArticleByAid () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.editForm = res.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获得文章失败!' + err)
        })
    },
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(res => {
              this.$message.success('文章修改成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('修改文章失败' + err)
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
