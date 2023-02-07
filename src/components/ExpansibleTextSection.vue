<template>
  <div class="expansible-text-section">
    <template v-if="hasExpansibleSection">
      <p v-if="sections[0].length" v-html="parseMarkdown(sections[0])" />
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
        <p
          class="expansible"
          :class="{ large: isExpansibleSectionLarge, hidden: !isExpanded }"
          v-html="parseMarkdown(sections[1])"
        />
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
      return marked.parse(input).replace("<a", '<a target="_blank" ');
    },
  },
};
</script>

<style scoped>
.expansible-text-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 80px;
  min-width: 520px;
}

.expansible-text-section svg {
  align-self: center;
}
.expansible {
  max-width: 320px;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid #aaa;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  text-align: center;
}

.expansible.large {
  max-width: 100% !important;
}

.expansible.hidden {
  opacity: 0;
}

.expand-button {
  width: 24px;
  height: 24px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.expand-button:hover {
  transform: scale(1.3);
}
</style>
