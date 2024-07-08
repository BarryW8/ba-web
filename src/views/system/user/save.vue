<template>
  <div class="app-container">
    <el-dialog
      v-model="dialogVisible"
      v-loading="loading"
      :title="title"
      :close-on-click-modal="false"
      draggable
      width="500"
      @close="hide"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="formData.userName" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="formData.nickName" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="realName" label="姓名">
          <el-input v-model="formData.realName" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="telephone" label="手机号">
          <el-input v-model="formData.telephone" maxlength="11" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="birthday" label="生日">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="1" border>男</el-radio>
            <el-radio :label="0" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="userStatus" label="用户状态">
          <el-radio-group v-model="formData.userStatus">
            <el-radio :label="0" border>正常</el-radio>
            <el-radio :label="1" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="appType" label="应用类型">
          <el-select
            v-model="appTypeSelected"
            multiple
            filterable
            clearable
            placeholder="请选择"
            popper-class="custom-header"
            style="width: 100%"
          >
            <template #header>
              <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                全选
              </el-checkbox>
            </template>
            <el-option v-for="item in appTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <imageUpload v-model="fileList" limit="1" @updateFileList="updateFileList" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { addApi, editApi, findByIdApi } from "@/api/system/user"

const props = withDefaults(
  defineProps<{
    show: boolean
    params: any
  }>(),
  {
    show: false
  }
)
const emit = defineEmits<{
  (e: "refreshData"): void
  (e: "hide"): void
}>()

const { proxy } = getCurrentInstance() as any

/** 基本属性 */
const dialogVisible = ref<boolean>(props.show)
const pageType = ref<string>(props.params.opt)
const title = pageType.value === "add" ? "新增" : "编辑"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
const checkAll = ref(false) // 全选
const indeterminate = ref(false)
const appTypeSelected = ref<any>([]) // 已选的应用类型
const appTypes = ref([
  {
    value: "1",
    label: "WEB"
  },
  {
    value: "2",
    label: "Thinking APP"
  },
  {
    value: "3",
    label: "小程序"
  }
])
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  userName: "",
  telephone: "",
  email: "",
  sex: "",
  appType: ""
})
const formRules = reactive({
  userName: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  telephone: [
    { required: true, trigger: "blur", message: "手机号不能为空" },
    { min: 11, max: 11, trigger: "blur", message: "手机号不合法" }
  ],
  appType: [{ required: true, trigger: "change", message: "应用类型不能为空" }]
})
// 文件上传
const fileList = ref<any>([])

watch(appTypeSelected, (val) => {
  formData.appType = val.join(",")
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === appTypes.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

/** 应用类型 全选 */
const handleCheckAll = (val: any) => {
  indeterminate.value = false
  if (val) {
    appTypeSelected.value = appTypes.value.map((item) => item.value)
  } else {
    appTypeSelected.value = []
  }
}

/** 文件上传 */
const updateFileList = (val: any) => {
  fileList.value = val
  console.log(val)
}

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data)
    if (res.data.avatar) fileList.value = JSON.parse(res.data.avatar)
    if (res.data.appType) appTypeSelected.value = res.data.appType.split(",")
    console.log(fileList.value)
  })
}

/** 保存 */
const handleSave = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params = Object.assign(formData, {
        avatar: fileList.value.length ? JSON.stringify(fileList.value) : null
        // appType: appTypeSelected.value.join(",")
      })
      save(params)
    } else {
      return false
    }
  })
}
const save = (params: any) => {
  if (pageType.value === "add") {
    addApi(params).then(() => {
      proxy.$modal.msgSuccess("新增成功")
      emit("refreshData")
      emit("hide")
    })
  } else {
    editApi(params).then(() => {
      proxy.$modal.msgSuccess("编辑成功")
      emit("refreshData")
      emit("hide")
    })
  }
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
console.log("###初始化")
if (record && record.id) {
  findById()
}
</script>

<style lang="scss" scoped></style>
