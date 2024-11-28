<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDocumentShare } from '~/composables/useDocumentShare';

const props = defineProps<{
  documentId: number;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  close: [];
  'update:modelValue': [boolean];
}>();


const { sharedUsers, isLoading, shareDocument, removeShare, fetchSharedUsers } = useDocumentShare();
const userEmail = ref('');
const permission = ref('write')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    if (!value) emit('close');
  }
});


onMounted(() => {
  fetchSharedUsers(props.documentId);
});

async function handleShare() {

  if (!userEmail.value) return;

  try {
    await shareDocument(props.documentId, userEmail.value, permission.value);
    userEmail.value = '';
    useToast().add({
      title: 'Success',
      description: 'Document shared successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    });
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to share document',
      icon: 'i-heroicons-x-circle',
      color: 'red',
    });
  }
}

async function handleRemoveShare(userId: number) {
  try {
    await removeShare(props.documentId, userId);
    useToast().add({
      title: 'Success',
      description: 'Share removed successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    });
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to remove share',
      icon: 'i-heroicons-x-circle',
      color: 'red',
    });
  }
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Share Document</h3>
          <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="emit('close')"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex gap-2">
          <UInput
              v-model="userEmail"
              placeholder="Enter user email"
              type="email"
          />
          <USelect
              v-model="permission"
              :options="[
                { label: 'Can edit', value: 'write' },
                { label: 'Can view', value: 'read' }
              ]"
          />
          <UButton
              :loading="isLoading"
              :disabled="!userEmail"
              @click="handleShare"
          >
            Share
          </UButton>
        </div>

        <div v-if="sharedUsers.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-500 mb-2">Shared with</h4>
          <ul class="space-y-2">
            <li
                v-for="user in sharedUsers"
                :key="user.id"
                class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <p class="font-medium">{{ user.name }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
              <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  :loading="isLoading"
                  @click="handleRemoveShare(user.id)"
              />
            </li>
          </ul>
        </div>

        <div
            v-else-if="!isLoading"
            class="text-center py-4 text-gray-500"
        >
          No users shared with this document yet
        </div>
      </div>
    </UCard>
  </UModal>
</template>