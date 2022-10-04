<template>
  <div id="categoriesParent" class="w-full -border border-gray-300 pl-4">
    <div v-for="(category, index) in isFiltration ? filteredCategories : categories"
      :key="index"
      :data-id="category.id"
      :data-order="category.order"
    >
      <Category :category="category" :categories="categories"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Category from '@/components/Category.vue';
import { getLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from '@/utils/local-storage-keys';

export default {
  name: 'AppCategories',
  components: {
    Category,
  },

  data() {
    return {
      title: '',
    };
  },

  computed: {
    ...mapGetters('documents', ['categories', 'filteredCategories', 'isFiltration']),
  },

  methods: {
    ...mapActions('documents', ['setCategories']),

    initialization() {
      const categories = getLSData(LOCAL_STORAGE_KEYS.categories);

      if (typeof categories === 'object' && categories !== null) {
        // console.log('categories in LS: ', categories);
        this.setCategories(categories);
      } else {
        this.setCategories(this.categories);
      }
      console.log('state categories: ', this.categories);
    },

  },

  created() {
    this.initialization();
  },

  updated() {
    // console.log('updated: ');
    // console.log('state categories: ', this.categories);
    // console.log('state filteredCategories: ', this.filteredCategories);
  },
};
</script>
