<template>
  <div class="network-bg" aria-hidden="true">
    <div class="network-bg__cluster network-bg__cluster--top">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="20" fill="#FF6B35" />
        <circle cx="200" cy="80" r="16" fill="#FF6B35" />
        <circle cx="280" cy="120" r="24" fill="#FF6B35" />
        <circle cx="150" cy="200" r="18" fill="#FF6B35" />
        <circle cx="300" cy="240" r="20" fill="#FF6B35" />
        <circle cx="180" cy="320" r="16" fill="#FF6B35" />
        <circle cx="320" cy="340" r="22" fill="#FF6B35" />
        <line
          x1="100"
          y1="100"
          x2="200"
          y2="80"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="200"
          y1="80"
          x2="280"
          y2="120"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="100"
          y1="100"
          x2="150"
          y2="200"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="150"
          y1="200"
          x2="180"
          y2="320"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="280"
          y1="120"
          x2="300"
          y2="240"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="300"
          y1="240"
          x2="320"
          y2="340"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="180"
          y1="320"
          x2="320"
          y2="340"
          stroke="#FF6B35"
          stroke-width="2" />
      </svg>
    </div>

    <div class="network-bg__cluster network-bg__cluster--bottom">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="380" r="18" fill="#FF6B35" />
        <circle cx="160" cy="420" r="22" fill="#FF6B35" />
        <circle cx="120" cy="300" r="20" fill="#FF6B35" />
        <circle cx="240" cy="340" r="24" fill="#FF6B35" />
        <circle cx="200" cy="450" r="16" fill="#FF6B35" />
        <circle cx="320" cy="400" r="20" fill="#FF6B35" />
        <circle cx="380" cy="320" r="18" fill="#FF6B35" />
        <circle cx="280" cy="240" r="22" fill="#FF6B35" />
        <line
          x1="80"
          y1="380"
          x2="160"
          y2="420"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="80"
          y1="380"
          x2="120"
          y2="300"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="160"
          y1="420"
          x2="200"
          y2="450"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="120"
          y1="300"
          x2="240"
          y2="340"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="240"
          y1="340"
          x2="320"
          y2="400"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="320"
          y1="400"
          x2="200"
          y2="450"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="240"
          y1="340"
          x2="280"
          y2="240"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="280"
          y1="240"
          x2="380"
          y2="320"
          stroke="#FF6B35"
          stroke-width="2" />
        <line
          x1="380"
          y1="320"
          x2="320"
          y2="400"
          stroke="#FF6B35"
          stroke-width="2" />
      </svg>
    </div>

    <span class="network-bg__dot network-bg__dot--one" />
    <span class="network-bg__dot network-bg__dot--two" />
    <span class="network-bg__dot network-bg__dot--three" />
  </div>
</template>

<style scoped>
.network-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.network-bg__cluster {
  position: absolute;
  opacity: 0.1;
}

.network-bg__cluster svg {
  width: 100%;
  height: 100%;
}

.network-bg__cluster--top {
  top: -140px;
  right: -140px;
  width: 480px;
  height: 480px;
  animation: float 18s ease-in-out infinite;
}

.network-bg__cluster--bottom {
  bottom: -220px;
  left: -220px;
  width: 620px;
  height: 620px;
  animation: float 24s ease-in-out infinite reverse;
}

.network-bg__dot {
  position: absolute;
  display: block;
  border-radius: 999px;
  background: rgba(255, 107, 53, 0.3);
}

.network-bg__dot--one {
  width: 10px;
  height: 10px;
  top: 20%;
  left: 25%;
  animation: pulse 6s ease-in-out infinite;
}

.network-bg__dot--two {
  width: 12px;
  height: 12px;
  top: 32%;
  right: 28%;
  animation: pulse 7s ease-in-out infinite 1.2s;
}

.network-bg__dot--three {
  width: 8px;
  height: 8px;
  bottom: 22%;
  right: 18%;
  animation: pulse 5s ease-in-out infinite 0.4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(20px, -20px, 0) scale(1.05);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.4);
  }
}
</style>
