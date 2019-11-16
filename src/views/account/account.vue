<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户管理</span>
    </div>
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="用户名: " prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码: ">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱: " prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介: ">
            <el-input v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount">更新用户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <el-upload
        action=""
        :show-file-list="false"
        :http-request="httpRequest"
        >
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        id: '',
        name: '',
        mobile: '',
        email: '',
        intro: ''
      },
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // res是一个对象，里面有正在上传的图片信息(res.file)
    httpRequest (res) {
      let fd = new FormData()
      // 把图片信息添加给fd对象
      fd.append('photo', res.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.accountForm.photo = res.data.data.photo
            this.$message.success('头像更新成功')
          }
        })
        .catch(err => {
          return this.$message.error('头像更新失败' + err)
        })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.accountForm = res.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取账户信息错误' + err)
        })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(res => {
              if (res.data.message === 'OK') {
                this.$message.success('修改账号信息成功')
              }
            })
            .catch(err => {
              return this.$message.error('修改账户信息错误' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 40%;
  }
  .rt {
    width: 30%;
  }
}
</style>
