<template>
  <v-container
    id="scroll-target"
    style="
      height: 100vh;
      max-width: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    "
    class="overflow-y-auto mx-0"
    v-scroll.self="onScroll"
  >
    <template v-for="(item, index) in items">
      <ImageWithTextOverlay
        v-if="item[0].width === 4 && item[0].image"
        :key="index"
        :item="item"
        :index="index"
        :progress="progress[index] || 0"
      />
      <FullTextBlock
        v-else-if="item[0].width === 4 && item[0].text"
        :key="index"
      />
      <StickyRight
        v-else-if="item[0].width === 1"
        :key="index"
        :item="item"
        :index="index"
        :progress="progress[index]"
      />
      <StickyLeft
        v-else-if="item[0].width === 3"
        :key="index"
        :item="item"
        :index="index"
        :progress="progress[index]"
      />
      <VideoScrubbingFullWidth
        v-else-if="item[0].scrub"
        :key="index"
        :progress="progress[index]"
      />
    </template>
  </v-container>
</template>

<script>
import ImageWithTextOverlay from "./ScrollyLayouts/ImageWithTextOverlay";
import FullTextBlock from "./ScrollyLayouts/FullTextBlock";
import StickyRight from "./ScrollyLayouts/StickyRight";
import StickyLeft from "./ScrollyLayouts/StickyLeft";
import VideoScrubbingFullWidth from "./ScrollyLayouts/VideoScrubbingFullWidth";

export default {
  components: {
    ImageWithTextOverlay,
    FullTextBlock,
    StickyRight,
    StickyLeft,
    VideoScrubbingFullWidth,
  },
  props: {
    items: {
      type: Array,
    },
  },
  data: () => ({
    progress: {},
  }),
  methods: {
    onScroll() {
      const windowHeight = window.innerHeight;
      const articles = [...document.querySelectorAll("article")];
      articles.forEach((currentElement, index) => {
        const elementHeight = currentElement.clientHeight;
        const elementTop = currentElement.getBoundingClientRect().top;
        this.$set(
          this.progress,
          index,
          ((windowHeight - elementTop - elementHeight * 0.33) / elementHeight) *
            100
        );
      });
    },
  },
};
</script>