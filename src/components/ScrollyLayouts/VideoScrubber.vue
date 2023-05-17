<template>
  <div>
    <!-- Progress display for debugging -->
    <!-- <div style="top: 0; position: absolute; left: 0; z-index: 999">
      {{ progress }}
    </div> -->
    <v-fade-transition>
      <div v-show="progress >= 0 && progress <= 100">
        <video
          v-if="baseUrl.includes('.mp4')"
          ref="scrubVideo"
          width="100%"
          muted
        >
          <source :src="baseUrl" type="video/mp4" />
        </video>

        <canvas
          v-else
          ref="hero"
          style="pointer-events: none"
        />
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
import { marked } from "marked";

export default {
  props: {
    progress: Number,
    baseUrl: String,
    isFullWidth: Boolean,
    small: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    frameCount: 134,
    imageBase:
      "https://codesandbox-scrollytelling-demo.s3.eu-central-1.amazonaws.com",
    img: null,
    context: null,
    scrubConfig: null,
  }),
  computed: {
    shouldRenderToCanvas() {
      return !this.baseUrl.includes(".mp4");
    },
  },
  watch: {
    progress(newProgress) {
      if (newProgress >= 0 && newProgress <= 100) {
        if (this.shouldRenderToCanvas) {
          const newIndex =
            Math.floor((newProgress * this.frameCount) / 100) + 1;
          this.img.src = this.currentFrame(newIndex);
          this.context.drawImage(
            this.img,
            0,
            0,
            window.innerWidth,
            window.innerHeight
          );
        } else {
          const video = this.$refs.scrubVideo;
          video.currentTime = video.duration * (this.progress / 100);
        }
      }
    },
  },
  ready() {
    if (this.shouldRenderToCanvas) {
      this.setupCanvasRendering();
    } else {
      this.setupVideoRendering();
    }
  },
  methods: {
    currentFrame(index) {
      return `${this.baseUrl}/${index.toString().padStart(4, "0")}.jpg`;
    },
    preloadImages() {
      for (let i = 1; i < this.frameCount; i += 1) {
        const img = new Image();
        img.src = this.currentFrame(i);
      }
    },
    parseMarkdown(input) {
      return marked.parse(input).replace("<a", '<a target="_blank" ');
    },
    setupCanvasRendering() {
      fetch(`${this.baseUrl}/scrub.json`).then((response) => {
        response.json().then((json) => {
          this.scrubConfig = json;
        });
      });
      const canvas = this.$refs.hero;
      this.context = canvas.getContext("2d");

      this.img = new Image();
      this.img.src = this.currentFrame(1);
      canvas.width = 1920;
      canvas.height = 1080;
      this.img.onload = () => {
        this.context.drawImage(
          this.img,
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );
      };

      this.preloadImages();
    },
  },
};
</script>
