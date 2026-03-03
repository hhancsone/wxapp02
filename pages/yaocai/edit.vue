<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="images" label="药材封面图">
        <uni-file-picker v-model="formData.images" file-mediatype="image" mode="grid" :image-styles="imageStyles"></uni-file-picker>
      </uni-forms-item>
      <view class="form-row">
        <view class="form-row-item">
          <uni-forms-item name="name" label="药材名称" required>
            <uni-easyinput placeholder="药材的中文名称" v-model="formData.name"></uni-easyinput>
          </uni-forms-item>
        </view>
        <view class="form-row-item">
          <uni-forms-item name="latin_name" label="拉丁学名">
            <uni-easyinput placeholder="药材的拉丁学名" v-model="formData.latin_name"></uni-easyinput>
          </uni-forms-item>
        </view>
      </view>
      <uni-forms-item name="medicinal_part" label="药用部位">
        <uni-easyinput placeholder="药材的药用部位，如根、茎、叶、花、果实等" v-model="formData.medicinal_part"></uni-easyinput>
      </uni-forms-item>
      <view class="form-row">
        <view class="form-row-item">
          <uni-forms-item name="taste" label="性味">
            <uni-easyinput placeholder="药材的性质和味道" v-model="formData.taste"></uni-easyinput>
          </uni-forms-item>
        </view>
        <view class="form-row-item">
          <uni-forms-item name="meridian" label="归经">
            <uni-easyinput placeholder="药材归经的经络" v-model="formData.meridian"></uni-easyinput>
          </uni-forms-item>
        </view>
      </view>
      <uni-forms-item name="efficacy" label="功效">
        <uni-easyinput placeholder="药材的主要功效" v-model="formData.efficacy"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="indication" label="主治">
        <uni-easyinput placeholder="药材主治的病症" v-model="formData.indication"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="category" label="分类">
        <uni-data-select class="category-select" collection="fenlei" field="name as value, name as text" orderby="sort asc" v-model="formData.category" placeholder="请选择药材分类"></uni-data-select>
      </uni-forms-item>
      <view class="form-row">
        <view class="form-row-item">
          <uni-forms-item name="views" label="浏览量">
            <uni-number-box v-model="formData.views"></uni-number-box>
          </uni-forms-item>
        </view>
        <view class="form-row-item">
          <uni-forms-item name="create_date" label="创建时间">
            <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
          </uni-forms-item>
        </view>
      </view>
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
  import { validator } from '../../js_sdk/validator/yaocai.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'yaocai';

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
        "images": [],
        "name": "",
        "latin_name": "",
        "medicinal_part": "",
        "taste": "",
        "meridian": "",
        "efficacy": "",
        "indication": "",
        "category": "",
        "views": null,
        "create_date": null
      }
      return {
        formData,
        formOptions: {},
        imageStyles: {
          "height": "150rpx",
          "width": "150rpx",
          "border": {
            "color": "#eee",
            "width": "2rpx",
            "style": "solid",
            "radius": "10rpx"
          }
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
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
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("images,name,latin_name,medicinal_part,taste,meridian,efficacy,indication,category,views,create_date").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style>
  .form-row {
    display: flex;
    flex-direction: row;
  }
  .form-row-item {
    flex: 1;
    margin-right: 10px;
  }
  .form-row-item:last-child {
    margin-right: 0;
  }
  .category-select ::v-deep .uni-select__selector {
    max-height: 250px;
    overflow-y: auto;
  }
</style>
