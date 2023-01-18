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
      <component
        v-if="hooks.header"
        v-bind="this.componentProps['header']"
        :is="'Header'"
      ></component>

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

      <component
        v-if="hooks.beforeFooter"
        v-bind="this.componentProps['beforeFooter']"
        :is="'BeforeFooter'"
      ></component>

      <component
        v-if="hooks.footer"
        v-bind="this.componentProps['beforeFooter']"
        :is="'Footer'"
      ></component>
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
      // Look also for message.data.type here since there are also Webpack messages
      if (message && message.data.type) {
        console.info(`✉️ MESSAGE [${message.data.type}]`);

        if (message.data.type.includes('hook')) {
          let hookName = message.data.type.split(':')[1];

          this.hooks[hookName] = Vue.component(
            // Convert first letter to uppercase.
            hookName.charAt(0).toUpperCase() + hookName.slice(1),
            deserialize(message.data.data)
          );

          // Populate our prop fields.
          this.componentProps[hookName] = message.data.props;
        } else {
          switch (message.data.type) {
            case "items":
              this.items = message.data.data;
              break;

            default:
              break;
          }
        }
      }
    });
  },
  data: () => ({
    progress: {},
    items: [],
    hooks: {
      header: null,
      beforeFooter: null,
      footer: null,
    },
    componentProps: {
      header: {},
      beforeFooter: {},
      footer: {},
    }
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
