<template>
  <div class="expansible-text-section">
    <template v-if="hasExpansibleSection">
      <p v-html="parseMarkdown(sections[0])"></p>

      <v-btn
        elevation="2"
        icon
        small
        class="grey darken-1"
        color="white"
        style="font-size: 20px"
        @click="isExpanded = !isExpanded"
      >
        <span v-if="isExpanded">
          <!-- Long Minus Sign -->
          &#x2212;
        </span>
        <span v-else>
          <!-- Plus Sign -->
          &#x002B;
        </span>
      </v-btn>

      <v-fade-transition>
        <p
          v-show="isExpanded"
          class="expansible"
          :class="{large: isExpansibleSectionLarge}"
          v-html="parseMarkdown(sections[1])"
        />
      </v-fade-transition>
    </template>

    <p v-else v-html="parseMarkdown(text)"></p>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  props: {
    text: {
      type: String,
      required: true,
    }
  },
  computed: {
    hasExpansibleSection() {
      return this.text.includes('<--EXPAND-->') || this.text.includes('<--EXPAND-SMALL-->');
    },
    isExpansibleSectionLarge() {
      return this.text.includes('<--EXPAND-->');
    },
    sections() {
      return this.isExpansibleSectionLarge
        ? this.text.split('<--EXPAND-->')
        : this.text.split('<--EXPAND-SMALL-->');
    }
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace('<a', '<a target="_blank" ');
    },
  },
  data: () => ({
    isExpanded: false,
  }),
};
</script>

<style scoped>
.expansible-text-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.expansible {
  max-width: 500px;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid #AAA;
}

.expansible.large {
  max-width: 100% !important;
}
</style>