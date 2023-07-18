<template>
  <div :class="{ hidden: hidden }">
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="currentSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
const props = withDefaults(
  defineProps<{
    total: number
    pageNum?: number
    pageSize?: number
    pageSizes?: Array<number>
    pagerCount?: number
    layout?: string
    background?: boolean
    hidden?: boolean
  }>(),
  {
    pageNum: 1,
    pageSize: 20,
    pageSizes: () => [10, 20, 30, 50],
    pagerCount: document.body.clientWidth < 992 ? 5 : 7,
    layout: "total, sizes, prev, pager, next, jumper",
    background: true,
    hidden: false
  }
)
const emit = defineEmits<{
  pagination: [
    data: {
      pageNum?: number
      pageSize?: number
    }
  ]
  // (e: "pagination", pageNum?: number, pageSize?: number): void
}>()

const currentPage = ref<number>(props.pageNum)
const currentSize = ref<number>(props.pageSize)

/** 改变当前页码 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit("pagination", { pageNum: val })
}

/** 改变页面大小 */
const handleSizeChange = (val: number) => {
  currentSize.value = val
  emit("pagination", { pageSize: val })
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
