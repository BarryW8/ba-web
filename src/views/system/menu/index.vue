<template>
  <div class="app-container">
    <el-card v-show="showSearch" shadow="never" class="search-wrapper">
      <el-form ref="searchRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
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
          <el-button v-permission="1" type="success" icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="info" icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
        </div>
        <div>
          <el-tooltip placement="top" content="隐藏搜索">
            <el-button type="primary" :icon="showSearch ? 'View' : 'Hide'" circle @click="showSearch = !showSearch" />
          </el-tooltip>
          <el-tooltip placement="top" content="刷新">
            <el-button type="primary" icon="RefreshRight" circle @click="findTree" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          v-if="refreshTable"
          ref="tableRef"
          v-loading="loading"
          :data="dataList"
          :default-expand-all="isExpandAll"
          row-key="id"
          border
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column prop="menuName" label="菜单名称" width="150" align="center" />
          <el-table-column prop="icon" label="图标" align="center" width="100">
            <template #default="scope">
              <svg-icon :name="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="orderBy" label="排序" align="center" />
          <el-table-column prop="menuCode" label="菜单标识" align="center" />
          <el-table-column prop="perms" label="权限标识" align="center" />
          <el-table-column prop="routePath" label="路由路径" align="center" show-overflow-tooltip />
          <el-table-column prop="pagePath" label="文件路径" align="center" show-overflow-tooltip />
          <el-table-column
            prop="menuType"
            label="菜单类型"
            align="center"
            :formatter="formatter"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button v-permission="2" type="primary" plain size="small" @click.stop="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                v-show="scope.row.menuType === 'C'"
                v-permission="4"
                type="success"
                plain
                size="small"
                @click.stop="handleAuthPerms(scope.row)"
                >按钮</el-button
              >
              <el-button v-permission="3" type="danger" plain size="small" @click.stop="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <Save
      v-if="saveVisible"
      :show="saveVisible"
      :params="subParams"
      @hide="saveVisible = false"
      @refreshData="findTree"
    />
    <AuthPerms
      v-if="authPermsVisible"
      :show="authPermsVisible"
      :params="subParams"
      @hide="authPermsVisible = false"
      @refreshData="findTree"
    />
  </div>
</template>

<script name="Menu" lang="ts" setup>
import { findTreeApi, deleteByIdApi } from "@/api/system/menu"
import SvgIcon from "@/components/SvgIcon/index.vue"
import Common from "@/utils/common"
import Save from "./save.vue"
import AuthPerms from "./authPerms.vue"

const { proxy } = getCurrentInstance() as any

/** 基本属性 */
const loading = ref<boolean>(false)
const dataList = ref<any[]>([])
const tableRef = ref<any>(null)
const currentRow = ref(null)
// 查询条件
const showSearch = ref<boolean>(true)
const searchRef = ref<any>(null)
const searchData = reactive({
  username: undefined,
  phone: undefined
})
// 菜单树
const refreshTable = ref<boolean>(true)
const isExpandAll = ref<boolean>(false)
// 子组件
const saveVisible = ref<boolean>(false)
const authPermsVisible = ref<boolean>(false)
const subParams = reactive({
  data: null,
  opt: ""
})

/** 当前选中行 */
const rowClick = (row: any) => {
  // 当前行为空 或 切换选中行
  if (currentRow.value !== row) {
    currentRow.value = row
  } else {
    // 取消高亮状态
    tableRef.value.setCurrentRow(null)
    currentRow.value = null
  }
}

/** 展开/折叠 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 查询列表 */
const findTree = () => {
  loading.value = true
  findTreeApi(searchData)
    .then((res) => {
      dataList.value = Common.menu2Tree(res.data)
      // 清空选中
      tableRef.value.setCurrentRow(null)
      currentRow.value = null
    })
    .catch(() => {
      dataList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSearch = () => {
  findTree()
}
const resetSearch = () => {
  searchRef.value.resetFields()
}

/** 新增 */
const handleAdd = () => {
  if (currentRow.value && currentRow.value.menuType === "C") {
    proxy.$modal.msgWarning("禁止对<菜单>进行新增操作")
    return
  }
  saveVisible.value = true
  subParams.data = currentRow.value
  subParams.opt = "add"
}

/** 编辑 */
const handleEdit = (row: any) => {
  saveVisible.value = true
  subParams.data = row
  subParams.opt = "edit"
}

/** 授权按钮 */
const handleAuthPerms = (row?: any) => {
  authPermsVisible.value = true
  subParams.data = row
  subParams.opt = "authPerms"
}

/** 删除 */
const handleDelete = (row: any) => {
  proxy.$modal
    .confirm(`正在删除：${row.menuName}，是否继续？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      deleteByIdApi({ modelId: row.id }).then(() => {
        proxy.$modal.msgSuccess("删除成功")
        findTree()
      })
    })
    .catch(() => {})
}

// 格式化数据
const formatter = (row: any, column: any, cellValue: any, index: number) => {
  console.log(row.menuType)
  console.log(cellValue)
  if (column.property === "menuType") {
    switch (cellValue) {
      case "M":
        cellValue = "目录"
        break
      case "C":
        cellValue = "菜单"
        break
    }
  }
  return cellValue
}

/** 初始化 */
console.log("###初始化")
findTree()
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
