<template>
  <div class="w-full border border-blue-300 pl-4 mt-6">
    <div>{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'AppParking',
  // props: {
  //   title: String
  // },

  data() {
    return {
      title: 'Parking',
    };
  },
};
</script>
