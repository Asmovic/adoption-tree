<template>
  <div class="row">
    <div class="col-md-9">
      <adoption-details v-if="adoptionData" :data="adoptionData">
        <template slot="close">
          <button class="button button--striped" type="button" @click="$router.go(-1)">Close</button>
        </template>
      </adoption-details>
    </div>
    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import SidebarAds from "./../../components/shared/Sidebar_Ads";
import AdoptionDetails from "./../../components/ui/AdoptionDetails";
export default {
  components: {
    AdoptionDetails,
    SidebarAds
  },
  created() {
    this.getAdoptionInfo();
  },
  data() {
    return {
      adoptionData: null
    };
  },
  methods: {
    async getAdoptionInfo() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + `/adoptions/${this.$route.params.id}`
        );
        this.adoptionData = data;
      } catch (error) {
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    }
  }
};
</script>
