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
        <el-form-item prop="code" label="字典编号">
          <el-input v-model="formData.code" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="字典名称">
          <el-input v-model="formData.name" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上级字典">
          <el-tree-select
            ref="treeSelectRef"
            v-model="formData.parentId"
            :data="dictOption"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="选择上级菜单"
            check-strictly
            style="width: 100%"
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="formData.status" placeholder="请输入" style="width: 100%">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderBy">
          <el-input-number v-model="formData.orderBy" controls-position="right" :min="0" style="width: 100%" />
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
import { addApi, editApi, findByIdApi, findTreeApi } from "@/api/system/dictionary"
import { statusOption } from "@/api/system/dictionary/option"

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
const pageType = ref<string>(props.params.opt)
const title = pageType.value === "add" ? "新增" : "编辑"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
// 字典树
const treeSelectRef = ref<any>(null)
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
  status: [{ required: true, trigger: "change", message: "不能为空" }],
  orderBy: [{ required: true, trigger: "blur", message: "显示排序不能为空" }]
})

// 字典树操作
/** 选中树节点 */
const handleNodeClick = () => {
  console.log("handleNodeClick---------", treeSelectRef.value.getCurrentNode())
  formData.parentCode = treeSelectRef.value.getCurrentNode()?.code
}

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
      save(formData)
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
findTree()
if (props.params.opt === "add") {
  if (record && record.id) {
    formData.parentId = record.id
    formData.parentCode = record.code
  }
} else if (props.params.opt === "edit") {
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
