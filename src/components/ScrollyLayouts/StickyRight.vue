<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <article style="min-height: 800px">
        <ExpansibleTextSection :text="item[0].text" />
      </article>
    </v-col>
    <v-col cols="6">
      <v-fade-transition>
        <figure v-show="progress >= 0 && progress <= 100">
          <VideoScrubbingWindow
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
            width="100%"
            muted
            playsinline
            autoplay
          >
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <v-img
            v-else
            :src="item[1].image"
            :style="`filter: saturate(${(progress || 0) / 100});`"
          />
          <span class="white--text pa-2" style="position: absolute; left: 0">
            {{ Math.round(progress) || 0 }}%
          </span>
        </figure>
      </v-fade-transition>
    </v-col>
  </v-row>
</template>

<script>
import ExpansibleTextSection from "@/components/ExpansibleTextSection";
import VideoScrubbingWindow from "./VideoScrubbingWindow";

export default {
  props: {
    item: Array,
    index: Number,
    progress: Number
  },
  components: {
    ExpansibleTextSection,
    VideoScrubbingWindow
  }
};
</script>

<style scoped>
article {
  padding: 200px 50px;
}

article p {
  margin-bottom: 200px !important;
}

figure {
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
}

img {
  width: 100%;
}
</style>
