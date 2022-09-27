<template>
  <div
    class="w-full h-8 text-xl font-medium flex justify-between -border border-red-300"
  >
    <div>{{ title }}</div>
    <div class="flex">
      <Button type="bookmark" />
      <Button text="Новый тип" />
      <Button text="Новый документ" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'AppHeader',
  // props: {
  //   title: String
  // },
  components: {
    Button,
  },

  data() {
    return {
      title: 'Документы',
    };
  },
};
</script>
