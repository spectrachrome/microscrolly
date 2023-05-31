<template>
  <v-row class="image-with-text-overlay fill-width" align="center" justify="center">
    <v-col>
      <article>
        <div
          :style="`position: sticky; top: 0; height: var(--view-height); pointer-events: none;`"
        >
          <div
            class="fill-height fill-height"
            style="position: relative"
          >
            <Map
              style=""
              :mapInfo="item.mapInfo"
              :progress="progress"
            />
          </div>
        </div>

        <div
          v-if="item.text"
          ref="paragraphContainer"
          v-html="parseMarkdown(item.text)"
          class="text-overlay white--text text-left pa-16 mb-32"
          style="position: relative; width: 100%; transform: translateY(-100vh);"
        />
      </article>
    </v-col>
  </v-row>
</template>

<script>
import { marked } from "marked";

import Map from './Map.vue';

export default {
  name: "MediaWithTextOverlay",
  props: {
    item: Object,
    index: Number,
    progress: Number,
  },
  components: {
    Map,
  },
  data: () => ({
    paragraphSides: [],
  }),
  mounted () {
    const timeline = this.item.mapInfo.timeline;

    // Extract the sides so we can render paragraphs appropriately
    if (timeline) {
      this.paragraphSides = timeline
        .map(e => e.textSide ? e.textSide : 'left');

      this.$refs.paragraphContainer.querySelectorAll('p')
        .forEach((p, i) => p.classList.add(this.paragraphSides[i]));
    }
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace("<a", '<a target="_blank" ');
    },
  },
};
</script>

<style scoped>
.image-with-text-overlay {
  scroll-snap-type: y mandatory;
}

.image-with-text-overlay .text-overlay p {
  scroll-snap-align: start;
}

article {
  --view-width: 100vw;
  --view-height: 100vh;
}

:deep(.text-overlay p),
:deep(.text-overlay h1),
:deep(.text-overlay h2),
:deep(.text-overlay h3),
:deep(.text-overlay h4),
:deep(.text-overlay h5),
:deep(.text-overlay h6),
:deep(.text-overlay ul),
:deep(.text-overlay ol) {
  margin-bottom: var(--view-height);
  background: #000a;
  padding: 20px;
}

:deep(.text-overlay ul h1),
:deep(.text-overlay ul h2),
:deep(.text-overlay ul h3),
:deep(.text-overlay ul h4),
:deep(.text-overlay ul h5) {
  margin-bottom: 30px;
  background: transparent;
}

/* smAndDown */
@media screen and (max-width: 959px) {
  :deep(.text-overlay > *) {
    width: 100%;
  }
}

@media screen and (min-width: 960px) {
  :deep(.text-overlay > *) {
    width: 40%;
  }
}

:deep(.text-overlay p.right) {
  margin-left: calc(100% - 350px);
}
</style>
