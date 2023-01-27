<template>
  <div class="expansible-text-section">
    <template v-if="hasExpansibleSection">
      <p v-html="parseMarkdown(sections[0])" />
      <!-- /* eslint-disable-line vue/no-v-html */ -->

      <img
        src="/img/circle-plus-solid.svg"
        data-section="4"
        class="expand-button"
        @click="isExpanded = !isExpanded"
      />

      <v-fade-transition>
        <p
          v-show="isExpanded"
          class="expansible"
          :class="{ large: isExpansibleSectionLarge }"
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
      required: true
    }
  },
  data: () => ({
    isExpanded: false
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
    }
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace("<a", '<a target="_blank" ');
    }
  }
};
</script>

<style scoped>
.expansible-text-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 80px;
  min-width: 520px;
}
.expansible {
  max-width: 500px;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid #aaa;
}

.expansible.large {
  max-width: 100% !important;
}

.expand-button {
  width: 20px;
  height: 20px;
  margin-top: 16px;
}
</style>
