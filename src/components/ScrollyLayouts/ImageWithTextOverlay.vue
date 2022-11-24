<template>
  <v-row align="center" justify="center">
    <v-col>
      <article style="margin-bottom: 50px">
        <v-fade-transition>
          <v-img
            v-show="progress >= 0 && progress <= 100"
            :style="`position: fixed; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; filter: brightness(0.7) hue-rotate(${
              progress * 3
            }deg); transform: scale(${
              1 + progress / 100
            }); transform-origin: center`"
            :src="item[0].image"
          >
          </v-img>
        </v-fade-transition>
        <div class="white--text text-center pa-16" style="position: relative">
          <h1 class="text-h1 mb-8">Hello World.</h1>
          <h4 class="text-h4 mb-8">Scroll to get started</h4>
          <p v-html="parseMarkdown(text)"></p>
        </div>
      </article>
    </v-col>
  </v-row>
</template>

<script>
import marked from 'marked';

export default {
  name: "ImageWithTextOverlay",
  props: {
    item: Array,
    index: Number,
    progress: Number,
    text: String,
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace('<a', '<a target="_blank" ');
    },
  },
  data: () => ({
    textPlaceholders: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida maximus elit a venenatis. Mauris felis ipsum, placerat sit amet accumsan non, commodo ac arcu. Phasellus lorem urna, consectetur non ornare et, pharetra id risus.",
      "Proin sit amet commodo velit. Ut vitae quam elit. Donec nulla dui, ullamcorper ac dui nec, pretium feugiat lectus. Nam vestibulum odio arcu, eu efficitur tellus maximus ac.",
      "Ut vitae quam elit. Donec nulla dui, ullamcorper ac dui nec, pretium feugiat lectus. Nam vestibulum odio arcu, eu efficitur tellus maximus ac.",
      "Mauris felis ipsum, placerat sit amet accumsan non, commodo ac arcu. Phasellus lorem urna, consectetur non ornare et, pharetra id risus.",
    ],
  }),
};
</script>

<style scoped>
article {
  padding: 200px 50px 400px 50px;
}

article p {
  margin-bottom: 50px !important;
}
</style>