<template>
  <div id="app" class="w-[1280px] m-10 flex flex-wrap justify-center border border-red-300">
    <Header />
    <Search />
    <Categories />
    <Parking />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Search from '@/components/Search.vue';
import Categories from '@/components/Categories.vue';
import Parking from '@/components/Parking.vue';

export default {
  name: 'App',
  components: {
    Header,
    Search,
    Categories,
    Parking
  },
};
</script>
