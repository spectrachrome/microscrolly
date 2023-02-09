<template>
  <v-row>
    <v-col>
      <article class="full-text-block d-flex">
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
article {
  padding: 100px 50px 200px 50px;
  margin: -12px;
  position: relative;
  flex-direction: column;
  align-items: center;
}

p {
  max-width: 100%;
}

:deep(img) {
  width: 100%;
}

@media screen and (min-width: 800px) {
  article.full-width-block {
    max-width: 50vw;
  }
  article.full-text-block > p > p {
    max-width: 70vw;
    margin-left: calc((100% - 70%) / 2);
    margin-right: calc((100% - 70%) / 2);
  }
}
</style>
