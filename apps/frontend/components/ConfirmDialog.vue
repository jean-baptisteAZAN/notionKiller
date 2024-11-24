<script setup lang="ts">
const confirmDialog = useConfirm();
const isOpen = computed({
  get: () => confirmDialog.isOpen.value,
  set: (value) => {
    if (!value) {
      confirmDialog.handleCancel();
    }
  },
});
</script>

<template>
  <UModal v-model="isOpen" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
          >
            {{ confirmDialog.options.title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="confirmDialog.handleCancel"
          />
        </div>
      </template>

      <div class="py-4">
        <p class="text-gray-600 dark:text-gray-300">
          {{ confirmDialog.options.message }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            :label="confirmDialog.options.cancelLabel"
            @click="confirmDialog.handleCancel"
          />
          <UButton
            :color="confirmDialog.options.confirmButtonColor"
            :label="confirmDialog.options.confirmLabel"
            @click="confirmDialog.handleConfirm"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
