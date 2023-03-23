<template>
  <v-row class="image-with-text-overlay fill-width" align="center" justify="center">
    <v-col>
      <article style="margin-bottom: 50px">
        <!--<v-img
          :style="`position: sticky; top: 0; height: var(--view-height); pointer-events: none; filter: brightness(0.7) hue-rotate(${progress * 3}deg);`"
          :src="item.image"
        />-->

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
          v-html="parseMarkdown(item.text)"
          class="text-overlay white--text text-left pa-16 mb-32"
          style="position: relative; width: 40%"
        />
      </article>
    </v-col>
  </v-row>
</template>

<script>
import { marked } from "marked";

import Map from './Map.vue';

export default {
  name: "ImageWithTextOverlay",
  props: {
    item: Object,
    index: Number,
    progress: Number,
  },
  components: {
    Map,
  },
  data: () => ({
    textPlaceholders: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida maximus elit a venenatis. Mauris felis ipsum, placerat sit amet accumsan non, commodo ac arcu. Phasellus lorem urna, consectetur non ornare et, pharetra id risus.",
      "Proin sit amet commodo velit. Ut vitae quam elit. Donec nulla dui, ullamcorper ac dui nec, pretium feugiat lectus. Nam vestibulum odio arcu, eu efficitur tellus maximus ac.",
      "Ut vitae quam elit. Donec nulla dui, ullamcorper ac dui nec, pretium feugiat lectus. Nam vestibulum odio arcu, eu efficitur tellus maximus ac.",
      "Mauris felis ipsum, placerat sit amet accumsan non, commodo ac arcu. Phasellus lorem urna, consectetur non ornare et, pharetra id risus.",
    ],
  }),
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace("<a", '<a target="_blank" ');
    },
  },
};
</script>

<style scoped>
article {
  --view-width: 100vw;
  --view-height: 100vh;
}

:deep(.text-overlay p) {
  margin-bottom: var(--view-height);
  background: #010;
  padding: 20px;
}
</style>
