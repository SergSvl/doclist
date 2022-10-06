<template>
  <div class="elementsParent w-full -border border-blue-300 pl-4 mt-6 min-h-[2.25rem]">
    <div v-for="(element, index) in freeElements"
      :key="index"
      :data-id="element.id"
      :data-category-id="'parking'"
      :data-order="element.order"
    >
      <Element :categoryId="'parking'" :element="element" :elements="freeElements" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Element from '@/components/Element.vue';
import { getLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from '@/utils/local-storage-keys';

export default {
  name: 'AppParking',
  components: {
    Element,
  },

  computed: {
    ...mapGetters('documents', ['freeElements']),
  },

  methods: {
    ...mapActions('documents', ['setFreeElements']),

    initialization() {
      const freeElements = getLSData(LOCAL_STORAGE_KEYS.freeElements);

      if (typeof freeElements === 'object' && freeElements !== null) {
        console.log('freeElements in LS: ', freeElements);
        this.setFreeElements(freeElements);
      }
      console.log('state freeElements: ', this.freeElements);
    },

  },

  created() {
    this.initialization();
  },
};
</script>
