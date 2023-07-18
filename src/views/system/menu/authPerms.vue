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
      <el-transfer
        v-model="selectList"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入"
        :titles="['待授权', '已授权']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="{
          key: 'code',
          label: 'name'
        }"
        :data="dataList"
      >
        <template #default="{ option }">
          <span>{{ option.code }} - {{ option.name }}</span>
        </template>
      </el-transfer>
      <template #footer>
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { optionListApi } from "@/api/system/dictionary"
import { saveApi, findByIdApi } from "@/api/system/menu"

const { proxy } = getCurrentInstance() as any

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

/** 基本属性 */
const dialogVisible = ref<boolean>(props.show)
const title = "授权按钮"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
const dataList = ref<any[]>([])
// 穿梭框
const selectList = ref<any[]>([])
// 表单
const formData = reactive<any>({
  parentId: "-1",
  menuName: "",
  menuType: "C",
  menuCode: "",
  icon: "",
  isFrame: 0,
  routePath: "",
  pagePath: "",
  perms: "",
  query: "",
  isCache: 0,
  visible: 0,
  status: 0
})

// 穿梭框操作
/** 过滤条件 */
const filterMethod = (query: any, item: any) => {
  const label = item.code + "-" + item.name
  return label.includes(query)
}

/** 查询字典 */
const dictOptions = () => {
  optionListApi({ parentCode: "001" }).then((res) => {
    dataList.value = res.data
  })
}

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data)
    if (res.data && res.data.perms) selectList.value = res.data.perms.split(",")
  })
}

/** 保存 */
const handleSave = () => {
  console.log(selectList.value)
  const params = Object.assign(formData, {
    perms: selectList.value.join(",")
  })
  saveApi(params).then(() => {
    proxy.$modal.msgSuccess("保存成功")
    emit("refreshData")
    emit("hide")
  })
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
console.log("###初始化")
dictOptions()
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
