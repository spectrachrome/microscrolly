<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <article>
        <p v-html="parseMarkdown(item[0].text)"></p>
      </article>
    </v-col>
    <v-col cols="6">
      <v-fade-transition>
        <figure v-show="progress >= 0 && progress <= 100">
          <video
            v-if="item[1].scrub"
            id="scrubVideo"
            :src="item[1].scrub"
            ref="scrubVideo"
            width="100%"
            muted
          />
          <img
            v-else
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
import marked from 'marked';

export default {
  props: {
    item: Array,
    index: Number,
    progress: Number,
  },
  methods: {
    parseMarkdown(input) {
      return marked.parse(input).replace('<a', '<a target="_blank" ');
    },
  },
  mounted () {
    if (this.item[1].scrub !== undefined) {
      document.getElementById('scroll-target').addEventListener('scroll' , e => {
        let video = this.$refs.scrubVideo;
        console.log(`scroll!  duration: ${video.duration} . ----- total: ${video.duration * (this.progress / 100)}`);
        video.currentTime = video.duration * (this.progress / 100);
      });
    }
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