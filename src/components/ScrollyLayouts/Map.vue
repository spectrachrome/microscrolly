<template>
  <div
    :class="{
      'ml-16': $vuetify.breakpoint.mdAndUp,
      'fullscreen': $vuetify.breakpoint.mdAndDown,
    }"
    style="pointer-events: none;"
    :style="{
      height: $vuetify.breakpoint.lgAndUp ? '500px': '100%',
    }"
  >
      <div style="position: fixed; right: 30px; top: 30px;">
        {{ zoom }}
      </div>
      <iframe
          :src="url"
          ref="mapframe"
          scroll="no"
          class="fill-height fill-width"
          frameborder="0"
      ></iframe>
    </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    mapInfo: {
      type: Object,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      minProgress: 0,
      maxProgress: 100,
      zoom: 3.5,
      url: 'http://gtif.eox.world:8812/iframe?poi=AT-AQC&embedMap=true&z=2.562242424221073&lat=14.5&lng=47.5',
      loaded: false,
    }
  },
  methods: {
    onIframeLoaded() {
      // Set the loaded flag to true after the iframe has loaded
      this.loaded = true
    },
  },
  watch: {
    progress(newValue) {
      const progressRatio = (this.progress - this.minProgress) / (this.maxProgress - this.minProgress);
      this.zoom = this.startZoom + progressRatio * (this.endZoom - this.startZoom);

      // interpolate from one latitude-longitude pair to another
      const startLat = this.mapInfo.startLat || -9.480253386695793;
      const endLat = this.mapInfo.endLat || 14.5;
      const startLng = this.mapInfo.startLng || 71.42857142857143;
      const endLng = this.mapInfo.endLng || 47.5;

      const maxLat = Math.max(startLat, endLat);
      const minLat = Math.min(startLat, endLat);
      const maxLng = Math.max(startLng, endLng);
      const minLng = Math.min(startLng, endLng);

      const lat = Math.min(Math.max(startLat + progressRatio * (endLat - startLat), minLat), maxLat);
      const lng = Math.min(Math.max(startLng + progressRatio * (endLng - startLng), minLng), maxLng);

      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:enableScrolly',
      }, '*');
      
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setZoom',
        zoom: this.zoom,
      }, '*');

      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setCenter',
        center: [lat, lng],
      }, '*');
    },
  },
  computed: {
    startZoom() {
      return this.mapInfo.startZoom || 2.5
    },
    endZoom() {
      return this.mapInfo.endZoom || 5.5
    },
  },
  mounted () {
  
  },
  components: {

  },
};
</script>

<style scoped>
  .fullscreen {
    position: fixed;
    top: -10px;
    right: -10px;
    bottom: -10px;
    left: -10px;
  }
</style>

