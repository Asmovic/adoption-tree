<template>
  <div class="row">
    <div class="col-md-12">
      <h3>Edit page</h3>
      <hr />
      <page-component :id="pageId" />
    </div>
  </div>
</template>

<script>
import PageComponent from "./CreateOrEditPage";

export default {
  components: { PageComponent },
  data() {
    return {
      pageId: null
    };
  },
  created() {
    const id = this.$route.params.id;
    if (!id) this.$router.replace("/");
    this.pageId = parseInt(id);
  }
};
</script>
