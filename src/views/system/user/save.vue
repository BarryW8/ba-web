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
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="roleStatus" label="用户状态">
          <el-radio-group v-model="formData.userStatus">
            <el-radio :label="0" border>正常</el-radio>
            <el-radio :label="1" border>停用</el-radio>
          </el-radio-group>
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
import { saveApi, findByIdApi } from "@/api/system/user"

const props = withDefaults(
  defineProps<{
    show: boolean
    data: any
    opt?: string
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
const title = props.data && props.data.id ? "编辑" : "新增"
const record = reactive(props.data)
const loading = ref<boolean>(false)
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  id: record.id,
  userName: "",
  telephone: "",
  email: "",
  sex: ""
})
const formRules = reactive({
  userName: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  telephone: [
    { required: true, trigger: "blur", message: "手机号不能为空" },
    { min: 11, max: 11, trigger: "blur", message: "手机号不合法" }
  ]
})

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data)
  })
}

/** 保存 */
const handleSave = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      saveApi(formData).then(() => {
        proxy.$modal.msgSuccess("保存成功")
        emit("refreshData")
        emit("hide")
      })
    } else {
      return false
    }
  })
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
console.log("###初始化")
if (record && record.id) {
  findById()
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
