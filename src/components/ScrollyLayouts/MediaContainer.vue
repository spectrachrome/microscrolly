<template>
  <v-fade-transition>
    <figure
      v-show="progress >= -15 && progress <= 115"
      :class="{'overlay': shouldOverlayText}"
    >
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

      <iframe
        v-else-if="item.mapInfo && item.mapInfo.timeline === undefined"
        :src="`https://gtif.esa.int/iframe?poi=${item.mapInfo.poi}&embedMap=true&z=${item.mapInfo.zoom}&lat=${item.mapInfo.center.lat}&lng=${item.mapInfo.center.lng}`"
        width="640px"
        height="500px"
        frameBorder="0"
        scroll="no"
        style="overflow: hidden"
      ></iframe>

      <Map
        v-else-if="item.mapInfo && item.mapInfo.timeline"
        :map-info="item.mapInfo"
        :progress="progress"
      />

      <TextSection v-else :text="item.text || ''" />

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
import Map from './Map.vue';

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
    shouldOverlayText: {
      type: Boolean,
      default: false,
    },
  },
  mounted () {
    console.log(`shouldOverlayText? ${this.shouldOverlayText}`);
  },
  mixins: [autoplayVideo],
  components: {
    ImageCompare,
    TextSection,
    VideoScrubber,
    Map,
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

figure.overlay {
  position: fixed;
  pointer-events: none;
}

figure.overlay iframe,
figure.overlay img,
figure.overlay .v-image,
figure.overlay video {
  height: 100% !important;
  width: auto !important;
  pointer-events: none;
  left: -50%;
}
/*
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
      top: calc(50% - 500px / 2);
    }

    figure iframe,
    figure img,
    figure .v-image,
    figure video {
/*
      position: absolute;
      top: 50%;
      left: 50%;
*/
      /*transform: translate(-25%, -50%);*/
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
