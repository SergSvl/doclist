<template>
  <div class="w-full my-2 -border border-green-300 ml-4">
    <div class="w-[50%] relative text-left my-2 -border border-green-300">
      <img class="absolute pt-1.5" :src="searchImage" />
      <input
        ref="input"
        :class="inputStyle"
        placeholder="Поиск"
        :model="value"
        @input="(e) => inputHandler(e.target.value)"
        @change="(e) => changeHandler(e.target.value)"
      />
      <div
        v-if="reset"
        class="absolute right-0 w-[1rem] h-[1rem] p-0 -mt-7 leading-[1rem] font-thin text-3xl text-red-500 hover:cursor-pointer hover:text-red-600 rotate-45 hover:transition-all duration-200 select-none transition-all duration-200"
        title="Сбросить"
        @click="resetHandler"
      >
        +
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import searchImage from '@/assets/svg/search.svg';

export default {
  name: 'AppSearch',
  data() {
    return {
      searchImage,
      value: '',
      reset: false,
      inputStyle: '',
      underlineEmptyStyle:
        'w-full pb-2 pl-6 outline-none text-gray-400 border-b transition-all duration-200',
      underlineFilledStyle:
        'w-full pb-2 pl-6 outline-none text-gray-400 border-b border-blue-400 transition-all duration-200',
    };
  },

  computed: {
    ...mapGetters('documents', ['categories']),
  },

  methods: {
    ...mapActions('documents', ['filterCategories', 'resetFiltration']),

    inputHandler(value) {
      this.reset = !!value;
      value
        ? (this.inputStyle = this.underlineFilledStyle)
        : (this.inputStyle = this.underlineEmptyStyle);
      this.filterCategories({ text: value });
    },

    changeHandler(value) {
      console.log('changeHandler: ', value);
      this.value = value;
      console.log('value: ', this.value);
    },

    resetHandler() {
      this.value = '';
      this.$refs.input.value = '';
      this.reset = false;
      this.resetFiltration();
      this.inputStyle = this.underlineEmptyStyle;
    },
  },

  created() {
    this.inputStyle = this.underlineEmptyStyle;
  },
};
</script>
