<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <article class="d-flex align-center" style="min-height: 800px">
        <ExpansibleTextSection :text="item[0].text" />
      </article>
    </v-col>
    <v-col cols="6" style="min-width: 520px">
      <v-fade-transition>
        <figure v-show="progress >= -50 && progress <= 150">
          <VideoScrubber
            v-if="item[1].scrub"
            :progress="progress"
            :base-url="item[1].scrub"
            small
          />

          <video
            v-else-if="item[1].video && !item[1].autoplay"
            width="100%"
            controls
          >
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <video
            v-else-if="item[1].video && item[1].autoplay"
            ref="autoplayVideo"
            width="100%"
            muted
            playsinline
            loop
          >
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <ImageCompare
            v-else-if="item[1].compare"
            :compare="item[1].compare"
          />

          <img v-else-if="item[1].image" :src="item[1].image" />

          <iframe
            v-else-if="item[1].iframe"
            class="item"
            :src="item[1].iframe"
            width="800px"
            height="500px"
            frameBorder="0"
            scroll="no"
            style="overflow: hidden"
          ></iframe>

          <!-- Progress display for debugging -->
          <!-- <span class="white--text pa-2" style="position: absolute; left: 0">
            {{ Math.round(progress) || 0 }}%
          </span> -->
        </figure>
      </v-fade-transition>
    </v-col>
  </v-row>
</template>

<script>
import ExpansibleTextSection from "../ExpansibleTextSection.vue";
import VideoScrubber from "./VideoScrubber.vue";
import autoplayVideo from "../../mixins/autoplayVideo";
import ImageCompare from "./ImageCompare.vue";

export default {
  components: {
    ExpansibleTextSection,
    VideoScrubber,
    ImageCompare,
  },
  mixins: [autoplayVideo],
  props: {
    item: Array,
    index: Number,
    progress: Number,
  },
};
</script>

<style scoped>
article {
  padding: 800px 50px 800px 50px;
}

figure {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 400px;
}

img {
  width: 100%;
}
</style>
