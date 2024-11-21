<script setup lang="ts">
  const data = await $fetch("http://localhost:4040/api/health");
  console.log(data);
</script>
<script lang="ts">
  onMounted(() => {
    console.log("Component mounted");
  });
</script>

<template>
  <div>
    <h1>Vue 3 + Vite + TypeScript + Fetch</h1>
    <p>{{ data }}</p>
  </div>
</template>