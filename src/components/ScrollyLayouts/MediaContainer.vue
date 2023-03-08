<template>
  <v-fade-transition>
    <figure v-show="progress >= -50 && progress <= 150">
      <VideoScrubber
        v-if="item.scrub"
        :progress="progress"
        :base-url="item.scrub"
        small
      />

      <video v-else-if="item.video && !item.autoplay" controls>
        <source :src="item.video" type="video/mp4" />
      </video>

      <video
        v-else-if="item.video && item.autoplay"
        ref="autoplayVideo"
        muted
        playsinline
        autoplay
        loop
      >
        <source :src="item.video" type="video/mp4" />
      </video>

      <ImageCompare
        v-else-if="item.compare"
        :compare="item.compare"
      />

      <v-img v-else-if="item.image" :src="item.image" contain />

      <iframe
        v-else-if="item.iframe"
        :src="item.iframe"
        width="800px"
        height="500px"
        frameBorder="0"
        scroll="no"
        style="overflow: hidden"
      ></iframe>

      <TextSection v-else :text="item.text" />

      <!-- Progress display for debugging -->
      <!-- <span class="white--text pa-2" style="position: absolute; left: 0">
        {{ Math.round(progress) || 0 }}%
      </span> -->
    </figure>
  </v-fade-transition>
</template>

<script>
import ImageCompare  from './ImageCompare.vue';
import TextSection   from '../TextSection.vue';
import VideoScrubber from './VideoScrubber.vue';

import autoplayVideo from "../../mixins/autoplayVideo";

export default {
  name: 'MediaContainer',
  props: {
    item: {
      type: Object,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  mixins: [autoplayVideo],
  components: {
    ImageCompare,
    TextSection,
    VideoScrubber,
  },
};
</script>

<style scoped>
figure {
  position: sticky;
}

figure iframe,
figure img,
figure .v-image,
figure video {
  pointer-events: none;
}

figure video[controls] {
  pointer-events: all;
}

/* smAndDown */
@media only screen and (max-width: 959px) {
  figure {
    top: 120px !important;
    height: 30vh;
  }

  figure iframe,
  figure img,
  figure .v-image,
  figure video {
    position: fixed;
    top: 0;
    width: 100%;
    border-radius: 0;
  }
}

/* mdAndUp */
@media only screen and (min-width: 960px) {
  figure {
    top: 50%;
  }

  figure iframe,
  figure img,
  figure .v-image,
  figure video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-25%, -50%);
    max-height: 100vh;
    max-width: 100%;
  }
}

:deep(p) {
  margin-bottom: 200px;
}

:deep(p:last-child) {
  margin-bottom: 16px;
}
</style>
