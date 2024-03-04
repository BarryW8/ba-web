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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <TitleBar title="基本信息" />
        <el-row>
          <el-col :span="12">
            <el-form-item prop="code" label="组织编码:">
              <el-input v-model="formData.code" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="组织名称:">
              <el-input v-model="formData.name" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="parentId" label="上级组织:">
              <el-tree-select
                ref="treeSelectRef"
                v-model="formData.parentId"
                :data="orgOption"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="请选择上级组织"
                check-strictly
                style="width: 100%"
                @node-click="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="type" label="组织类型:">
              <el-select v-model="formData.type" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="orderBy" label="排序:">
              <el-input-number v-model="formData.orderBy" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="note" label="说明:">
              <el-input v-model="formData.note" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <TitleBar title="考勤信息" color="danger">
          <template #footer>
            <div v-if="record && record.id">
              <el-button size="small" @click="handleExtends('考勤信息')">继承上级</el-button>
            </div>
          </template>
        </TitleBar>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="workBegTime" label="上班时间:">
              <el-input v-model="formData.workBegTime" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="workEndTime" label="下班时间:">
              <el-input v-model="formData.workEndTime" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isAttendance" label="是否考勤:">
              <el-radio-group v-model="formData.isAttendance">
                <el-radio :label="0" border>是</el-radio>
                <el-radio :label="1" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isRest" label="是否午休:">
              <el-radio-group v-model="formData.isRest">
                <el-radio :label="0" border>是</el-radio>
                <el-radio :label="1" border>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isRest === 0">
            <el-form-item prop="restBegTime" label="午休开始时间:">
              <el-input v-model="formData.restBegTime" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isRest === 0">
            <el-form-item prop="restEndTime" label="午休结束时间:">
              <el-input v-model="formData.restEndTime" maxlength="30" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="outTime" label="中途外出时间:">
              <el-input v-model="formData.outTime" maxlength="30" placeholder="请输入">
                <template #append>分钟</template>
              </el-input>
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
import { addApi, editApi, findByIdApi, findTreeApi } from "@/api/org/orgManagement"
import { typeOption } from "@/api/org/orgManagement/option"

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
const pageType = ref<string>(props.params.opt)
const title = pageType.value === "add" ? "新增" : "编辑"
const record = reactive(props.params.data)
const loading = ref<boolean>(false)
// 组织树
const treeSelectRef = ref<any>(null)
const orgOption = ref<any[]>([])
// 表单
const formRef = ref<any>(null)
const formData = reactive<any>({
  code: "",
  name: "",
  parentId: "-1",
  parentName: "",
  type: "",
  isAttendance: 0,
  workBegTime: "",
  workEndTime: "",
  isRest: 0,
  restBegTime: "",
  restEndTime: "",
  outTime: "",
  orderBy: 0,
  note: ""
})
const formRules = reactive({
  code: [{ required: true, trigger: "blur", message: "组织编码不能为空" }],
  name: [{ required: true, trigger: "blur", message: "组织名称不能为空" }],
  type: [{ required: true, trigger: "blur", message: "组织类型不能为空" }],
  isAttendance: [{ required: true, trigger: "blur", message: "是否考勤不能为空" }],
  workBegTime: [{ required: true, trigger: "blur", message: "上班时间不能为空" }],
  workEndTime: [{ required: true, trigger: "blur", message: "下班时间不能为空" }],
  isRest: [{ required: true, trigger: "blur", message: "是否午休不能为空" }],
  restBegTime: [{ required: true, trigger: "blur", message: "午休开始时间不能为空" }],
  restEndTime: [{ required: true, trigger: "blur", message: "午休结束时间不能为空" }]
})

// 树操作
/** 选中树节点 */
const handleNodeClick = () => {
  console.log("handleNodeClick---------", treeSelectRef.value.getCurrentNode())
  formData.parentId = treeSelectRef.value.getCurrentNode()?.id
}

/** 查询组织树 */
const findTree = () => {
  loading.value = true
  findTreeApi({})
    .then((res) => {
      const org = { id: "-1", name: "主类目", children: [] }
      org.children = res.data
      orgOption.value.push(org)
      console.log(orgOption.value)
    })
    .catch(() => {
      const org = { id: "-1", name: "主类目", children: [] }
      orgOption.value.push(org)
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
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      //前置参数封装校验
      save(formData)
    } else {
      return false
    }
  })
}
const save = (params: any) => {
  if (pageType.value === "add") {
    addApi(params).then(() => {
      proxy.$modal.msgSuccess("新增成功")
      emit("refreshData")
      emit("hide")
    })
  } else {
    editApi(params).then(() => {
      proxy.$modal.msgSuccess("编辑成功")
      emit("refreshData")
      emit("hide")
    })
  }
}

/** 继承上级 */
const handleExtends = (type: string) => {
  switch (type) {
    case "考勤信息":
      formData.workBegTime = record.workBegTime
      formData.workEndTime = record.workEndTime
      formData.isAttendance = record.isAttendance
      formData.isRest = record.isRest
      formData.restBegTime = record.restBegTime
      formData.restEndTime = record.restEndTime
      formData.outTime = record.outTime
      break
  }
}

/** 关闭弹窗 */
const hide = () => emit("hide")

/** 初始化 */
console.log("===初始化")
findTree()
if (pageType.value === "add") {
  if (record && record.id) {
    formData.parentId = record.id
  }
} else if (pageType.value === "edit") {
  findById()
}
</script>

<style lang="scss" scoped></style>
