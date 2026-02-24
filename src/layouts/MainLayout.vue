<template>
  <q-layout class="layout-shell app-gradient-bg">
    <NetworkBackground />

    <div class="layout-shell__inner">
      <header class="layout-header">
        <RouterLink to="/preview" class="brand">
          <span class="brand__icon">
            <Network class="icon" />
          </span>
          <span>
            <span class="brand__title">OCA Browser</span>
            <span class="brand__subtitle">Overlays Capture Architecture</span>
          </span>
        </RouterLink>

        <nav class="main-nav">
          <RouterLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="main-nav__link"
            :class="{ 'is-active': item.isActive(route.path) }">
            {{ item.label }}
          </RouterLink>
        </nav>
      </header>

      <q-page-container class="layout-content">
        <router-view />
      </q-page-container>

      <footer class="layout-footer">
        <div class="footer-brand">
          <img src="/white-logo.png" alt="Human Colossus Foundation" />
        </div>
        <div>© {{ currentYear }} Human Colossus</div>
      </footer>
    </div>
  </q-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Network } from 'lucide-vue-next'
import NetworkBackground from 'components/visuals/NetworkBackground.vue'

const route = useRoute()

const navigation = [
  {
    label: 'Preview & Validate',
    path: '/preview',
    isActive: (current: string) =>
      current.startsWith('/preview') ||
      current === '/' ||
      current.startsWith('/validate')
  },
  {
    label: 'About',
    path: '/about',
    isActive: (current: string) => current.startsWith('/about')
  }
]

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  color: #fff;
  position: relative;
}

.layout-shell__inner {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 2rem clamp(1.25rem, 4vw, 4rem);
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(10, 17, 32, 0.85);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-soft);
  flex-wrap: wrap;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand__icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 40px rgba(255, 107, 53, 0.45);
}

.brand__icon::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: inherit;
  background: var(--color-primary-soft);
  filter: blur(18px);
  z-index: -1;
}

.brand__title {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
}

.brand__subtitle {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
}

.icon {
  width: 28px;
  height: 28px;
}

.main-nav {
  display: inline-flex;
  gap: 0.75rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.main-nav__link {
  padding: 0.65rem 1.75rem;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.7);
  transition: background var(--transition-base), color var(--transition-base),
    box-shadow var(--transition-base);
}

.main-nav__link.is-active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.45);
}

.layout-content {
  flex: 1;
  margin-top: 2.5rem;
}

.layout-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(6, 10, 24, 0.85);
  backdrop-filter: blur(12px);
  font-size: 0.9rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-brand img {
  height: 26px;
  width: auto;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.4));
}

.footer-brand span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.highlight {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .layout-header,
  .layout-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav {
    width: 100%;
    justify-content: space-between;
  }

  .main-nav__link {
    flex: 1;
    text-align: center;
  }
}
</style>
