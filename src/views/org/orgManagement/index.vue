<template>
  <div class="app-container">
    <el-card v-show="showSearch" shadow="never" class="search-wrapper">
      <!-- 查询条件 -->
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
        <!-- 操作按钮 -->
        <div>
          <el-button v-permission="1" type="success" icon="CirclePlus" @click="handleAdd">新增</el-button>
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
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="code" label="组织编码" align="center" show-overflow-tooltip />
          <el-table-column prop="name" label="组织名称" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="parentName" label="上级组织" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="type" label="组织类型" align="center" :formatter="formatter" />
          <el-table-column prop="isAttendance" label="是否考勤" align="center" :formatter="formatter" />
          <el-table-column prop="workTime" label="工作时间" width="200" align="center" show-overflow-tooltip>
            <template #default="scope">
              {{
                scope.row.isRest
                  ? scope.row.workBegTime + "-" + scope.row.workEndTime
                  : scope.row.workBegTime +
                    "-" +
                    scope.row.restBegTime +
                    "," +
                    scope.row.restEndTime +
                    "-" +
                    scope.row.workEndTime
              }}
            </template>
          </el-table-column>
          <el-table-column prop="outTime" label="中途外出时间" width="120" align="center">
            <template #default="scope">
              {{ scope.row.outTime + "分钟" }}
            </template>
          </el-table-column>
          <el-table-column prop="orderBy" label="排序" align="center" />
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
    </el-card>
    <!-- 不能直接在自定义组件上使用 v-if，否则会有警告：Runtime directive used on component with non-element root node. The directives will not function as intended. -->
    <Save
      v-if="saveVisible"
      :show="saveVisible"
      :params="subParams"
      @hide="saveVisible = false"
      @refreshData="findTree"
    />
  </div>
</template>

<script name="OrgManagement" lang="ts" setup>
import { findTreeApi, deleteByIdApi } from "@/api/org/orgManagement"
import { typeOption } from "@/api/org/orgManagement/option"
import { usePagination } from "@/hooks/usePagination"
import Save from "./save.vue"

const { proxy } = getCurrentInstance() as any

/** 基本属性 */
const loading = ref<boolean>(false)
const dataList = ref<any[]>([])
const tableRef = ref<any>(null)
const currentRow = ref(null)
// 查询条件
const searchRef = ref<any>(null)
const showSearch = ref<boolean>(true)
const searchData = reactive({
  userName: undefined,
  phone: undefined
})
// 组织树
const refreshTable = ref<boolean>(true)
const isExpandAll = ref<boolean>(false)
// 子组件
const saveVisible = ref<boolean>(false)
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
      dataList.value = res.data
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
  searchRef.value?.resetFields()
}

/** 新增 */
const handleAdd = () => {
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

/** 删除 */
const handleDelete = (row: any) => {
  proxy.$modal
    .confirm(`正在删除：${row.name}，是否继续？`, "提示", {
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
}

// 格式化数据
const formatter = (row: any, column: any, cellValue: any, index: number) => {
  if (column.property === "isAttendance") {
    switch (cellValue) {
      case 0:
        cellValue = "是"
        break
      case 1:
        cellValue = "否"
        break
    }
  } else if (column.property === "isRest") {
    switch (cellValue) {
      case 0:
        cellValue = "是"
        break
      case 1:
        cellValue = "否"
        break
    }
  } else if (column.property === "type") {
    let temp = typeOption.find((item) => item.value === cellValue)
    temp ? (cellValue = temp.label) : cellValue
  }
  return cellValue
}

/** 初始化 */
console.log("===初始化")
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
