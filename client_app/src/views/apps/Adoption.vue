<template>
  <div class="row">
    <div class="col-md-9">
      <div class="rowBorder flex flex--items-center justify--center full-height">
        <button
          class="button button--primary text--no-decoration"
          @click="showGlobalForm('adoption')"
        >
          Adopt Now
          <i class="fa fa-credit-card"></i>
        </button>
      </div>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  components: {
    SidebarAds
  },
  mounted() {
    const { showDialog } = this.$route.query;
    if (showDialog) this.showGlobalForm("adoption");
  }
};
</script>

<style lang="scss" scoped>
.rowBorder {
  border: 2px solid #69be0f;
  border-radius: 10px;
  opacity: 1;
}
</style>
