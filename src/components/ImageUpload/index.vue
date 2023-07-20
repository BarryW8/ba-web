<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      action=""
      list-type="picture-card"
      :http-request="upload"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
      :limit="limit"
      :on-error="onError"
      :on-exceed="onExceed"
      ref="imageUpload"
      :on-remove="onRemove"
      :show-file-list="true"
      :file-list="showFileList"
      :on-preview="onPreview"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><plus /></el-icon>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog v-model="dialogVisible" title="预览" width="800px" append-to-body>
      <img :src="baseUrl + dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { uploadApi, getBaseUrlApi } from "@/api/upload"

const props = withDefaults(
  defineProps<{
    modelValue: [String, Object, Array<any>]
    limit: number // 图片数量限制
    fileSize: number // 大小限制(MB)
    fileType: Array<string> // 文件类型
    isShowTip: boolean // 是否显示提示
  }>(),
  {
    limit: 5,
    fileSize: 5,
    fileType: () => ["png", "jpg", "jpeg"],
    isShowTip: true
  }
)
const emit = defineEmits<{
  (e: "updateFileList"): any
}>()

const { proxy } = getCurrentInstance() as any

const number = ref<boolean>(0)
const dialogImageUrl = ref<string>("")
const dialogVisible = ref<boolean>(false)
const baseUrl = "http://127.0.0.1:8888/file-server/showFile/"
// const baseUrl = import.meta.env.VITE_APP_BASE_API
// const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload") // 上传的图片服务器地址
const fileList = ref([])

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fileList.value = val
    } else {
      fileList.value = []
    }
  },
  { deep: true, immediate: true }
)

/** 计算属性 */
// 展示列表
const showFileList = computed(() => {
  const arr = []
  fileList.value.forEach((item) => {
    item.url = baseUrl + item.normalUrl
    arr.push(item)
  })
  return arr
})
// 显示提示
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize))

// 上传接口
const upload = (data) => {
  // // 显示进度条
  // this.$emit('uploadChange')
  // 封装文件对象
  const formData = new FormData()
  formData.append("fileType", 0)
  formData.append("file", data.file)
  uploadApi(formData).then((res) => {
    if (res.code === 200) {
      proxy.$modal.msgSuccess("上传成功")
      data.onSuccess(res)
    } else {
      proxy.$modal.msgError("上传失败")
    }
  })
}

// 上传前loading加载
const beforeUpload = (file) => {
  let isImg = false
  if (props.fileType.length) {
    let fileExtension = ""
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1)
    }
    isImg = props.fileType.some((type) => {
      if (file.type.indexOf(type) > -1) return true
      if (fileExtension && fileExtension.indexOf(type) > -1) return true
      return false
    })
  } else {
    isImg = file.type.indexOf("image") > -1
  }
  if (!isImg) {
    proxy.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`)
    return false
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      proxy.$modal.msgError(`上传图片大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  proxy.$modal.loading("正在上传图片，请稍候...")
  number.value++
}

// 文件个数超出
const onExceed = () => {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传成功回调
const onSuccess = (res) => {
  fileList.value.push(res.data)
  emit("updateFileList", fileList.value)
  proxy.$modal.closeLoading()
}

// 删除图片
const onRemove = (file) => {
  const findex = fileList.value.map((f) => f.name).indexOf(file.name)
  if (findex > -1) {
    fileList.value.splice(findex, 1)
    emit("updateFileList", fileList.value)
    return false
  }
}

// 上传失败
const onError = () => {
  proxy.$modal.msgError("上传图片失败")
  proxy.$modal.closeLoading()
}

// 预览
const onPreview = (file) => {
  dialogImageUrl.value = file.normalUrl
  dialogVisible.value = true
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = ""
  separator = separator || ","
  for (const i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf("blob:") !== 0) {
      strs += list[i].url.replace(baseUrl, "") + separator
    }
  }
  return strs != "" ? strs.substr(0, strs.length - 1) : ""
}
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
</style>
