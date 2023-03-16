<template>
  <div
    ref="map"
    :class="{
      'ml-16': $vuetify.breakpoint.lgAndUp,
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
/**
 * @typedef {Object} props
 * @property {number} [longitudeOffset=0] - A positive or negative offset value to be applied to the map's longitude for scrolly layouts. Positive values move the map to the east, while negative values move it to the west.
 */

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
    longitudeOffset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      minProgress: 0,
      maxProgress: 100,
      zoom: 3.5,
      accumulatedDuration: 0,
      lastTime: '',
      url: `http://gtif.eox.world:8812/iframe?poi=${this.mapInfo.poi}&embedMap=true&z=2.562242424221073&lat=14.5&lng=47.5`,
      loaded: false,
    }
  },
  methods: {
    onIframeLoaded() {
      // Set the loaded flag to true after the iframe has loaded
      this.loaded = true
    },

    findCurrentTimelineSegment (progressValue, timeline) {
      // Find the current timeline segment based on the progress value
      this.accumulatedDuration = 0;
      let currentSegment = null;
      let prevSegment = null;

      for (let i = 0; i < timeline.length; i++) {
        prevSegment = currentSegment;
        currentSegment = timeline[i];
        this.accumulatedDuration += timeline[i].duration;

        if (progressValue <= this.accumulatedDuration) {
          break;
        }
      }

      return { prevSegment, currentSegment };
    },

    calculateSegmentProgress (prevSegment, currentSegment, progressValue) {
      // Calculate the progress ratio within the current segment
      const segmentDuration = currentSegment.duration;
      return prevSegment ? (progressValue - (this.accumulatedDuration - segmentDuration)) / segmentDuration : 0;
    },

    interpolateZoom (prevSegment, currentSegment, segmentProgress) {
      // Interpolate the zoom value based on the progress ratio
      return prevSegment ? prevSegment.zoom + segmentProgress * (currentSegment.zoom - prevSegment.zoom) : currentSegment.zoom;
    },

    interpolateLatLng (prevSegment, currentSegment, segmentProgress) {
      // Interpolate the latitude and longitude values based on the progress ratio
      let lat = prevSegment ? prevSegment.center.lat + segmentProgress * (currentSegment.center.lat - prevSegment.center.lat) : currentSegment.center.lat;
      let lng = prevSegment ? prevSegment.center.lng + segmentProgress * (currentSegment.center.lng - prevSegment.center.lng) : currentSegment.center.lng;
      return { lat, lng };
    },

    updateMap(zoom, lat, lng) {
      // Update the map center and zoom based on the interpolated latitude, longitude, and zoom values
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:enableScrolly',
      }, '*');
      
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setZoom',
        zoom: zoom,
      }, '*');

      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setCenter',
        center: [lng, lat],
      }, '*');
    },

    setMapTime (time) {
      if (time.value !== this.lastTime.value) {
        this.$refs.mapframe.contentWindow.postMessage({
          command: 'map:setTime',
          time: time,
        }, '*');

        this.lastTime = time;
      }
    },

    enableLayer (name) {
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:enableLayer',
        name: name,
      }, '*');
    },

    disableLayer (name) {
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:disableLayer',
        name: name,
      }, '*');
    },
  },
  mounted () {
    let poi = this.mapInfo.poi;
    let lat = this.mapInfo.timeline[0].center.lat;
    let lng = this.mapInfo.timeline[0].center.lng;
    let z   = this.mapInfo.zoom;

    this.url = `http://gtif.eox.world:8812/iframe?poi=${this.mapInfo.poi}&embedMap=true&z=${z}&lat=${lat}&lng=${lng}`;
  },
  watch: {
    progress(newValue) {
      const timeline = this.mapInfo.timeline;
      const progressValue = this.progress / 100;

      // Find the current timeline segment based on the progress value
      const { prevSegment, currentSegment } = this.findCurrentTimelineSegment(progressValue, timeline);

      // Calculate the progress ratio within the current segment
      const segmentProgress = this.calculateSegmentProgress(prevSegment, currentSegment, progressValue);

      // Interpolate center and zoom values based on the progress ratio
      let   { lat, lng } = this.interpolateLatLng(prevSegment, currentSegment, segmentProgress);
      this.zoom          = this.interpolateZoom(prevSegment, currentSegment, segmentProgress);

      if (currentSegment.time) {
        this.setMapTime({
          name: currentSegment.time,
          value: currentSegment.time,
        });
      }

      if (currentSegment.layers) {
        for (var layer of currentSegment.layers.enable) {
          this.enableLayer(layer);
        }
        currentSegment.layers.disable.map(n => this.disableLayer(n));
      }

      lng -= this.longitudeRange / 5;

      // Update the map center and zoom based on the interpolated latitude, longitude, and zoom values
      this.updateMap(this.zoom, lat, lng);
    },
  },
  computed: {
    startZoom () {
      return this.mapInfo.startZoom || 2.5
    },

    endZoom () {
      return this.mapInfo.endZoom || 5.5
    },

    longitudeRange () {
      return 360 * this.$refs.map.clientWidth / (256 * Math.pow(2, this.zoom))
    },
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

