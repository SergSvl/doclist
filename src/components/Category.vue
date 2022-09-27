<template>
  <div class="flex items-center border justify-between border-gray-300 h-12">
    <div class="flex items-center border-2">
      <Button
        class="mx-4"
        type="toggler"
        :state="!category.isOpened ? 'closed' : ''"
      />
      <div>{{ title }}</div>
    </div>
    <div class="flex items-center right-0 -border-2 h-full">
      <img class="mr-2 p-2 border hover:cursor-pointer" :src="edit" />
      <img class="mr-2 p-2 border hover:cursor-pointer" :src="remove" />
      <img class="mr-2 p-2 border hover:cursor-pointer" :src="move" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import edit from '@/assets/svg/edit.svg';
import remove from '@/assets/svg/delete.svg';
import move from '@/assets/svg/move.svg';

export default {
  name: 'AppCategory',
  props: {
    category: {
      type: Object,
      default: null,
    },
  },
  components: {
    Button,
  },

  data() {
    return {
      title: 'Categories',
      edit,
      remove,
      move,
    };
  },

  created() {
    console.log('category: ', this.category.isOpened);
  },
};
</script>
