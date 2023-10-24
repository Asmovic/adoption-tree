<template>
  <div class="detail-row">{{ content }}</div>
</template>

<script>
import mixin from "./mixin";
export default {
  computed: {
    content() {
      const { fieldToDisplay } = this.options;

      return fieldToDisplay ? this.rowData[fieldToDisplay] : this.rowData;
    }
  },
  mixins: [mixin]
};
</script>
