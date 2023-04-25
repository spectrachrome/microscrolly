<template>
  <div class="sticky-right">
    <v-row v-if="$vuetify.breakpoint.mdAndUp" justify="center">
      <v-col
        :cols="$vuetify.breakpoint.lgAndUp ? 6 : 12"
        :class="{'align-center': $vuetify.breakpoint.mdAndDown}"
        class="d-flex"
        style="z-index: 0"
      >
        <article style="padding: 800px 0">
          <TextSection :text="item[0].text" />
        </article>
      </v-col>
      <v-col cols="6" style="z-index: 50">
        <MediaContainer
          :item="item[1]"
          :progress="progress"
        />
      </v-col>
    </v-row>

    <v-col v-else-if="$vuetify.breakpoint.smAndDown && shouldOverlayText" justify="center">
      <div style="z-index: 50">
        <MediaContainer
          :item="item[1]"
          :progress="progress"
          :should-overlay-text="shouldOverlayText"
        />
      </div>
      <div style="position: relative; z-index: 0">
        <article style="padding: 800px 0 z-index: 0">
          <TextSection
            :text="item[0].text"
            :should-overlay-text="shouldOverlayText"
          />
        </article>
      </div>
    </v-col>

    <v-col v-else justify="center">
      <div style="z-index: 50">
        <MediaContainer
          :item="item[1]"
          :progress="progress"
        />
      </div>
      <div style="z-index: 0">
        <article style="padding: 800px 0">
          <TextSection :text="item[0].text" />
        </article>
      </div>
    </v-col>
  </div>
</template>

<script>
import TextSection from "../TextSection.vue";
import MediaContainer from "./MediaContainer.vue";

export default {
  components: {
    TextSection,
    MediaContainer,
  },
  props: {
    item: Array,
    index: Number,
    progress: Number,
    shouldOverlayText: Boolean,
  },
};
</script>
