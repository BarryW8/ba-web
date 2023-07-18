<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"

const userStore = useUserStore()
const userInfo = userStore.userInfo
</script>

<template>
  <component :is="userInfo ? Admin : Editor" />
</template>
