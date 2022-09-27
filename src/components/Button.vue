<template>
  <div v-if="type === 'bookmark'">
    <div class="ml-2.5">
      <button
        class="border relative rounded-full shadow-sm px-2.5 align-middle h-8 hover:bg-slate-50"
      >
        <img :src="bookmark" />
      </button>
    </div>
  </div>
  <div v-else-if="type === 'toggler'">
    <div class="">
      <button
        class="border relative rounded-full shadow-sm align-middle mx-auto text-center h-5 w-5 hover:bg-slate-50"
      >
        <div v-if="state === 'closed'" class="border-b-2 border-r-2 border-blue-500 rotate-45 w-2 h-2 mb-1 mx-auto"></div>
        <div v-else class="border-t-2 border-l-2 border-blue-500 rotate-45 w-2 h-2 mt-1 mx-auto"></div>
      </button>
    </div>
  </div>
  <div class="ml-2.5 group" v-else>
    <span class="-border absolute text-3xl text-blue-600 font-normal ml-1 -mt-1 cursor-pointer group-hover:z-10">
      +
    </span>
    <button
      class="border relative rounded-full shadow-sm pl-8 pr-3 align-middle h-8 hover:bg-slate-50 group-hover:bg-slate-50"
    >
      <span
        class="-border text-xs font-medium inline-block leading-7 align-bottom"
        >{{ text }}</span
      >
    </button>
  </div>
</template>

<script>
import bookmark from '@/assets/svg/bookmark.svg';

export default {
  name: 'AppButton',
  props: {
    type: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: 'closed',
    },
  },

  data() {
    return {
      bookmark,
    };
  },
};
</script>
