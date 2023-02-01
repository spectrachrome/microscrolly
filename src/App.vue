<template>
  <v-app>
    <v-container
      id="scroll-target"
      v-scroll.self="onScroll"
      style="
        height: 100vh;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;
      "
      class="overflow-y-auto overflow-x-hidden mx-0"
    >
      <component
        v-bind="componentProps['header']"
        :is="'Header'"
        v-if="hooks.header"
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
        v-bind="componentProps['beforeFooter']"
        :is="'BeforeFooter'"
        v-if="hooks.beforeFooter"
      ></component>

      <component
        v-bind="componentProps['beforeFooter']"
        :is="'Footer'"
        v-if="hooks.footer"
      ></component>
    </v-container>
  </v-app>
</template>

<script>
import Vue from "vue";

import ImageWithTextOverlay from "./components/ScrollyLayouts/ImageWithTextOverlay.vue";
import FullWidthBlock from "./components/ScrollyLayouts/FullWidthBlock.vue";
import StickyRight from "./components/ScrollyLayouts/StickyRight.vue";
import StickyLeft from "./components/ScrollyLayouts/StickyLeft.vue";
import VideoScrubbingFullWidth from "./components/ScrollyLayouts/VideoScrubbingFullWidth.vue";

import deserialize from "./util/deserializeComponent.js";

export default {
  components: {
    ImageWithTextOverlay,
    FullWidthBlock,
    StickyRight,
    StickyLeft,
    VideoScrubbingFullWidth,
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
    },
  }),
  created() {
    window.addEventListener("message", (message) => {
      // Look also for message.data.type here since there are also Webpack messages
      if (message && message.data.type) {
        console.info(`✉️ MESSAGE [${message.data.type}]`);

        if (message.data.type.includes("hook")) {
          let hookName = message.data.type.split(":")[1];

          console.log(message.data);

          // Populate our prop fields.
          this.componentProps[hookName] = message.data.props;

          this.hooks[hookName] = Vue.component(
            // Convert first letter to uppercase.
            hookName.charAt(0).toUpperCase() + hookName.slice(1),
            deserialize(message.data.data)
          );
        } else {
          switch (message.data.type) {
            case "items":
              this.items = message.data.data;
              break;

            case "css":
              this.linkStyle(message.data.path);
              break;

            default:
              break;
          }
        }
      }
    });
  },
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

    /**
     * Add the CSS styles from a given path to the iframe.
     *
     * @param {string} path - The path of the style to be applied.
     */
    linkStyle(path) {
      /*
        TODO: find a way to use SCSS for dedicated iframe styles
*/
      const link = document.createElement("link");
      link.href = path;
      link.rel = "stylesheet";
      link.type = "text/css";
      document.head.appendChild(link);
    },
  },
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

@media screen and (min-width: 1800px) {
  .row {
    max-width: 1300px;
  }

  .col {
    max-width: 40vw;
  }
}

/* Expand to full width even if the environment has constrained width */
.full-width {
  width: 100vw !important;
  margin-left: -50vw;
  margin-right: -50vw;
  position: relative;
}
</style>
