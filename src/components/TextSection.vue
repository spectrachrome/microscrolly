<template>
  <div class="text-section d-flex flex-column fill-width" :class="{
    'with-background': $vuetify.breakpoint.mdAndDown,
  }">
    <template v-if="hasExpansibleSection">
      <div
        v-if="sections[0].length"
        v-html="parseMarkdown(sections[0])"
      />
      <!-- /* eslint-disable-line vue/no-v-html */ -->

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="expand-button"
        @click="isExpanded = !isExpanded"
      >
        <title>plus-circle</title>
        <path
          d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          fill="var(--v-primary-base)"
        />
      </svg>

      <v-fade-transition>
        <div
          class="expansible-container"
          :class="{
            hidden: !isExpanded,
            'full-width': isExpansibleSectionLarge,
          }"
        >
          <div
            class="expansible"
            :class="{ large: isExpansibleSectionLarge }"
            v-html="parseMarkdown(sections[1])"
          />
        </div>
      </v-fade-transition>
    </template>

    <div v-else v-html="parseMarkdown(text)" />
  </div>
</template>

<script>
import { marked } from "marked";

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isExpanded: false,
  }),
  computed: {
    hasExpansibleSection() {
      return (
        this.text.includes("<--EXPAND-->") ||
        this.text.includes("<--EXPAND-SMALL-->")
      );
    },
    isExpansibleSectionLarge() {
      return this.text.includes("<--EXPAND-->");
    },
    sections() {
      return this.isExpansibleSectionLarge
        ? this.text.split("<--EXPAND-->")
        : this.text.split("<--EXPAND-SMALL-->");
    },
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace("<a href", '<a target="_blank href" ');
    },
  },
};
</script>

<style scoped>
:deep(.expansible-container p) {
  font-size: 1rem;
  margin-bottom: 0;
}

:deep(.expansible p)+:deep(.expansible p) {
  margin-top: 16px;
}

.expansible-container {
  max-height: 200vh;
  transition: all 0.3s ease-in-out;
}

.expansible-container.hidden {
  max-height: 0 !important;
  opacity: 0;
}

.expansible {
  max-width: 320px;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid #aaa;
  transition: all 0.3s ease-in-out;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.expansible.large {
  max-width: 100% !important;
}

.expand-button {
  align-self: center;
  width: 24px;
  height: 24px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.expand-button:hover {
  transform: scale(1.3);
}

:deep(p) {
  margin-bottom: 500px;
  padding: 16px;
}

.text-section.with-background :deep(p) {
  max-width: 40%;
  background: #FFF;
  border-radius: 9px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
</style>
