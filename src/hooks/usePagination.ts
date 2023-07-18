import { reactive } from "vue"

interface DefaultPaginationData {
  total: number
  pageNum: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface PaginationData {
  total?: number
  pageNum?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 默认的分页参数 */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  pageNum: 1,
  pageSize: 20,
  pageSizes: [10, 20, 30, 50],
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** 合并分页参数 */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })

  return { paginationData }
}
