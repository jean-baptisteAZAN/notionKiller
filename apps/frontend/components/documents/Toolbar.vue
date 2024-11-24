<script setup lang="ts">
import type { ToolbarSection } from "@/types/editor";

const props = defineProps<{
  sections: ToolbarSection[];
}>();

const emit = defineEmits<{
  action: [tool: any];
}>();

function handleToolClick(tool: any) {
  emit("action", tool);
}
</script>

<template>
  <div
    class="border rounded-t p-2 flex flex-wrap gap-2 mb-[-1px] bg-white dark:bg-gray-800"
  >
    <div
      v-for="section in sections"
      :key="section.label"
      class="flex items-center gap-1"
    >
      <div v-for="tool in section.tools" :key="tool.label">
        <UTooltip :text="tool.tooltip">
          <UButton
            color="gray"
            variant="ghost"
            :icon="tool.icon"
            size="xs"
            @click="handleToolClick(tool)"
          />
        </UTooltip>
      </div>

      <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 last:hidden" />
    </div>
  </div>
</template>
