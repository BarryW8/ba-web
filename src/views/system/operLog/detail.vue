<template>
  <div class="app-container">
    <el-dialog
      v-model="dialogVisible"
      v-loading="loading"
      :title="title"
      :close-on-click-modal="false"
      draggable
      width="700"
      @close="hide"
    >
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="业务名称">{{ formData.business }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ formData.operatorName }}</el-descriptions-item>
        <el-descriptions-item label="操作人电话">{{ formData.operatorPhone }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag size="small">School</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="主机地址">{{ formData.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作地点">{{ formData.operLocation }}</el-descriptions-item>
        <el-descriptions-item label="操作日期">{{ formData.operTime }}</el-descriptions-item>
      </el-descriptions>
      <div style="height: 30px;" />
      <el-descriptions title="请求相关" :column="2" border>
        <el-descriptions-item label="方法名">{{ formData.method }}</el-descriptions-item>
        <el-descriptions-item label="请求URL">{{ formData.operUrl }}</el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ formData.reqType }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">{{ formData.reqParam }}</el-descriptions-item>
      </el-descriptions>
      <div style="height: 30px;" />
      <el-descriptions title="响应相关" :column="2" border>
        <el-descriptions-item label="响应状态">{{ formData.status }}</el-descriptions-item>
        <el-descriptions-item label="错误信息">{{ formData.errorMsg }}</el-descriptions-item>
        <el-descriptions-item label="消耗时间">{{ formData.costTime }}</el-descriptions-item>
        <el-descriptions-item label="响应参数">{{ formData.resParam }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="hide">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { findOperTypeApi, findByIdApi } from "@/api/system/operLog"

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
const title = "详情"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
const operTypes = ref<any>({})
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  userName: "",
  telephone: "",
  email: "",
  sex: ""
})

/** 获取操作类型 */
const findOperType = () => {
  findOperTypeApi().then((res) => {
    operTypes.value = res.data
  })
}

const transfer = (code: string) => {
  console.log(operTypes.value)
  console.log(code)
  return operTypes.value[code];
}

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data)
  })
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
console.log("###初始化")
if (record && record.id) {
  findById()
  findOperType()
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
