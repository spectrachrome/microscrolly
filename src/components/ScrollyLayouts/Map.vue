<template>
  <div
    ref="map"
    class="map fill-width fill-height"
    style="position: relative; pointer-events: none;"
  >
      <iframe
        v-show="image === null"
        :src="iframeURL"
        ref="mapframe"
        scroll="no"
        style="position: absolute; inset: -10px; width: calc(100vw + 20px); height: calc(100vh + 20px); z-index: 40;"
        frameborder="0"
      ></iframe>

      <v-fade-transition>
        <div
          v-show="image !== null"
          class="fill-width fill-height"
          style="position: absolute; inset: -20px; width: calc(100vw + 20px); height: calc(100vh + 20px); z-index: 43"
        >
          <img
            :src="image"
            style="object-fit: cover; width: 100%;"
          />
        </div>
      </v-fade-transition>
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
      loaded: false,
      image: null,
      config: {
        zoom:   0.0,
        center: [],
        layers: [],
      },
    }
  },
  methods: {
    onReady() {
      // Set the loaded flag to true after the iframe has loaded
      this.loaded = true;

      this.enableLayer(this.mapInfo.baseLayer);
    },

    requestUpdateMap() {
      requestAnimationFrame(() => {
        this.updateMap();
      });
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
      if (segmentDuration === 0) {
        return 0;
      }
      return (progressValue - (this.accumulatedDuration - segmentDuration)) / segmentDuration;
    },

    interpolateZoom (prevSegment, currentSegment, segmentProgress) {
      if (!prevSegment
          || isNaN(currentSegment.zoom)
          || isNaN(prevSegment.zoom)
          || isNaN(segmentProgress)
      ) {
        return currentSegment.zoom;
      }
      // Interpolate the zoom value based on the progress ratio
      return prevSegment ? prevSegment.zoom + segmentProgress * (currentSegment.zoom - prevSegment.zoom) : currentSegment.zoom;
    },

    interpolateLatLng (prevSegment, currentSegment, segmentProgress) {
      // Interpolate the latitude and longitude values based on the progress ratio
      let lat, lng;

      if (!prevSegment 
          || isNaN(currentSegment.center.lat)
          || isNaN(currentSegment.center.lng)
          || isNaN(prevSegment.center.lat)
          || isNaN(prevSegment.center.lng)
          || isNaN(segmentProgress)
      ) {
        lat = currentSegment.center.lat;
        lng = currentSegment.center.lng;
      } else {
        lat = prevSegment.center.lat + segmentProgress * (currentSegment.center.lat - prevSegment.center.lat);
        lng = prevSegment.center.lng + segmentProgress * (currentSegment.center.lng - prevSegment.center.lng);
      }

      return { lat, lng };
    },

    updateMap() {
      // Update the map center and zoom based on the interpolated latitude, longitude, and zoom values
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:enableScrolly',
      }, '*');
      
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setZoom',
        zoom: this.config.zoom,
      }, '*');

      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setCenter',
        center: this.config.center,
      }, '*');

      this.config.layers.map(l => this.enableLayer(l));
    },

    setMapTime (time) {
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:setTime',
        time: time,
      }, '*');
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

    disableAllLayers (name) {
      this.$refs.mapframe.contentWindow.postMessage({
        command: 'map:disableAllLayers',
        baseLayer: this.mapInfo.baseLayer,
      }, '*');
    },
  },
  mounted () {
    let poi = this.mapInfo.poi || 'AT-AQ5';
    let lat = 48.21;
    let lng = 16.36;
    let z   = this.mapInfo.zoom || 7;

    if (this.mapInfo.timeline[0].center) {
      lat = this.mapInfo.timeline[0].center.lat;
      lng = this.mapInfo.timeline[0].center.lng;
    }

    const seg = this.mapInfo.timeline[0];
    if (seg.type && seg.type === 'image') {
      // Make sure not to render a map if starting with image
      this.image = seg.image
    }

    this.$refs.mapframe.addEventListener('load', this.onReady);
  },
  watch: {
    progress(newValue) {
      const timeline = this.mapInfo.timeline;
      const progressValue = this.progress / 100;

      // Find the current timeline segment based on the progress value
      const { prevSegment, currentSegment } = this.findCurrentTimelineSegment(progressValue, timeline);

      // Calculate the progress ratio within the current segment
      const segmentProgress = this.calculateSegmentProgress(prevSegment, currentSegment, progressValue);

      const seg = currentSegment;

      if (currentSegment.dataLayerTime) {
        this.setMapTime(currentSegment.dataLayerTime);
      } else {
        this.setMapTime('newest');
      }

      if (seg.type) {
        // Image
        switch (seg.type) {
          case 'image':
            this.image = seg.image
            break

          default:
            console.warn(`Unknown segment type: ${seg.type}`);
        }
      } else {
        this.image = null;

        // Map
        this.$refs.mapframe.contentWindow.postMessage({
          command: 'map:setPoi',
          poi: currentSegment.poi,
        }, '*');

        // Interpolate center and zoom values based on the progress ratio
        let   { lat, lng } = this.interpolateLatLng(prevSegment, currentSegment, segmentProgress);
        this.config.center = [lng, lat];
        this.config.zoom   = this.interpolateZoom(prevSegment, currentSegment, segmentProgress);

        if (currentSegment.times) {
          const idx = Math.floor(segmentProgress * (currentSegment.times.length));
          let currentTime = currentSegment.times[idx];

          this.setMapTime({
            name:  currentTime,
            value: currentTime,
          });
        }

        if (currentSegment.layers) {
          this.config.layers = currentSegment.layers;
        } else {
          currentSegment.layers = [];
        }

        lng -= this.longitudeRange / 5;

        // Update the map center and zoom based on the interpolated latitude, longitude, and zoom values
        this.updateMap(this.zoom, lat, lng);
      }
    },
  },
  computed: {
    // How many degrees of longitude is the map wide?
    longitudeRange () {
      if (isNaN(this.zoom)) {
        return 0;
      }
      return 360 * this.$refs.map.clientWidth / (256 * Math.pow(2, this.zoom))
    },

    iframeURL () {
      return process.env.NODE_ENV === 'production'
        ? `/iframe?poi=${this.mapInfo.poi}&embedMap=true&z=2.562242424221073&lat=14.5&lng=47.5`
        : `http://gtif.eox.world:8812/iframe?poi=${this.mapInfo.poi}&embedMap=true&z=2.562242424221073&lat=14.5&lng=47.5`;
    }
  },
};
</script>

