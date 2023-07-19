<template>
  <div class="app-container">
    <!-- 加上 destroy-on-close 属性：打开弹框再关闭后，弹框中的 DOM 元素没有被销毁，可能会因为不该存在的 DOM 元素而报错 -->
    <el-dialog
      v-model="dialogVisible"
      v-loading="loading"
      destroy-on-close
      :title="title"
      :close-on-click-modal="false"
      draggable
      width="700"
      @close="hide"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                v-model="formData.parentId"
                :data="menuOption"
                :props="{ value: 'id', label: 'menuName', children: 'children' }"
                value-key="id"
                placeholder="选择上级菜单"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="formData.menuType">
                <el-radio label="C" border>菜单</el-radio>
                <el-radio label="M" border>目录</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                :width="540"
                v-model:visible="showChooseIcon"
                trigger="click"
                @show="showSelectIcon"
              >
                <template #reference>
                  <el-input
                    v-model="formData.icon"
                    placeholder="点击选择图标"
                    @blur="showSelectIcon"
                    v-click-outside="hideSelectIcon"
                    readonly
                  >
                    <template #prefix>
                      <svg-icon v-if="formData.icon" :name="formData.icon" style="height: 32px; width: 16px" />
                      <el-icon v-else style="height: 32px; width: 16px"><search /></el-icon>
                    </template>
                  </el-input>
                </template>
                <icon-select ref="iconSelectRef" :active-icon="formData.icon" @selected="handleSelected" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单标识" prop="menuCode">
              <el-input v-model="formData.menuCode" placeholder="请输入菜单标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="routePath">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="formData.routePath" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.menuType === 'C'">
            <el-form-item prop="pagePath">
              <template #label>
                <span>
                  <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="formData.pagePath" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderBy">
              <el-input-number v-model="formData.orderBy" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.menuType !== 'M'">
            <el-form-item>
              <el-input v-model="formData.perms" placeholder="请输入权限标识" maxlength="100" />
              <template #label>
                <span>
                  <el-tooltip
                    content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  权限标识
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isFrame">
              <template #label>
                <span>
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否外链
                </span>
              </template>
              <el-radio-group v-model="formData.isFrame">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.menuType === 'C'">
            <el-form-item>
              <el-radio-group v-model="formData.isCache">
                <el-radio :label="0">缓存</el-radio>
                <el-radio :label="1">不缓存</el-radio>
              </el-radio-group>
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                    placement="top"
                  >
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="formData.visible">
                <el-radio v-for="item in visibleOption" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="formData.status">
                <el-radio v-for="item in statusOption" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formData.menuType === 'C'">
            <el-form-item>
              <el-input v-model="formData.query" placeholder="请输入路由参数" maxlength="255" />
              <template #label>
                <span>
                  <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { saveApi, findByIdApi, findTreeApi } from "@/api/system/menu"
import { visibleOption, statusOption } from "@/api/system/menu/option"
import IconSelect from "@/components/IconSelect/index.vue"
import SvgIcon from "@/components/SvgIcon/index.vue"

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
const title = props.params.data && props.params.data.id ? "编辑" : "新增"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
// 图标
const showChooseIcon = ref(false)
const iconSelectRef = ref<any>({})
// 菜单树
const menuOption = ref<any[]>([])
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  parentId: "-1",
  menuName: "",
  menuCode: "",
  menuType: "C",
  icon: "",
  isFrame: 0,
  routePath: "",
  pagePath: "",
  perms: "",
  query: "",
  isCache: 0,
  visible: 0,
  status: 0
})
const formRules = reactive({
  menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  menuCode: [{ required: true, message: "菜单标识不能为空", trigger: "blur" }],
  orderBy: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
  routePath: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
})

// 设置图标
/** 展示下拉图标 */
const showSelectIcon = () => {
  iconSelectRef.value?.reset()
  showChooseIcon.value = true
}
/** 选择图标 */
const handleSelected = (name: string) => {
  formData.icon = name
  showChooseIcon.value = false
}
/** 图标外层点击隐藏下拉列表 */
const hideSelectIcon = (event: any) => {
  const elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget
  const className = elem.className
  if (className !== "el-input__inner") {
    showChooseIcon.value = false
  }
}

/** 查询菜单树 */
const findTree = () => {
  loading.value = true
  findTreeApi({})
    .then((res) => {
      const menu = { id: "-1", menuName: "主类目", children: [] }
      menu.children = res.data
      menuOption.value.push(menu)
      console.log(menuOption.value)
    })
    .catch(() => {
      const menu = { id: "-1", menuName: "主类目", children: [] }
      menuOption.value.push(menu)
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
      saveApi(formData).then(() => {
        proxy.$modal.msgSuccess("保存成功")
        emit("refreshData")
        emit("hide")
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
if (props.params.opt === "add") {
  if (record && record.id) {
    formData.parentId = record.id
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
