<template>
  <v-app>
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
        padding: 0;
      "
      class="overflow-y-auto overflow-x-hidden mx-0"
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
        <FullWidthBlock
          v-else-if="(item[0].width === 4 && item[0].text) || item[0].video"
          :key="index"
          :item="item[0]"
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
          :base-url="item[0].scrub"
        />
      </template>
      <component v-if="footer" :is="'ScrollyFooter'"></component>
    </v-container>
  </v-app>
</template>

<script>
import Vue from "vue";

import ImageWithTextOverlay from "./components/ScrollyLayouts/ImageWithTextOverlay";
import FullWidthBlock from "./components/ScrollyLayouts/FullWidthBlock";
import StickyRight from "./components/ScrollyLayouts/StickyRight";
import StickyLeft from "./components/ScrollyLayouts/StickyLeft";
import VideoScrubbingFullWidth from "./components/ScrollyLayouts/VideoScrubbingFullWidth";

import deserialize from "@/util/deserializeComponent";

export default {
  components: {
    ImageWithTextOverlay,
    FullWidthBlock,
    StickyRight,
    StickyLeft,
    VideoScrubbingFullWidth
  },
  created() {
    window.addEventListener("message", message => {
      if (message) {
        console.info(`✉️ MESSAGE [${message.data.type}]`);

        switch (message.data.type) {
          case "items":
            this.items = message.data.data;
            break;

          case "footer":
            // Extract Vue component out of JSON string
            this.footer = Vue.component(
              "ScrollyFooter",
              deserialize(message.data.data)
            );
            console.log(this.footer);
            break;

          default:
            break;
        }
      }
    });
  },
  data: () => ({
    progress: {},
    footer: null,
    items: []
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
    }
  }
};
</script>

<style>
@media screen and (min-width: 700px) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    max-width: 66vw;
  }
}
</style>
