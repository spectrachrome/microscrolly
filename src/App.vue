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
            var currentWidth = 0;

            for (let entry of json.features) {
              if (entry.hasOwnProperty('text') && entry.text.includes('<--IMG-->')) {
                entry.image = entry.text.replaceAll('<--IMG-->', '');
                entry.text = undefined;
              }

              if (currentWidth < 4) {
                currentWidth += entry.width;
                accumulator.push(entry);
              } else {
                this.items.push([...accumulator]);
                accumulator = [];
                currentWidth = 0;
              }
            }
            console.log(this.items);
          })
          .catch(e => console.error(`Error decoding JSON: ${e}`));
      })
      .catch((e) => {
        console.error(`Error fetching dashboard: ${e}`)
      })
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