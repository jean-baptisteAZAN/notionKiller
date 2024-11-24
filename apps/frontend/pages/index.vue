<script setup lang="ts">
import MarkdownPreview from "~/components/documents/MarkdownPreview.vue";
const typingTexts = [
  "Write your ideas.",
  "Organize your thoughts.",
  "Share your knowledge.",
];

const currentText = ref("");
const displayText = ref("");
const currentIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = ref(100);

function typeText() {
  const current = typingTexts[currentIndex.value];

  if (isDeleting.value) {
    displayText.value = current.substring(0, currentText.value.length - 1);
    typingSpeed.value = 150;
  } else {
    displayText.value = current.substring(0, currentText.value.length + 1);
    typingSpeed.value = 150;
  }

  currentText.value = displayText.value;

  if (!isDeleting.value && displayText.value === current) {
    isDeleting.value = true;
    typingSpeed.value = 200;
  } else if (isDeleting.value && displayText.value === "") {
    isDeleting.value = false;
    currentIndex.value = (currentIndex.value + 1) % typingTexts.length;
    typingSpeed.value = 200;
  }

  setTimeout(typeText, typingSpeed.value);
}

let isScrolled = ref(false);

onMounted(() => {
  typeText();
  window.addEventListener("scroll", () => {
    isScrolled.value = window.scrollY > 20;
  });
});

const features = [
  {
    icon: "i-heroicons-document-text",
    title: "Markdown Editor",
    description:
      "Write and format your content with a powerful Markdown editor with real-time preview.",
    color: "text-blue-500",
  },
  {
    icon: "i-heroicons-clipboard-document-check",
    title: "Task Management",
    description:
      "Create tasks, set deadlines, and track progress with our intuitive task management system.",
    color: "text-purple-500",
  },
  {
    icon: "i-heroicons-share",
    title: "Easy Sharing",
    description:
      "Share your documents with team members or make them public with a single click.",
    color: "text-green-500",
  },
];

// Stats
const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50K+", label: "Documents Created" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
        : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a
            href="/"
            class="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-8 h-8 text-primary-500"
            />
            <span>NotionKiller</span>
          </a>
        </div>

        <!-- Boutons de droite -->
        <div class="flex items-center space-x-4">
          <UButton
            to="/login"
            color="gray"
            variant="ghost"
            class="font-medium hover:text-primary-500 dark:hover:text-primary-400"
          >
            Login
          </UButton>

          <UButton
            to="/register"
            color="primary"
            class="relative group overflow-hidden px-6"
          >
            <span class="relative z-10">Register</span>
            <!-- Effet de brillance au hover -->
            <div
              class="absolute inset-0 transform translate-y-32 group-hover:-translate-y-32 bg-gradient-to-t from-white/20 to-transparent transition-transform duration-300"
            />
          </UButton>

          <!-- Optionnel: Toggle Theme -->
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-moon"
            class="hidden sm:flex"
            @click="
              $colorMode.preference =
                $colorMode.value === 'dark' ? 'light' : 'dark'
            "
          />
        </div>
      </div>
    </div>
  </nav>
  <div class="relative flex items-center overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- Contenu texte -->
        <div class="space-y-10 z-10">
          <h1
            class="text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            NotionKiller
            <span class="block mt-2 h-20">
              <!-- Hauteur fixe pour éviter les sauts -->
              <span class="text-primary-600 dark:text-primary-400 typing-text">
                {{ currentText }}<span class="cursor">|</span>
              </span>
            </span>
          </h1>

          <p
            class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
          >
            Write, organize and share your knowledge with NotionKiller. Start
            for free and see how it can help you.
          </p>

          <div class="flex flex-wrap gap-4">
            <UButton
              size="xl"
              color="primary"
              class="group relative overflow-hidden"
            >
              Start Free Today
              <span
                class="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
              ></span>
            </UButton>

            <UButton size="xl" color="gray" variant="ghost" class="group">
              <span class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-play-circle"
                  class="w-5 h-5 transition-transform group-hover:scale-110"
                />
                Voir la démo
              </span>
            </UButton>
          </div>
        </div>

        <!-- Preview de l'app -->
        <div class="relative z-10">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <div class="border-b border-gray-200 dark:border-gray-700 p-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div class="p-6">
              <MarkdownPreview :markdown="'# ' + currentText" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <section class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Everything you need to be productive
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          NotionKiller combines the best features of note-taking and project
          management tools.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="relative group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <!-- Feature Card Glow Effect -->
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300"
          />

          <div class="relative">
            <!-- Icon -->
            <UIcon
              :name="feature.icon"
              class="w-12 h-12 mb-6"
              :class="feature.color"
            />

            <!-- Content -->
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="relative py-20 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-25 dark:opacity-10">
      <svg
        class="absolute right-0 top-0 h-full"
        width="400"
        viewBox="0 0 400 400"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="2" class="fill-gray-900 dark:fill-white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label" class="group">
          <div
            class="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500"
          >
            {{ stat.number }}
          </div>
          <div class="text-gray-600 dark:text-gray-300 font-medium">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <!-- Background Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl transform -rotate-1"
        />

        <!-- Content -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl p-12 rotate-1 transform hover:rotate-0 transition-transform duration-300"
        >
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to get started?
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who are already organizing their thoughts
              with NotionKiller.
            </p>

            <div class="flex flex-wrap justify-center gap-4">
              <UButton
                size="xl"
                color="primary"
                class="group relative overflow-hidden"
              >
                Start Free Trial
                <span
                  class="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                />
              </UButton>

              <UButton
                size="xl"
                color="white"
                variant="ghost"
                to="#features"
                class="group"
              >
                Learn More
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer
    class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            NotionKiller
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Your all-in-one workspace for notes, tasks, and collaboration.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">
            Quick Links
          </h4>
          <ul class="space-y-2">
            <li
              v-for="link in ['Features', 'Pricing', 'Blog', 'About']"
              :key="link"
            >
              <a
                href="#"
                class="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                {{ link }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">Legal</h4>
          <ul class="space-y-2">
            <li v-for="link in ['Privacy', 'Terms', 'Security']" :key="link">
              <a
                href="#"
                class="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                {{ link }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">
            Connect
          </h4>
          <div class="flex space-x-4">
            <UButton
              v-for="social in ['twitter', 'github', 'linkedin']"
              :key="social"
              color="gray"
              variant="ghost"
              :icon="`i-simple-icons-${social}`"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300"
      >
        <p>
          &copy; {{ new Date().getFullYear() }} NotionKiller. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Animation des blobs */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Animation du curseur de typing */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.cursor {
  display: inline-block;
  width: 2px;
  animation: blink 1s infinite;
}

.typing-text {
  display: inline-block;
  min-width: 10px;
}
/* Ajout d'animations pour les features */
.feature-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* Animation pour les stats */
@keyframes countUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.stat-number {
  animation: countUp 1s ease-out forwards;
}
</style>
