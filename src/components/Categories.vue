<template>
  <div class="w-full border border-gray-300 pl-4">
    <template v-for="(category, index) in allCategories">
      <Category :key="index" :category='category'/>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Category from '@/components/Category.vue';
import { getLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from '@/utils/local-storage-keys';

export default {
  name: 'AppCategories',
  // props: {
  //   title: String
  // },
  components: {
    Category,
  },

  data() {
    return {
      title: 'Categories',
      allCategories: null,
    };
  },

  computed: {
    ...mapGetters({
      categories: 'documents/categories',
    }),
  },

  // computed: mapState({
  //   categories: state => state.documents.categories
  // }),

  methods: {
    initialization() {
      this.allCategories = this.categories;

      const categories = getLSData(LOCAL_STORAGE_KEYS.categories);
      // console.log('initialization LS categories: ', categories);

      if (typeof categories === 'object' && categories !== null) {
        this.allCategories = categories;
      }
      console.log('store categories: ', this.allCategories);
    },
  },

  created() {
    this.initialization();
  },

  mounted() {
    // console.log('store categories: ', this.categories);
  },

  updated() {
    // console.log('store categories: ', this.categories);
  },
};
</script>
