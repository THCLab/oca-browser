<template>
  <section class="stack-shell">
    <svg
      class="stack-shell__links"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true">
      <defs>
        <linearGradient id="linkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF6B35" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#FF6B35" stop-opacity="0.2" />
        </linearGradient>
      </defs>
      <line
        v-for="line in linkPositions"
        :key="line.id"
        :x1="line.x1"
        :x2="line.x2"
        :y1="line.y1"
        :y2="line.y2"
        stroke="url(#linkGradient)"
        stroke-width="0.6"
        stroke-dasharray="4,4" />
    </svg>

    <div class="stack-shell__cards">
      <div
        v-for="(card, index) in cards"
        :key="card.typeKey"
        class="stack-card"
        :class="{ 'stack-card--active': selectedIndex === index }"
        :style="getCardStyle(index, card.paletteColor)"
        role="button"
        tabindex="0"
        @click="emit('select', index)"
        @keydown.enter.prevent="emit('select', index)"
        @keydown.space.prevent="emit('select', index)">
        <div v-if="index === 0" class="stack-card__overlay-count">BASE</div>
        <p v-if="card.said" class="stack-card__said">
          {{ truncateSaid(card.said) }}
        </p>
        <div class="stack-card__head">
          <div v-if="card.variantCount > 1" class="stack-card__badge">
            {{ card.activeVariantIndex + 1 }}/{{ card.variantCount }}
          </div>
        </div>
        <div>
          <p class="stack-card__title">{{ card.title }}</p>
          <p class="stack-card__meta">{{ card.subtitle }}</p>
        </div>

        <div
          v-if="card.variantCount > 1 && selectedIndex === index"
          class="stack-card__arrows">
          <button
            class="stack-card__arrow"
            aria-label="Previous variation"
            @click.stop="
              emit('cycle', { typeKey: card.typeKey, direction: 'prev' })
            ">
            ‹
          </button>
          <button
            class="stack-card__arrow"
            aria-label="Next variation"
            @click.stop="
              emit('cycle', { typeKey: card.typeKey, direction: 'next' })
            ">
            ›
          </button>
        </div>
      </div>

      <div
        v-if="showCaptureBase"
        class="capture-card"
        :class="{ 'capture-card--active': captureBaseSelected }"
        :style="{ '--capture-offset': captureCardOffset }"
        role="button"
        tabindex="0"
        @click="emit('select-capture')"
        @keydown.enter.prevent="emit('select-capture')"
        @keydown.space.prevent="emit('select-capture')">
        <div class="capture-card__badge">CB</div>
        <div>
          <p class="capture-card__title">Capture Base</p>
          <p class="capture-card__meta">Core attributes and their types</p>
        </div>
      </div>
    </div>

    <p class="stack-shell__legend">
      Select a layer to inspect its SAID, metadata, and attributes.
    </p>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface StackCardViewModel {
  typeKey: string
  title: string
  subtitle?: string
  said?: string
  paletteColor: string
  variantCount: number
  activeVariantIndex: number
}

interface CyclePayload {
  typeKey: string
  direction: 'next' | 'prev'
}

const props = defineProps<{
  cards: StackCardViewModel[]
  selectedIndex: number | null
  showCaptureBase: boolean
  captureBaseSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
  (e: 'cycle', payload: CyclePayload): void
  (e: 'select-capture'): void
}>()

const linkPositions = computed(() =>
  props.cards.slice(0, -1).map((_, idx) => ({
    id: `link-${idx}`,
    x1: 50,
    x2: 50,
    y1: 90 - idx * 10,
    y2: 90 - (idx + 1) * 10
  }))
)

const truncateSaid = (said?: string) => {
  if (!said) {
    return ''
  }
  return `${said.slice(0, 16)}…`
}

const CARD_STACK_OFFSET = 55

const getCardStyle = (index: number, paletteColor: string) => {
  const depth = props.cards.length - index
  const translate = index * CARD_STACK_OFFSET
  const scale = props.selectedIndex === index ? 1.02 : 1
  return {
    '--stack-color': paletteColor,
    transform: `translateY(calc(${translate}px * -1)) scale(${scale}) rotateX(45deg) rotateZ(-10deg)`,
    zIndex: depth + (props.selectedIndex === index ? 20 : 0)
  }
}

const captureCardOffset = computed(() => {
  const count = props.cards.length
  if (count <= 0) {
    return '0px'
  }
  const totalOffset = count * CARD_STACK_OFFSET
  return `${Math.max(0, totalOffset - 10)}px`
})
</script>

<style scoped>
.stack-shell {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2rem 1.5rem 2.5rem;
  overflow: visible;
}

.stack-shell__links {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.stack-shell__cards {
  position: relative;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stack-card {
  width: min(360px, 90%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent),
    var(--stack-color);
  color: #fff;
  border-radius: 18px;
  padding: 1.2rem 1.35rem;
  box-shadow: 0 25px 40px rgba(3, 7, 18, 0.45);
  cursor: pointer;
  transition: transform 320ms ease, box-shadow 320ms ease;
  position: relative;
}

.stack-card--active {
  transform: rotateX(12deg) rotateZ(2deg) translateY(-8px) scale(1.05);
  box-shadow: 0 35px 60px rgba(255, 107, 53, 0.45);
}

.stack-card__overlay-count {
  position: absolute;
  top: 0.9rem;
  left: 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

.stack-card__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.stack-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.stack-card__meta {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
}

.stack-card__badge {
  padding: 0.35rem 0.8rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 0.8rem;
}

.stack-card__said {
  margin: 1rem 0 0;
  font-size: 0.85rem;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.03em;
}

.stack-card__arrows {
  position: absolute;
  top: 50%;
  left: -48px;
  right: -48px;
  display: flex;
  justify-content: space-between;
  padding: 0 0.35rem;
  pointer-events: none;
}

.stack-card__arrow {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  font-size: 1.25rem;
  pointer-events: auto;
  box-shadow: 0 10px 20px rgba(3, 7, 18, 0.4);
}

.capture-card {
  width: min(420px, 95%);
  border-radius: 24px;
  padding: 1.5rem;
  background: #fff;
  color: #0f172a;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
  cursor: pointer;
  transform: translateY(calc(var(--capture-offset, 0px) * -1)) rotateX(46deg)
    rotateZ(-10deg);
  transition: transform 240ms ease, box-shadow 240ms ease;
}

.capture-card--active {
  transform: translateY(calc(var(--capture-offset, 0px) * -1 - 8px))
    rotateX(46deg) rotateZ(-10deg);
  box-shadow: 0 45px 90px rgba(15, 23, 42, 0.35);
  z-index: 999;
}

.capture-card__badge {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.08em;
}

.capture-card__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.capture-card__meta {
  margin: 0.3rem 0 0;
  color: #475569;
}

.stack-shell__legend {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1.25rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .stack-card {
    transform: rotateX(12deg) rotateZ(2deg);
  }

  .capture-card {
    transform: translateY(calc(var(--capture-offset, 0px) * -1)) rotateX(12deg)
      rotateZ(2deg);
  }

  .capture-card--active {
    transform: translateY(calc(var(--capture-offset, 0px) * -1 - 6px))
      rotateX(12deg) rotateZ(2deg);
  }
}
</style>
