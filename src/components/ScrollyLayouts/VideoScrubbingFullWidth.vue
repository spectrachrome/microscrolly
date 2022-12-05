<template>
  <div>
    <v-fade-transition>
      <div v-show="progress >= 0 && progress <= 100">
        <video
          v-if="baseUrl.includes('.mp4')"
          id="scrubVideo"
          :src="baseUrl"
          width="100%"
          muted
        />

        <canvas
          v-else
          ref="hero"
          style="
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            pointer-events: none;
            z-index: -1;
          "
        />
        <!--<v-img
          v-for="index in frameCount"
          v-show="Math.round((progress * frameCount) / 100) === index - 1"
          :src="currentFrame(Math.round((progress * frameCount) / 100))"
          :key="index"
          style="
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            pointer-events: none;
            z-index: -1;
          "
        >
          {{ index }}
        </v-img>-->
      </div>
    </v-fade-transition>
    <v-container v-if="scrubConfig">
      <v-col cols="6">
        <article
          class="black--text"
          style="height: 1000px; padding: 400px 50px 300px 50px"
          v-html="parseMarkdown(scrubConfig.content)"
        />
      </v-col>
    </v-container>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  props: {
    progress: Number,
    baseUrl: String,
  },
  data: () => ({
    frameCount: 134,
    imageBase:
      "https://codesandbox-scrollytelling-demo.s3.eu-central-1.amazonaws.com",
    img: null,
    context: null,
    scrubConfig: null,
  }),
  mounted() {
    fetch(`${this.baseUrl}/scrub.json`)
      .then((response) => {
        response.json()
          .then(json => {
            this.scrubConfig = json;
          })
      })
    const canvas = this.$refs.hero;
    this.context = canvas.getContext("2d");

    this.img = new Image();
    this.img.src = this.currentFrame(1);
    canvas.width = 1920;
    canvas.height = 1080;
    this.img.onload = () => {
      this.context.drawImage(this.img, 0, 0, window.innerWidth, window.innerHeight);
    };

    this.preloadImages();
  },
  methods: {
    currentFrame(index) {
      return `${this.baseUrl}/${index.toString().padStart(4, "0")}.jpg`;
    },
    preloadImages() {
      for (let i = 1; i < this.frameCount; i++) {
        const img = new Image();
        img.src = this.currentFrame(i);
      }
    },
    parseMarkdown(input) {
      return marked.parse(input).replace('<a', '<a target="_blank" ');
    },
  },
  watch: {
    progress(newProgress) {
      if (newProgress >= 0 && newProgress <= 100) {
        const newIndex = Math.floor((newProgress * this.frameCount) / 100) + 1;
        this.img.src = this.currentFrame(newIndex);
        this.context.drawImage(this.img, 0, 0, window.innerWidth, window.innerHeight);
      }
    },
  },
};
</script>