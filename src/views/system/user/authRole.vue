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
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="系统角色" :name="1">
          <div class="table-wrapper">
            <el-table
              ref="tableRef"
              v-loading="loading"
              :data="dataList"
              border
              row-key="id"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @row-click="rowClick"
            >
              <el-table-column type="selection" reserve-selection width="50" align="center" />
              <el-table-column prop="roleCode" label="角色编号" align="center" />
              <el-table-column prop="roleName" label="角色名称" align="center" />
            </el-table>
          </div>
          <div class="pager-wrapper">
            <pagination
              :pageNum="paginationData.pageNum"
              :pageSize="paginationData.pageSize"
              :total="paginationData.total"
              :hidden="!paginationData.total"
              @pagination="findPage"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { saveUserRoleApi, findUserRoleApi } from "@/api/system/user"
import { findPageApi } from "@/api/system/role"
import { usePagination } from "@/hooks/usePagination"

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
const { paginationData } = usePagination()

/** 基本属性 */
const dialogVisible = ref<boolean>(props.show)
const loading = ref<boolean>(false)
const title = "授权角色"
const record = reactive(props.params.data[0])
const dataList = ref<any[]>([])
const tableRef = ref<any>(null)
const selectList = ref<any>([])
const activeName = ref(1)
// 查询条件
const searchData = reactive({
  username: undefined,
  phone: undefined
})

/** 计算属性 */
const selectIds = computed<string[]>(() => {
  const arr: string[] = []
  selectList.value.forEach((item: any) => {
    arr.push(item.id)
  })
  return arr
})

/** 点击标签页 */
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event)
}

/** 列表复选框 */
// 点击行勾选复选框
const rowClick = (row: any) => {
  console.log("---------row", row)
  if (selectIds.value.indexOf(row.id) > -1) {
    // 去勾
    tableRef.value?.toggleRowSelection(row, false)
    const index = selectIds.value.findIndex((item) => item === row.id)
    selectList.value.splice(index, 1)
  } else {
    // 勾选
    tableRef.value?.toggleRowSelection(row, true)
    row.roleId = row.id
    selectList.value.push(row)
  }
}
// 勾选记录
const handleSelect = (row: any) => {
  console.log("---------row", row)
  if (selectIds.value.indexOf(row.id) > -1) {
    // 去勾
    const index = selectIds.value.findIndex((item) => item === row.id)
    selectList.value.splice(index, 1)
  } else {
    // 勾选
    row.roleId = row.id
    selectList.value.push(row)
  }
}
// 全选
const handleSelectAll = (selection: any[]) => {
  console.log("---------selection", selection)
  const flag = selection.length === 0
  dataList.value.forEach((row) => {
    const index = selectIds.value.indexOf(row.id)
    console.log(index)
    if (flag) {
      // 反选
      selectList.value.splice(index, 1)
    } else {
      // 全选
      if (index === -1) {
        row.roleId = row.id
        selectList.value.push(row)
      }
    }
  })
}

/** 查询已勾选记录 */
const findUserRole = () => {
  console.log("findUserRole", record.id)
  findUserRoleApi({ modelId: record.id }).then((res: any) => {
    if (res.data) {
      selectList.value.push(res.data)
    }
    findPage()
  })
}

/** 查询列表 */
const findPage = () => {
  loading.value = true
  const params = Object.assign(searchData, {
    roleStatus: 0,
    pageNum: paginationData.pageNum,
    pageSize: paginationData.pageSize
  })
  findPageApi(params)
    .then((res) => {
      // 复选框回显
      res.data.data.forEach((item: any) => {
        if (selectIds.value.indexOf(item.id) > -1) {
          console.log("-------findPageApi", selectIds)
          tableRef.value?.toggleRowSelection(item, true)
        }
      })
      dataList.value = res.data.data
      paginationData.total = res.data.total
    })
    .catch(() => {
      dataList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 保存 */
const save = () => {
  console.log("-------selectIds", selectIds)
  loading.value = true
  saveUserRoleApi({
    userId: record.id,
    roleId: selectIds.value[0]
  })
    .then(() => {
      proxy.$modal.msgSuccess("保存成功")
      emit("refreshData")
      emit("hide")
    })
    .finally(() => {
      loading.value = false
    })
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
findUserRole()
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
