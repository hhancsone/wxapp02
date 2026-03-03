<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="user_id" label="用户ID" required>
        <uni-easyinput placeholder="收藏用户的ID" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="user_nickname" label="用户昵称">
        <uni-easyinput placeholder="收藏用户的昵称" v-model="formData.user_nickname"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="herb_id" label="药材ID" required>
        <uni-easyinput placeholder="被收藏的药材ID" v-model="formData.herb_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="herb_name" label="药材名称">
        <uni-easyinput placeholder="被收藏的药材名称" v-model="formData.herb_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="herb_image" label="药材图片">
        <uni-easyinput placeholder="被收藏的药材图片URL" v-model="formData.herb_image"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="收藏时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/shoucang.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'shoucang';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "user_id": "",
        "user_nickname": "",
        "herb_id": "",
        "herb_name": "",
        "herb_image": "",
        "create_date": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
