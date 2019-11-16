<template>
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  // 接收父组件传来的cid数据信息
  props: {
    cid: {
      default: 0// 设置默认值
    }
  },
  watch: {
    // 监听cid
    cid: function (newV, oldV) {
      this.chid = newV
    },
    // 监听自己的chid
    chid: function (newV, oldV) {
      // 调用自己的slt方法 把chid数据传给父组件
      this.$emit('slt', this.chid)
    }
  },
  data () {
    return {
      chid: '',
      channelList: []
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
