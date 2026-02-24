<template>
  <q-page class="about-page">
    <section class="glass-panel about-hero">
      <div>
        <p class="pill-badge">About OCA Browser</p>
        <h1>Human-friendly tools for the Overlays Capture Architecture</h1>
        <p>
          OCA Browser helps architects, designers, and integrators iterate on
          overlay bundles with confidence. We combine semantic previews with
          validation helpers so every release keeps its promise of verifiable,
          self-describing data.
        </p>
        <div class="about-grid">
          <article>
            <h3>Design</h3>
            <p>
              Build multilingual, multi-context overlays that speak the language
              of your domain. The preview flow renders every layer so
              stakeholders can review labels, captures, and presentation hints
              before deployment.
            </p>
          </article>
          <article>
            <h3>Validation</h3>
            <p>
              Every bundle prepared in this tool is verified using the oca.js
              WASM module. SAIDs are recalculated to ensure the semantic
              structure remains intact and tamper resistant.
            </p>
          </article>
          <article>
            <h3>Ecosystem</h3>
            <p>
              Learn more about the Overlays Capture Architecture at
              <a
                href="https://oca.colossi.network"
                target="_blank"
                rel="noopener"
                >oca.colossi.network</a
              >
              or explore the
              <a
                href="https://github.com/THCLab/oca-rs"
                target="_blank"
                rel="noopener"
                >oca-rs</a
              >
              reference implementation hosted by the Human Colossus Foundation.
            </p>
          </article>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts" setup></script>

<style scoped>
.about-page {
  padding: clamp(1.5rem, 3vw, 3rem);
  color: #fff;
}

.about-hero {
  padding: clamp(1.5rem, 3vw, 3rem);
}

.about-hero h1 {
  margin: 0.75rem 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

.about-hero p {
  max-width: 720px;
}

.about-grid {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.about-grid article {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}

.about-grid h3 {
  margin-top: 0;
}

.about-grid a {
  color: var(--color-primary);
}
</style>
