<template>
  <v-row justify="center">
    <v-col cols="4" style="z-index: 0">
      <article style="padding: 800px 0">
        <TextSection :text="item[0].text" />
      </article>
    </v-col>
    <v-col cols="8" style="z-index: 0">
      <v-fade-transition>
        <figure v-show="progress >= -50 && progress <= 150">
          <VideoScrubber
            v-if="item[1].scrub"
            :progress="progress"
            :base-url="item[1].scrub"
            small
          />

          <video v-else-if="item[1].video && !item[1].autoplay" controls>
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <video
            v-else-if="item[1].video && item[1].autoplay"
            ref="autoplayVideo"
            muted
            playsinline
            autoplay
            loop
          >
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <ImageCompare
            v-else-if="item[1].compare"
            :compare="item[1].compare"
          />

          <v-img v-else-if="item[1].image" :src="item[1].image" contain />

          <iframe
            v-else-if="item[1].iframe"
            :src="item[1].iframe"
            width="800px"
            height="500px"
            frameBorder="0"
            scroll="no"
            style="overflow: hidden"
          ></iframe>

          <TextSection v-else :text="item[1].text" />

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
import TextSection from "../TextSection.vue";
import VideoScrubber from "./VideoScrubber.vue";
import autoplayVideo from "../../mixins/autoplayVideo";
import ImageCompare from "./ImageCompare.vue";

export default {
  components: {
    TextSection,
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
figure {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
}

:deep(figure iframe),
figure img,
:deep(figure .v-image),
figure video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-25%, -50%);
  max-height: 100vh;
  max-width: 100%;
}

:deep(p) {
  margin-bottom: 200px;
}

:deep(p:last-child) {
  margin-bottom: 16px;
}
</style>
