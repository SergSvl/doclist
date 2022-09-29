<template>
  <div
    class="w-full h-8 text-xl font-medium flex justify-between -border border-red-300"
  >
    <div>{{ title }}</div>
    <div class="flex">
      <Button type="bookmark" :clickHandler="onBookmark" />
      <Button text="Новый тип" :clickHandler="addNewType" />
      <Button text="Новый документ" :clickHandler="addNewDocument" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import { mapActions } from 'vuex';

export default {
  name: 'AppHeader',
  components: {
    Button,
  },

  data() {
    return {
      title: 'Документы',
    };
  },

  methods: {
    ...mapActions('documents', ['addCategory', 'addElement']),

    onBookmark() {
      //
    },
    addNewType() {
      this.addCategory({ title: 'Новый тип документов' });
    },
    addNewDocument() {
      this.addElement({ title: 'Новый документ' });
    },
  },
};
</script>
