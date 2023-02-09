<template>
  <div>
    <img-comparison-slider class="slider-example-split-line">
      <img slot="first" :src="compare[0]" />
      <img slot="second" :src="compare[1]" />
    </img-comparison-slider>
  </div>
</template>

<script>
export default {
  props: {
    compare: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.slider-example-split-line {
  --divider-width: 4px;
  --divider-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  --default-handle-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
  --default-handle-width: 100px;
}
img {
  max-width: 80vw;
}
</style>
