export default {
  computed: {
    autoplayTriggered() {
      if (
        !this.item ||
        !this.item[1] ||
        !this.item[1].video ||
        !this.item[1].autoplay
      ) {
        return undefined;
      }
      if (this.progress >= 0 && this.progress <= 100) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    autoplayTriggered(play) {
      if (play === undefined) {
        return;
      }
      if (play === true) {
        this.$refs.autoplayVideo.play();
      } else {
        this.$refs.autoplayVideo.pause();
        this.$refs.autoplayVideo.currentTime = 0;
      }
    },
  },
};
