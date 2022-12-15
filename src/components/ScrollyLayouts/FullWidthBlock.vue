<template>
  <v-row>
    <v-col>
      <article class="full-text-block d-flex">
        <video
          v-if="item.video"
          :src="item.video"
          controls
          muted
          autoplay
          width="100%"
        />
        <ExpansibleTextSection
          v-else-if="item.text"
          :text="item.text"
        />
      </article>
    </v-col>
  </v-row>
</template>

<script>
import ExpansibleTextSection from '@/components/ExpansibleTextSection.vue';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  components: {
    ExpansibleTextSection,
  },
  data: () => ({
    isExpanded: false,
  }),
};
</script>

<style scoped>
article {
  padding: 100px 50px 200px 50px;
  margin: -12px;
  position: relative;
  flex-direction: column;
  align-items: center;
}

p {
  max-width: 100%;
}

:deep(img) {
  width: 100%;
}

@media screen and (min-width: 800px) {
  article.full-width-block {
    max-width: 50vw;
  }
  article.full-text-block > p > p {
    max-width: 70vw;
    margin-left: calc((100% - 70%) / 2);
    margin-right: calc((100% - 70%) / 2);
  }
}
</style>