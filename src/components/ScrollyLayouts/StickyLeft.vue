<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <v-fade-transition>
        <figure v-show="progress >= -50 && progress <= 150">
          <VideoScrubber
            v-if="item[0].scrub"
            :progress="progress"
            :base-url="item[0].scrub"
            small
          />

          <video
            v-if="item[0].video && !item[0].autoplay"
            width="100%"
            controls
          >
            <source :src="item[0].video" type="video/mp4" />
          </video>

          <video
            v-else-if="item[0].video && item[0].autoplay"
            ref="autoplayVideo"
            width="100%"
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

          <img v-else-if="item[0].image" :src="item[0].image" />

          <iframe
            v-else-if="item[0].iframe"
            class="item"
            :src="item[0].iframe"
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
    <v-col cols="6">
      <article class="d-flex align-center" style="min-height: 800px">
        <ExpansibleTextSection :text="item[1].text" />
      </article>
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
