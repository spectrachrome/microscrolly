<template>
  <v-row>
    <v-col>
      <article
        class="full-width-block d-flex"
        :style="item.scrub ? 'padding: 1000px 0' : ''"
      >
        <video
          v-if="item.video && item.autoplay"
          muted
          playsinline
          autoplay
          loop
        >
          <source :src="item.video" type="video/mp4" />
        </video>

        <video v-else-if="item.video && !item.autoplay" width="100%" controls>
          <source :src="item.video" type="video/mp4" />
        </video>

        <VideoScrubber
          v-else-if="item.scrub"
          :progress="progress"
          :base-url="item.scrub"
          is-full-width
          small
        />

        <ImageCompare v-else-if="item.compare" :compare="item.compare" />

        <TextSection v-else :text="item.text" />
      </article>
    </v-col>
  </v-row>
</template>

<script>
import TextSection from "../TextSection.vue";
import VideoScrubber from "./VideoScrubber.vue";
import ImageCompare from "./ImageCompare.vue";

export default {
  components: {
    TextSection,
    VideoScrubber,
    ImageCompare,
  },
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
  data: () => ({
    isExpanded: false,
  }),
};
</script>
