<template>
  <div class="pages__parent" v-html="pageContent"></div>
</template>

<script>
export default {
  created() {
    this.getPageContent();
  },
  data() {
    return {
      pageContent: null
    };
  },
  methods: {
    async getPageContent() {
      const slug = this.$route.params.slug;
      this.$Progress.start();
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/pages/" + slug
        );
        this.pageContent = this.transformMarkup(data);
      } catch (error) {
        const { message } = this.parseError(error);
        this.showGlobalAlert(message, "error");
      }

      this.$Progress.finish();
    },
    transformMarkup(data) {
      const { content, styles } = data;
      return `
      <style>
        ${styles}
      </style>

      ${content}
    `;
    }
  }
};
</script>
