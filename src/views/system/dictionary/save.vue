<template>
  <div class="app-container">
    <!-- 新增/修改 -->
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
        <el-form-item prop="code" label="字典编号">
          <el-input v-model="formData.code" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="字典名称">
          <el-input v-model="formData.name" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上级字典">
          <el-tree-select
            v-model="formData.parentId"
            :data="dictOption"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="选择上级菜单"
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="formData.status" placeholder="请输入" style="width: 100%">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { saveApi, findByIdApi, findTreeApi } from "@/api/system/dictionary"
import { statusOption } from "@/api/system/dictionary/option"

const { proxy } = getCurrentInstance() as any

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

/** 基本属性 */
const dialogVisible = ref<boolean>(props.show)
const title = props.data && props.data.id ? "编辑" : "新增"
const record = reactive(props.data)
const loading = ref<boolean>(false)
// 字典树
const dictOption = ref<any[]>([])
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  code: "",
  name: "",
  parentId: "-1",
  parentCode: "",
  status: 0
})
const formRules: any = reactive({
  code: [{ required: true, trigger: "blur", message: "不能为空" }],
  name: [{ required: true, trigger: "blur", message: "不能为空" }],
  status: [{ required: true, trigger: "change", message: "不能为空" }]
})

/** 查询字典树 */
const findTree = () => {
  loading.value = true
  findTreeApi({})
    .then((res) => {
      const dict = { id: "-1", name: "主类目", children: [] }
      dict.children = res.data
      dictOption.value.push(dict)
      console.log(dictOption.value)
    })
    .catch(() => {
      const dict = { id: "-1", name: "主类目", children: [] }
      dictOption.value.push(dict)
    })
    .finally(() => {
      loading.value = false
    })
}

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data)
  })
}

/** 保存 */
const handleSave = () => {
  formRef.value?.validate((valid: boolean) => {
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
findTree()
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
