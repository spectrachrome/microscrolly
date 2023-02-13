<template>
  <v-row justify="center">
    <v-col cols="6" style="z-index: 0">
      <v-fade-transition>
        <figure v-show="progress >= 0 && progress <= 100">
          <VideoScrubber
            v-if="item[0].scrub"
            :progress="progress"
            :base-url="item[0].scrub"
            small
          />

          <video v-if="item[0].video && !item[0].autoplay" controls>
            <source :src="item[0].video" type="video/mp4" />
          </video>

          <video
            v-else-if="item[0].video && item[0].autoplay"
            ref="autoplayVideo"
            muted
            playsinline
            autoplay
            loop
          >
            <source :src="item[0].video" type="video/mp4" />
          </video>

          <ImageCompare
            v-else-if="item[1].compare"
            :compare="item[1].compare"
          />

          <v-img v-else-if="item[0].image" :src="item[0].image" contain />

          <iframe
            v-else-if="item[0].iframe"
            :src="item[0].iframe"
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
    <v-col cols="6" style="z-index: 0">
      <article style="padding: 800px 0">
        <TextSection :text="item[1].text" />
      </article>
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
  left: 0;
  transform: translate(-25%, -50%);
  max-height: 100vh;
  max-width: 100%;
}
</style>
