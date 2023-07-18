<script lang="ts" setup>
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    prefix?: string
    name: string
    color?: string
  }>(),
  {
    prefix: "icon",
    color: ""
  }
)

const iconName = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
