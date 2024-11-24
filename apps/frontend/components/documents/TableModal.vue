<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
  insert: [string, string, string];
}>();

const tableData = reactive({
  rows: 2,
  cols: 2,
});

function handleInsert() {
  let tableMarkdown = "\n";
  tableMarkdown += "|" + " Header |".repeat(tableData.cols) + "\n";
  tableMarkdown += "|" + " --- |".repeat(tableData.cols) + "\n";
  for (let i = 0; i < tableData.rows; i++) {
    tableMarkdown += "|" + " Cell |".repeat(tableData.cols) + "\n";
  }

  emit("insert", tableMarkdown, "", "");
  emit("update:modelValue", false);
  tableData.rows = 2;
  tableData.cols = 2;
}

const minDimension = 1;
const maxDimension = 10;

function incrementRows() {
  if (tableData.rows < maxDimension) {
    tableData.rows++;
  }
}

function decrementRows() {
  if (tableData.rows > minDimension) {
    tableData.rows--;
  }
}

function incrementCols() {
  if (tableData.cols < maxDimension) {
    tableData.cols++;
  }
}

function decrementCols() {
  if (tableData.cols > minDimension) {
    tableData.cols--;
  }
}
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Insert Table</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- Rows Input -->
        <div class="flex items-center justify-between">
          <UFormGroup label="Rows" class="flex-1">
            <div class="flex items-center gap-2">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-minus"
                :disabled="tableData.rows <= minDimension"
                @click="decrementRows"
              />
              <UInput
                v-model.number="tableData.rows"
                type="number"
                :min="minDimension"
                :max="maxDimension"
                class="w-20 text-center"
              />
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-plus"
                :disabled="tableData.rows >= maxDimension"
                @click="incrementRows"
              />
            </div>
          </UFormGroup>
        </div>

        <!-- Columns Input -->
        <div class="flex items-center justify-between">
          <UFormGroup label="Columns" class="flex-1">
            <div class="flex items-center gap-2">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-minus"
                :disabled="tableData.cols <= minDimension"
                @click="decrementCols"
              />
              <UInput
                v-model.number="tableData.cols"
                type="number"
                :min="minDimension"
                :max="maxDimension"
                class="w-20 text-center"
              />
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-plus"
                :disabled="tableData.cols >= maxDimension"
                @click="incrementCols"
              />
            </div>
          </UFormGroup>
        </div>

        <!-- Table Preview -->
        <div class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 dark:bg-gray-800 p-3 border-b">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </p>
          </div>
          <div class="p-3 overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead>
                <tr>
                  <th
                    v-for="col in tableData.cols"
                    :key="`header-${col}`"
                    class="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
                  >
                    Header {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="row in tableData.rows" :key="`row-${row}`">
                  <td
                    v-for="col in tableData.cols"
                    :key="`cell-${row}-${col}`"
                    class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    Cell {{ row }}-{{ col }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            label="Cancel"
            @click="emit('update:modelValue', false)"
          />
          <UButton color="primary" label="Insert" @click="handleInsert" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>
.table-preview {
  max-height: 200px;
  overflow-y: auto;
}
</style>
