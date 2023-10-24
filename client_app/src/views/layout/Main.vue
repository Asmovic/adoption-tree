<template>
  <div class="pages__parent flex flex--expand">
    <div class="row flex flex--expand">
      <div class="col-md-2">
        <side-bar>
          <template v-if="loggedInUser.activeRole === 'SITE_ADMIN'">
            <aside style="padding: 0px 10px 10px 25px;" v-if="loaded">
              <span>Enable public profile setting?</span>
              <span class="_space"></span>
              <span class="toggle-container">
                <pretty-check
                  class="p-switch p-fill success"
                  v-model="settingActive"
                  :disabled="loading"
                />
              </span>
            </aside>
          </template>
        </side-bar>
      </div>
      <div class="col-md-10 right-section">
        <div class="pt-3">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SideBar from "@/components/shared/SideBar";

export default {
  components: {
    SideBar
  },
  data() {
    return {
      disableWatch: false,
      id: null,
      loaded: false,
      loading: false,
      settingActive: false,
      settings: {}
    };
  },
  methods: {
    async getSettings() {
      try {
        const { data } = await this.$axios.get(this.apiBaseUrl + "/settings");
        const adminSettings = data.find(x => x.key === "admin_settings") || {};
        this.settings = adminSettings;
        const settingString = adminSettings.value || "{}";
        const setting = JSON.parse(settingString);
        const { allowProfileToggle } = setting;
        this.settingActive = allowProfileToggle || false;
        this.$nextTick(() => {
          this.loaded = true;
        });
      } catch (error) {
        this.handleError(error);
      }
    }
  },
  mounted() {
    this.getSettings();
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    settingActive: {
      immediate: false,
      async handler(newValue, oldValue) {
        if (!this.loaded || !this.settings.id || this.disableWatch === true)
          return;
        const profileSetting = { allowProfileToggle: newValue };
        const updatedSettings = Object.assign(
          JSON.parse(this.settings.value),
          profileSetting
        );
        const data = Object.assign(this.settings, {
          value: JSON.stringify(updatedSettings)
        });
        try {
          await this.$axios.patch(
            this.apiBaseUrl + "/settings/" + this.settings.id,
            data
          );
          this.disableWatch = false;
        } catch (error) {
          this.showGlobalAlert("Setting couldn't be updated.", "error");
          this.disableWatch = true;
          this.settingActive = oldValue;
        }
      }
    }
  },
  created() {
    if (!this.loggedInUser) {
      window.location = "/";
    }
  }
};
</script>

<style lang="scss" scoped>
.right-section {
  padding-bottom: 20px;
  border-top: solid 4px $primary-color;
  border-left: solid 3px $primary-color;
}

.toggle-container {
  display: inline-table;
  vertical-align: middle;
}
</style>
