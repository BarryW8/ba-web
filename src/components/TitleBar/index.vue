<template>
  <div class="title" :class="color">
    <div>
      <slot name="header" />
      {{ title }}
      <slot name="default" />
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
const props = withDefaults(
  defineProps<{
    title: string
    color?: string
    buttonTitle?: string
  }>(),
  {
    color: "primary"
  }
)
// const emit = defineEmits<{
//   pagination: [
//     data: {
//       pageNum?: number
//       pageSize?: number
//     }
//   ]
//   // (e: "pagination", pageNum?: number, pageSize?: number): void
// }>()

// const currentPage = ref<number>(props.pageNum)
// const currentSize = ref<number>(props.pageSize)

// /** 改变当前页码 */
// const handleCurrentChange = (val: number) => {
//   currentPage.value = val
//   emit("pagination", { pageNum: val })
// }

// /** 改变页面大小 */
// const handleSizeChange = (val: number) => {
//   currentSize.value = val
//   emit("pagination", { pageSize: val })
// }
</script>

<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  margin-left: 5px;
  padding: 0 20px;
  position: relative;
  color: #000;
  z-index: 0;
  margin-bottom: 20px;
  border-top-left-radius: 5px;

  &:before {
    content: "";
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    width: 4px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.primary {
  background: var(--el-color-primary-light-9);
  &:before {
    background: var(--el-color-primary);
  }
}

.success {
  background: var(--el-color-success-light-9);
  &:before {
    background: var(--el-color-success);
  }
}

.warning {
  background: var(--el-color-warning-light-9);
  &:before {
    background: var(--el-color-warning);
  }
}

.danger {
  background: var(--el-color-danger-light-9);
  &:before {
    background: var(--el-color-danger);
  }
}

.info {
  background: var(--el-color-info-light-9);
  &:before {
    background: var(--el-color-info);
  }
}
</style>
