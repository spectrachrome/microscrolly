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
          v-if="item[0].width === 4 && item[0].mapInfo"
          :key="index"
          :item="item[0]"
          :index="index"
          :progress="progress[index] || 0"
        />
        <FullWidthBlock
          v-else-if="(item[0].width === 4 && item[0].text) || item[0].video"
          :key="index"
          :item="item[0]"
          :progress="progress[index] || 0"
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

import deserialize from "./util/deserializeComponent.js";

export default {
  components: {
    ImageWithTextOverlay,
    FullWidthBlock,
    StickyRight,
    StickyLeft,
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
              this.linkStyle(message.data.css);
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
      const mapBetween = (currentNum, minAllowed, maxAllowed, min, max) => {
        // https://stackoverflow.com/a/42110995
        return (
          ((maxAllowed - minAllowed) * (currentNum - min)) / (max - min) +
          minAllowed
        );
      };

      const windowHeight = window.innerHeight;
      const articles = [...document.querySelectorAll("article")];
      articles.forEach((currentElement, index) => {
        const scrollProgress =
          document.querySelector("#scroll-target").scrollTop;
        const elementDistanceToTop = currentElement.offsetTop;
        const elementHeight = currentElement.clientHeight;
        const startProgress = elementDistanceToTop;
        const endProgress = elementDistanceToTop + elementHeight - windowHeight;
        const currentProgress = mapBetween(
          scrollProgress,
          0,
          100,
          startProgress,
          endProgress
        );
        this.$set(this.progress, index, currentProgress);
      });
    },

    /**
     * Add the CSS styles from a given path to the iframe.
     *
     * @param {string} path - The path of the style to be applied.
     */
    linkStyle(css) {
      /*
            TODO: find a way to use SCSS for dedicated iframe styles
    */
      // Create a new <style> element from the style string and add it to document header.
      var style = document.createElement("style");
      style.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(style);

      style.innerHTML = css;
    },
  },
};
</script>

<style>
.row + .row {
  margin-top: 0;
}

/*
  .row {
    max-width: 1000px;
    padding: 0 10vw;
  }

  @media screen and (min-width: 800px) {
    .row {
      padding: 0 5vw;
    }
  }

  @media screen and (min-width: 1800px) {
    .row {
      max-width: 1300px;
    }
  }
*/

/* Use this class inside scrolly items to expand to full width even if the environment has constrained width */
.full-width {
  width: 100vw !important;
  margin-left: -50vw;
  margin-right: -50vw;
  left: 50%;
  right: 50%;
  position: relative;
  padding: 40px 24px;
}

@media screen and (min-width: 800px) {
  .full-width {
    padding: 40px 120px;
  }
}

/* Make all videos display block by default to avoid whitespaces */
video {
  display: block;
}

/* Fix Vuetify col spacing in order to allow seamless stories */
.col {
  padding: 0;
}
</style>

<style>
article canvas,
article video,
article img,
article .v-image {
  max-width: 100%;
  height: auto;
}

figure iframe,
figure img,
figure video,
figure .v-image {
  border-radius: 16px;
  position: absolute;
}

h1 {
  font-size: 3rem;
  margin-top: 40px;
  margin-bottom: 20px;
}
h2 {
  font-size: 2rem;
  margin-top: 30px;
  margin-bottom: 15px;
}
p {
  font-size: 1.3rem;
}
</style>
