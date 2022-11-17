<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <article>
        <p v-for="placeholder in textPlaceholders" v-html="placeholder"></p>
      </article>
    </v-col>
    <v-col cols="6">
      <v-fade-transition>
        <figure v-show="progress >= 0 && progress <= 100">
          <img
            :src="item[1].image"
            :style="`filter: saturate(${(progress || 0) / 100});`"
          />
          <span class="white--text pa-2" style="position: absolute; left: 0"
            >{{ Math.round(progress) || 0 }}%</span
          >
        </figure>
      </v-fade-transition>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    item: Array,
    index: Number,
    progress: Number,
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
  padding: 200px 50px;
}

article p {
  margin-bottom: 200px !important;
}

figure {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
}

img {
  width: 100%;
}
</style>