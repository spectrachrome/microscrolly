<template>
  <div>
    <v-fade-transition>
      <div v-show="progress >= 0 && progress <= 100">
        <canvas
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
    <v-container>
      <v-col cols="6">
        <article
          class="white--text"
          style="height: 1000px; padding: 400px 50px 300px 50px"
        >
          <h1 class="text-h1 mb-8">Space Exploration</h1>
          <p>Lorem Ipsum sit dolor amet.</p>
          <p>
            Mauris felis ipsum, placerat sit amet accumsan non, commodo ac arcu.
            Phasellus lorem urna, consectetur non ornare et, pharetra id risus.
          </p>
          <br /><br />
          <p>
            Proin sit amet commodo velit. Ut vitae quam elit. Donec nulla dui,
            ullamcorper ac dui nec, pretium feugiat lectus. Nam vestibulum odio
            arcu, eu efficitur tellus maximus ac.
          </p>
        </article>
      </v-col>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    progress: Number,
  },
  data: () => ({
    frameCount: 165,
    imageBase:
      "https://codesandbox-scrollytelling-demo.s3.eu-central-1.amazonaws.com",
    img: null,
    context: null,
  }),
  mounted() {
    const canvas = this.$refs.hero;
    this.context = canvas.getContext("2d");

    this.img = new Image();
    this.img.src = this.currentFrame(1);
    canvas.width = 1920;
    canvas.height = 1080;
    this.img.onload = () => {
      this.context.drawImage(this.img, 0, 0);
    };

    this.preloadImages();
  },
  methods: {
    currentFrame(index) {
      return `${this.imageBase}/${index.toString().padStart(4, "0")}.jpg`;
    },
    preloadImages() {
      for (let i = 1; i < this.frameCount; i++) {
        const img = new Image();
        img.src = this.currentFrame(i);
      }
    },
  },
  watch: {
    progress(newProgress) {
      if (newProgress >= 0 && newProgress <= 100) {
        const newIndex = Math.floor((newProgress * this.frameCount) / 100) + 1;
        this.img.src = this.currentFrame(newIndex);
        this.context.drawImage(this.img, 0, 0);
      }
    },
  },
};
</script>