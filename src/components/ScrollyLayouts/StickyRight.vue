<template>
  <v-row justify="center" class="mx-0">
    <v-col cols="6">
      <article style="min-height: 800px">
        <ExpansibleTextSection :text="item[0].text" />
      </article>
    </v-col>
    <v-col cols="6" style="min-width: 520px">
      <v-fade-transition>
        <figure v-show="progress >= 0 && progress <= 100">
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
            width="100%"
            muted
            playsinline
            autoplay
          >
            <source :src="item[1].video" type="video/mp4" />
          </video>

          <img
            v-else-if="item[1].image"
            :src="item[1].image"
            :style="`filter: saturate(${(progress || 0) / 100});`"
          />

          <iframe
            v-else
            class="item"
            :src="`https://race.esa.int/iframe?poi=${
              item[1].id.split('@')[0]
            }&z=${
              item[1].mapInfo.zoom
            }&lat=${
              item[1].mapInfo.center.lat
            }&lng=${
              item[1].mapInfo.center.lng
            }`"
            width="800px"
            height="500px"
            frameBorder="0"
            scroll="no"
            style="overflow:hidden"
          ></iframe>

          <span class="white--text pa-2" style="position: absolute; left: 0">
            {{ Math.round(progress) || 0 }}%
          </span>
        </figure>
      </v-fade-transition>
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
    item: Array,
    index: Number,
    progress: Number,
  },
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
