<template>
  <v-row>
    <v-col>
      <article class="full-width-block d-flex">
        <video
          v-if="item.video && item.autoplay"
          :class="{ 'full-width': item.fullwidth }"
          width="100%"
          muted
          playsinline
          autoplay
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

        <ExpansibleTextSection v-else :text="item.text" />
      </article>
    </v-col>
  </v-row>
</template>

<script>
import ExpansibleTextSection from "../ExpansibleTextSection.vue";
import VideoScrubber from "./VideoScrubber.vue";

export default {
  components: {
    ExpansibleTextSection,
    VideoScrubber,
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

<style scoped>
article.full-width-block {
  width: 100%;
}
</style>
