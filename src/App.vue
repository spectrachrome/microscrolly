<template>
  <v-app>
    <ScrollyTelling :items="items" />
  </v-app>
</template>

<script>
import ScrollyTelling from "./components/ScrollyTelling";

export default {
  components: {
    ScrollyTelling,
  },
  async mounted () {
    const urlParams = new URLSearchParams(window.location.search);
    this.dashboardId = urlParams.get('id');


    console.log(this.dashboardId);

    fetch(`https://dev-eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/get?id=${this.dashboardId}`)
      .then((response) => {
        response.json()
          .then(json => {
            var accumulator = [];
            var i = 0;

            while (i < json.features.length) {
              let current = json.features[i];
              let next = json.features[i + 1];

              // We need to check for undefined here since the sequence may have an odd number of steps.
              if (next !== undefined) {
                if (current.width === 1 && next.width === 3) {
                  accumulator.push(this.buildStickyRight(current, next, i));
                  i += 2;
                } else if (current.width === 4) {
                  accumulator.push([current]);
                  i += 1;
                }
              } else {
                break
              }
            }

            this.items = accumulator;
            console.log(this.items);
          })
          .catch(e => console.error(`Error decoding JSON: ${e}`));
      })
      .catch((e) => {
        console.error(`Error fetching dashboard: ${e}`)
      })
  },
  methods: {
    buildStickyRight (current, next) {
      if (next.text && next.text.includes('<--IMG-->')) {
        next.image = next.text.replaceAll('<--IMG-->', '');
      }

      return [current, next];
    },
  },
  data() {
    return {
      dashboardId: '',
      items: [],
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