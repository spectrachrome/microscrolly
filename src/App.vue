<template>
  <v-app>
    <ScrollyTelling :items="scrollyItems" />
  </v-app>
</template>

<script>
import ScrollyTelling from "./components/ScrollyTelling";

export default {
  components: {
    ScrollyTelling,
  },
  data() {
    return {
      scrollyItems: [
        [
          {
            width: 4,
            image: "https://picsum.photos/id/1022/2000/1000",
          },
        ],
        [
          {
            width: 4,
            scrub: true,
          },
        ],
        [
          {
            width: 4,
            text: true,
          },
        ],
        [
          {
            width: 1,
            text: true,
          },
          {
            width: 3,
            image: "https://picsum.photos/id/10/800/600",
          },
        ],
        [
          {
            width: 3,
            image: "https://picsum.photos/id/1015/800/600",
          },
          {
            width: 1,
            text: true,
          },
        ],
        [
          {
            width: 4,
            text: true,
          },
        ],
      ],
    };
  },
};
</script>