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
        <el-form-item prop="roleCode" label="角色编号">
          <el-input v-model="formData.roleCode" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="formData.roleName" maxlength="30" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="roleStatus" label="角色状态">
          <el-radio-group v-model="formData.roleStatus">
            <el-radio :label="0" border>正常</el-radio>
            <el-radio :label="1" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect">父子联动</el-checkbox>
          <el-tree
            ref="treeRef"
            class="tree-border"
            :data="menuOption"
            show-checkbox
            :default-checked-keys="permList"
            node-key="treeId"
            :check-strictly="!menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'menuName', children: 'children' }"
          />
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
import { saveApi, findByIdApi } from "@/api/system/role"
import { findTreePermsApi } from "@/api/system/menu"

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
const title = props.params.data && props.params.data.id ? "编辑" : "新增"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
// 菜单树
const treeRef = ref<any>(null)
const permList = ref<any[]>([])
const menuOption = ref<any[]>([])
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuCheckStrictly = ref(true)
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  roleCode: "",
  roleName: "",
  roleStatus: 0,
  orderBy: 0
})
const formRules = reactive({
  roleCode: [{ required: true, trigger: "blur", message: "角色编号不能为空" }],
  roleName: [{ required: true, trigger: "blur", message: "角色名称不能为空" }],
  roleStatus: [{ required: true, trigger: "change", message: "角色状态不能为空" }]
})

// 菜单树操作
/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: any) => {
  const treeList = menuOption.value
  for (let i = 0; i < treeList.length; i++) {
    treeRef.value.store.nodesMap[treeList[i].treeId].expanded = value
  }
}
/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any) => {
  treeRef.value.setCheckedNodes(value ? menuOption.value : [])
}
/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any) => {
  menuCheckStrictly.value = value ? true : false
}

/** 查询详情 */
const findById = () => {
  findByIdApi({ modelId: record.id }).then((res) => {
    Object.assign(formData, res.data.roleInfo)
    permList.value = res.data.permList
  })
}

/** 查询菜单树 */
const findTree = () => {
  loading.value = true
  findTreePermsApi()
    .then((res) => {
      menuOption.value = res.data
    })
    .catch(() => {
      menuOption.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 保存 */
const handleSave = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params = Object.assign(formData, {
        permList: treeRef.value.getCheckedNodes(true)
      })
      loading.value = true
      saveApi(params)
        .then(() => {
          proxy.$modal.msgSuccess("保存成功")
          emit("refreshData")
          emit("hide")
        })
        .finally(() => {
          loading.value = false
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

/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
  width: 100%;
}
</style>
