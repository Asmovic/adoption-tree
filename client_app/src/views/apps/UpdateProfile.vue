<template>
  <div class="row">
    <div class="col-9">
      <h3>
        Update your Information
        <small v-if="biometricId && loggedInUser.activeRole === 'ENROLLEE'"
          >&nbsp;| Staff ID: {{ biometricId }}</small
        >
      </h3>
      <hr />
      <form action @submit.prevent="handleSubmit" class="flex flex--column">
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="adoptees">First Name</label>
            <input
              type="text"
              class="form-control"
              v-model="form.firstName"
              id="firstname"
              placeholder="First Name"
              required
              readonly
            />
          </div>
          <div class="form-group col-md-6">
            <label for="adoptees">Last Name</label>
            <input
              type="text"
              class="form-control"
              v-model="form.lastName"
              id="lastname"
              placeholder="Last Name"
              required
              readonly
            />
          </div>
          <div class="form-group col-md-12">
            <label for="homeaddress">Home Address</label>
            <textarea
              class="form-control"
              id="homeaddress"
              v-model="form.address"
              rows="1"
              required
              readonly
            ></textarea>
          </div>
          <div class="form-group col-md-12">
            <label for="officeaddress">Office Address</label>
            <textarea
              class="form-control"
              id="officeaddress"
              v-model="form.officeAddress"
              rows="1"
              readonly
            ></textarea>
          </div>

          <div class="form-group col-md-6">
            <label for="hphoneno">Home Phone Number</label>
            <input
              type="text"
              class="form-control"
              id="hphoneno"
              v-model="form.phone"
              placeholder="Home Phone Number"
              required
              readonly
            />
          </div>
          <div class="form-group col-md-6">
            <label for="ophoneno">Office Phone Number</label>
            <input
              type="text"
              class="form-control"
              id="ophoneno"
              v-model="form.officePhone"
              placeholder="Office Phone Number"
              readonly
            />
          </div>

          <div class="form-group col-md-6">
            <label for="state">State</label>
            <!-- <select-box name="stateId" v-model="form.stateId" required>
              <option value>State of Origin</option>
              <option disabled
                :value="option.id"
                v-for="(option, index) in states"
                :key="index"
                >{{ option.name }}</option
              >
            </select-box> -->
            <input
              type="text"
              class="form-control"
              v-model="form.stateId"
              placeholder="State"
              readonly
            />
          </div>
          <div class="form-group col-md-6">
            <label for="lga">Local Government Area</label>
            <select-box name="lgaId" v-model="form.lgaId" required>
              <option value disabled>Select LGA of choice</option>
              <option 
                :value="option.id"
                v-for="(option, index) in lgas"
                :key="index"
                :selected="form.lgaId === option.id"
                disabled
                >{{ option.name }}</option
              >
            </select-box>
           
            
          </div>
          <div class="form-group col-md-6">
            <label for="country">Country</label>
            <input
              type="text"
              class="form-control"
              id="country"
              v-model="form.nationality"
              placeholder="Country"
              required
            />
          </div>
          <!-- <div class="form-group col-md-6">
            <template v-if="loadedSettings && settingActive">
              <label>Make profile public?</label>
              <div class="flex flex--items-baseline">
                <input
                  type="checkbox"
                  name="publicProfile"
                  id="publicProfile"
                  v-model="form.publicProfile"
                />
              </div>
            </template>
          </div> -->
          <stretch-loader :show="this.loading || !this.optionsData" />
          <div class="form-group col-md-12">
            <br />
            <!-- <button type="submit" class="btn btn-success">
              {{ buttonText }}
              <i class="fa fa-arrow-right"></i>
            </button> -->
          </div>
        </div>
      </form>
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
  data() {
    return {
      biometricId: null,
      form: {},
      optionsData: {},
      loading: false,
      loadedSettings: false,
      settingActive: false
    };
  },
  computed: {
    buttonText() {
      return this.loading ? "Please wait" : "Update";
    },
    lgas() {
      if (!this.form.stateId) return this.getOptionsData("lgas");
      return this.getOptionsData("lgas").filter(
        (x) => { 
          // console.log(x.stateId === parseInt(this.form.stateId));
          return x.stateId === parseInt(this.form.stateId)
        }
      );
    },
    states() {
      return this.getOptionsData("states");
    }
  },
  created() {
    this.loadRegistrationOptionsData();
    this.getSettings();
    this.getUserInfo();
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        const { data } = await this.$axios.put(
          this.apiBaseUrl + "/users",
          Object.assign({}, this.form)
        );

        this.form = data;
        this.showGlobalAlert("Updated Successfully");
        //TODO: Commit user when props ike activeRole are added to
        // and password is removed from the server response
        // this.$store.commit("setUser", data);
      } catch (error) {
        this.showGlobalAlert(
          "An error occurred. Please try again later.",
          "error"
        );
        this.handleError(error);
      }
      this.loading = false;
    },
    getOptionsData(key) {
      const data = (this.optionsData || {})[key];

      return data || [];
    },
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
          this.loadedSettings = true;
        });
      } catch (error) {
        this.handleError(error);
      }
    },
    async getUserInfo() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(this.apiBaseUrl + "/auth/me");
        const { biometricId } = data;
        this.biometricId = biometricId;

        this.form = data;
      } catch (error) {
        this.handleError(error);
      }

      this.showGlobalPageLoader(false);
    },
    async loadRegistrationOptionsData() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/account/registration-data"
        );
        if (data) {
          this.optionsData = data;
        }
      } catch (error) {
        this.handleError(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* Side Navigation Bar */

.container-body {
  display: flex;
  padding: 10px;
  padding-top: 20px;
  margin: 0;
}

.border-thick {
  border: 1px solid #3a3939;
}
</style>
