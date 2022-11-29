<template>
  <v-col>
    <article class="full-text-block">
      <p v-html="parseMarkdown(text)"></p>
    </article>
  </v-col>
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
  /* padding: 100px 50px 200px 50px; */
  margin: -12px;
}

p {
  max-width: 100%;
}

:deep(img) {
  width: 100%;
}

@media screen and (min-width: 800px) {
  article.full-text-block > p > p {
    max-width: 70vw;
    margin-left: calc((100% - 70%) / 2);
    margin-right: calc((100% - 70%) / 2);
  }
}
</style>