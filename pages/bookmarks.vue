<template>
  <main class="min-h-screen">
    <AppHeader class="mb-8" title="Bookmarks" :description="description" />
    <ul class="space-y-2">
      <li v-for="bookmark in bookmarks" :key="bookmark.id">
        <a
          :href="bookmark.url"
          target="_blank"
          class="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-lg -m-2 text-sm min-w-0"
        >
          <UAvatar
            :src="getThumbnail(bookmark.url)"
            :alt="bookmark.label"
            :ui="{ rounded: 'rounded-md' }"
          />
          <p class="truncate text-gray-700 dark:text-gray-200">
            {{ bookmark.label }}
          </p>
          <span class="flex-1"></span>
          <span class="text-xs font-medium text-gray-400 dark:text-gray-600">
            {{ getHost(bookmark.url) }}
          </span>
        </a>
      </li>
    </ul>
  </main>
</template>

<script setup>
const description =
  "Quelques liens...";
useSeoMeta({
  title: "Bookmarks",
  description,
});

const bookmarks = [

  {
    id: 11,
    label: "ASCII Flow - Text based image drawing",
    url: "https://asciiflow.com/#/",
  },
  {
    id: 12,
    label: "REQRES Mock apis for testing",
    url: "https://reqres.in/",
  },
  {
    id: 13,
    label: "Haikie - SVG background generator",
    url: "https://app.haikei.app/",
  },
  {
    id: 14,
    label: "IP API",
    url: "https://ipapi.is/",
  },
  {
    id: 15,
    label: "Rakko Tools",
    url: "https://en.rakko.tools/",
  },
];

function getHost(url) {
  const parsedUrl = new URL(url);
  let host = parsedUrl.host;
  if (host.startsWith("www.")) {
    host = host.substring(4);
  }
  return host;
}

function getThumbnail(url) {
  const host = getHost(url);
  return `https://logo.clearbit.com/${host}`;
}
</script>
