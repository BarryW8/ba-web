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
          <el-button type="danger" icon="Delete" :disabled="isSelect" @click="handleDelete()">批量删除</el-button>
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
          <!-- <el-table-column type="index" label="日志编号" align="center" /> -->
          <el-table-column prop="business" label="系统模块" align="center" show-overflow-tooltip />
          <el-table-column prop="operType" label="操作类型" align="center">
            <template #default="scope">
              <el-tag effect="light">{{ transfer(scope.row.operType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="操作人员" align="center" show-overflow-tooltip />
          <el-table-column prop="operatorPhone" label="操作手机号" align="center" show-overflow-tooltip />
          <el-table-column prop="operIp" label="操作地址" align="center" show-overflow-tooltip />
          <el-table-column prop="operLocation" label="操作地点" align="center" show-overflow-tooltip />
          <el-table-column prop="status" label="操作状态" width="100" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="danger" effect="dark">异常</el-tag>
              <el-tag v-else type="success" effect="dark">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operTime" label="操作日期" width="160" align="center" />
          <el-table-column prop="costTime" label="消耗时间" width="160" align="center">
            <template #default="scope">{{ scope.row.costTime + "毫秒" }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="info" plain size="small" @click.stop="handleDetail(scope.row)"
                >详情</el-button
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
    <Detail
      v-if="detailVisible"
      :show="detailVisible"
      :params="subParams"
      @hide="detailVisible = false"
      @refreshData="findPage"
    />
  </div>
</template>

<script name="OperLog" lang="ts" setup>
import { findPageApi, deleteByIdApi, findOperTypeApi } from "@/api/system/operLog"
import { usePagination } from "@/hooks/usePagination"
import Detail from "./detail.vue"

const { proxy } = getCurrentInstance() as any
const { paginationData } = usePagination()

/** 基本属性 */
const loading = ref<boolean>(false)
const dataList = ref<any[]>([])
const operTypes = ref<any>({})
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
const detailVisible = ref<boolean>(false)
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
const handleSelect = (row: any) => {
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

/** 编辑 */
const handleDetail = (row: any) => {
  detailVisible.value = true
  subParams.data = row
  subParams.opt = "detail"
}

/** 删除 */
const handleDelete = (row?: any) => {
  if (!row && proxy.$common.checkSelect(isSelect.value)) return
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

/** 初始化 */
console.log("###初始化")
findPage()
findOperType()
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
