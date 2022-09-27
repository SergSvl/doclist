<template>
  <div class="w-full my-2 -border border-green-300 ml-4">
    <div class="w-[50%] relative text-left my-2 -border border-green-300">
      <img class="absolute pt-1.5" :src="search" />
      <input class="border-b w-full pb-2 pl-6 outline-none" value="" />
      <div class="absolute right-0 w-[1rem] h-[1rem] p-0 -mt-7 leading-[1rem] font-thin text-3xl text-red-500 -border border-red-400 hover:cursor-pointer hover:text-red-600 rotate-45 hover:transition-all duration-200 select-none">+</div>
    </div>
  </div>
</template>

<script>
import search from '@/assets/svg/search.svg';

export default {
  name: 'AppSearch',
  // props: {
  //   title: String
  // },

  data() {
    return {
      search
    };
  },
};
</script>
