<template>
  <div class="app-container">
    <el-card v-show="showSearch" shadow="never" class="search-wrapper">
      <el-form ref="searchRef" :inline="true" :model="searchData">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="searchData.userName" placeholder="请输入" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button v-permission="1" type="success" icon="CirclePlus" @click="handleAdd">新增</el-button>
          <!-- <el-button type="danger" icon="Delete" :disabled="isSelect" @click="handleDelete()">批量删除</el-button> -->
          <el-button v-permission="4" type="primary" icon="Avatar" :disabled="isSingle" @click="handleAuthRole"
            >授权角色</el-button
          >
        </div>
        <div>
          <el-tooltip placement="top" content="隐藏搜索">
            <el-button type="primary" :icon="showSearch ? 'View' : 'Hide'" circle @click="showSearch = !showSearch" />
          </el-tooltip>
          <el-tooltip placement="top" content="刷新">
            <el-button type="primary" icon="RefreshRight" circle @click="findPage" />
          </el-tooltip>
        </div>
      </div>
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
          <el-table-column prop="userName" label="用户名" align="center" />
          <!-- <el-table-column prop="roleName" label="所属角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roleName" type="warning" effect="plain">{{ scope.row.roleName }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="telephone" label="手机号" align="center" show-overflow-tooltip />
          <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip />
          <el-table-column prop="userStatus" label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.userStatus" type="danger" effect="dark">停用</el-tag>
              <el-tag v-else type="success" effect="dark">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button v-permission="2" type="primary" plain size="small" @click.stop="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button v-permission="3" type="danger" plain size="small" @click.stop="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
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
    </el-card>
    <!-- 不能直接在自定义组件上使用 v-if，否则会有警告：Runtime directive used on component with non-element root node. The directives will not function as intended. -->
    <Save
      v-if="saveVisible"
      :show="saveVisible"
      :params="subParams"
      @hide="saveVisible = false"
      @refreshData="findPage"
    />
    <AuthRole
      v-if="authRoleVisible"
      :show="authRoleVisible"
      :params="subParams"
      @hide="authRoleVisible = false"
      @refreshData="findPage"
    />
  </div>
</template>

<script name="User" lang="ts" setup>
import { findPageApi, deleteByIdApi } from "@/api/system/user"
import { usePagination } from "@/hooks/usePagination"
import Save from "./save.vue"
import AuthRole from "./authRole.vue"

const { proxy } = getCurrentInstance() as any
const { paginationData } = usePagination()

/** 基本属性 */
const loading = ref<boolean>(false)
const dataList = ref<any[]>([])
const tableRef = ref<any>(null)
const selectList = ref<any>([])
// 查询条件
const searchRef = ref<any>(null)
const showSearch = ref<boolean>(true)
const searchData = reactive({
  userName: undefined,
  phone: undefined
})
// 子组件
const saveVisible = ref<boolean>(false)
const authRoleVisible = ref<boolean>(false)
const subParams = reactive({
  data: null,
  opt: ""
})

/** 计算属性 */
// 选中记录ID
const selectIds = computed<string[]>(() => {
  const arr: string[] = []
  selectList.value.forEach((item: any) => {
    arr.push(item.id)
  })
  return arr
})
// 选中记录名称
const selectNames = computed<string[]>(() => {
  const arr: string[] = []
  selectList.value.forEach((item: any) => {
    arr.push(item.userName)
  })
  return arr
})
// 是否选中单条记录
const isSingle = computed<boolean>(() => {
  return selectList.value.length !== 1
})
// 是否选中记录
const isSelect = computed<boolean>(() => {
  return selectList.value.length === 0
})

/** 列表复选框 */
// 点击行勾选复选框
const rowClick = (row: any) => {
  console.log("---------row", row)
  if (selectIds.value.indexOf(row.id) > -1) {
    console.log("去勾")
    // 去勾
    tableRef.value.toggleRowSelection(row, false)
    const index = selectIds.value.findIndex((item) => item === row.id)
    selectList.value.splice(index, 1)
  } else {
    console.log("勾选")
    // 勾选
    tableRef.value.toggleRowSelection(row, true)
    selectList.value.push(row)
  }
}
// 勾选记录
const handleSelect = (selection: any[], row: any) => {
  console.log("---------selection", selection)
  console.log("---------row", row)
  if (selectIds.value.indexOf(row.id) > -1) {
    console.log("去勾")
    // 去勾
    const index = selectIds.value.findIndex((item) => item === row.id)
    selectList.value.splice(index, 1)
  } else {
    console.log("勾选")
    // 勾选
    selectList.value.push(row)
  }
}
// 全选
const handleSelectAll = (selection: any[]) => {
  console.log("---------selection", selection)
  const flag = selection.length === 0
  dataList.value.forEach((item) => {
    const index = selectIds.value.indexOf(item.id)
    console.log(index)
    if (flag) {
      // 反选
      selectList.value.splice(index, 1)
    } else {
      // 全选
      if (index === -1) {
        selectList.value.push(item)
      }
    }
  })
}

/** 查询列表 */
const findPage = (data?: any) => {
  if (data?.pageNum) paginationData.pageNum = data.pageNum
  if (data?.pageSize) paginationData.pageSize = data.pageSize

  loading.value = true
  const params = Object.assign(searchData, {
    pageNum: paginationData.pageNum,
    pageSize: paginationData.pageSize
  })
  findPageApi(params)
    .then((res) => {
      dataList.value = res.data.data
      paginationData.total = res.data.total
      // 清空选中
      tableRef.value.clearSelection()
      selectList.value = []
    })
    .catch(() => {
      dataList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.pageNum = 1
  findPage()
}
const resetSearch = () => {
  searchRef.value.resetFields()
}

/** 新增 */
const handleAdd = () => {
  saveVisible.value = true
  subParams.data = null
  subParams.opt = "add"
}

/** 编辑 */
const handleEdit = (row: any) => {
  saveVisible.value = true
  subParams.data = row
  subParams.opt = "edit"
}

/** 删除 */
const handleDelete = (row?: any) => {
  const label = row ? row.userName : selectNames.value.join(",")
  proxy.$modal
    .confirm(`正在删除：${label}，是否继续？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      deleteByIdApi({ modelId: row.id }).then(() => {
        proxy.$modal.msgSuccess("删除成功")
        findPage()
      })
    })
}

/** 授权角色 */
const handleAuthRole = () => {
  if (proxy.$common.checkSingle(isSingle.value)) return
  const record = selectList.value[0]
  if (!record.appType) {
    proxy.$modal.msgWarning("应用类型不能为空")
    return
  }
  authRoleVisible.value = true
  subParams.data = record
  subParams.opt = "edit"
}

/** 初始化 */
console.log("===初始化")
findPage()
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
