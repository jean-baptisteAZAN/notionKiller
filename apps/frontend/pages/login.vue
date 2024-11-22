<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useMotion } from '@vueuse/motion'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

const formRef = ref()
const isLoading = ref(false)

const { isAnimating } = useMotion(formRef, {
  initial: { opacity: 0, y: 100 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 30
    }
  }
})

const API_URL = import.meta.env.VITE_API_URL

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    const res = await $fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: event.data
    })

    const cookie = useCookie('auth-token', {
      maxAge: 60 * 60 * 24 * 7,
      secure: true,
      sameSite: 'strict'
    })
    cookie.value = res.token

    useToast().add({
      title: 'Welcome back!',
      description: 'Successfully logged in',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })

    await navigateTo('/dashboard')
  } catch (error) {
    useToast().add({
      title: 'Login failed',
      description: 'Invalid email or password',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <div
        ref="formRef"
        class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 relative overflow-hidden"
    >
      <!-- Background decoration -->
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full opacity-50 blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-200 rounded-full opacity-50 blur-2xl"></div>

      <div class="text-center relative z-10">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p class="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <UForm
          :schema="schema"
          :state="state"
          class="space-y-6 relative z-10"
          @submit="onSubmit"
      >
        <UFormGroup
            label="Email"
            name="email"
            class="transition-all duration-200 hover:translate-x-1"
        >
          <UInput
              icon="i-heroicons-envelope"
              v-model="state.email"
              placeholder="you@example.com"
              class="rounded-lg"
          />
        </UFormGroup>

        <UFormGroup
            label="Password"
            name="password"
            class="transition-all duration-200 hover:translate-x-1"
        >
          <UInput
              icon="i-heroicons-lock-closed"
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              class="rounded-lg"
          />
        </UFormGroup>

        <div class="flex items-center justify-between">
          <UCheckbox label="Remember me" name="remember" />
          <NuxtLink
              to="/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <UButton
            type="submit"
            :loading="isLoading"
            block
            class="mt-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-400 hover:from-primary-500 hover:to-primary-300 transition-all duration-300"
        >
          Sign in
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<style>
.form-enter-active,
.form-leave-active {
  transition: all 0.5s ease;
}

.form-enter-from,
.form-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>