<template>
  <div class="row">
    <div class="col-9">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">All Hospitals</h3>
          <button
            class="btn btn-primary btn-sm flex flex--items-center"
            @click="showHospitalForm"
            :disabled="!lgas.length"
          >
            <span>Add New Hospital</span>&nbsp;&nbsp;&nbsp;
            <div class="_space"></div>
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </header>
        <br />
        <vue-table
          api-url="/hospitals"
          :fields="fields"
          ref="vuetable"
          v-if="lgas.length"
          :key="tableKey"
        >
          <template slot="sn" slot-scope="props">{{
            props.rowIndex + 1
          }}</template>
          <template slot="lgaName" slot-scope="props">{{
            getLgaName(props.rowData.lgaId)
          }}</template>
          <template slot="active" slot-scope="props">
            <ion-icon
              name="checkmark-circle-outline"
              class="text-success"
              style="font-size: 24px"
              v-if="props.rowData.isActive"
            />
            <ion-icon
              name="close-circle"
              class="text-danger"
              style="font-size: 24px"
              v-else
            />
          </template>
          <template slot="action" slot-scope="props">
            <button
              class="btn btn-sm btn-info"
              @click="showHospital(props.rowData)"
            >
              Details
            </button>
          </template>
        </vue-table>
      </section>
      <popup
        :size="popupSize"
        :show="showModal"
        @close-popup="closeHospitalForm"
      >
        <div class="content">
          <h4 for="adoptees">Hospital Information</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.value">
                  <input
                    type="text"
                    name="value"
                    required
                    v-model="hospital.name"
                    placeholder="Name"
                    @click="clearFormError('value')"
                    autocomplete="off"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <select-box required v-model="hospital.lgaId">
                  <option value>Select LGA</option>
                  <option
                    :value="lga.id"
                    v-for="(lga, index) in lgas"
                    :key="index"
                    >{{ lga.name }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row" v-if="hospital.id">
              <div class="col-sm-6">
                <br />
                <p class="flex flex--items-baseline">
                  <span>Active?&nbsp;</span>
                  <span class="_space"></span>
                  <input
                    type="checkbox"
                    name="active"
                    v-model="hospital.isActive"
                  />
                </p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-md-3 offset-md-9">
                <button type="submit" class="button full-width">
                  {{ buttonText }}
                </button>
              </div>
            </div>
          </form>
          <stretch-loader :show="showLoader" />
        </div>
      </popup>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
import Popup from "./../../components/ui/Popup";
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  data() {
    return {
      hospital: {},
      lgas: [],
      lgasObject: {},
      loading: false,
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          name: "name",
          title: "Name"
        },
        {
          name: "lgaName",
          title: "LGA"
        },
        {
          name: "active",
          title: "Active"
        },
        {
          name: "action",
          title: "action"
        }
      ],
      showLoader: false,
      showModal: false,
      tableKey: 0
    };
  },
  components: {
    Popup,
    SidebarAds
  },
  created() {
    this.getLgas();
  },
  computed: {
    buttonText() {
      return this.loading
        ? " Please wait "
        : this.hospital.id
        ? "Update"
        : "Save";
    }
  },
  methods: {
    closeHospitalForm() {
      this.showModal = false;
      this.hospital = {};
    },
    async getLgas() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/form-data/lgas"
        );
        console.log(data);
        data.forEach(lga => {
          this.lgasObject[lga.id] = lga;
        });
        this.lgas = data;
      } catch (error) {
        this.handleError(error);
      }

      this.showGlobalPageLoader(false);
    },
    getLgaName(id) {
      return (this.lgasObject[id] || {}).name;
    },
    handleSubmit() {
      this.hospital.id ? this.updateHospital() : this.addHospital();
    },
    async addHospital() {
      this.loading = true;
      try {
        await this.$axios.post(
          this.apiBaseUrl + "/hospitals",
          Object.assign({}, this.hospital)
        );
        this.closeHospitalForm();
        this.showGlobalAlert("Added Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    async showHospital(hospital) {
      this.hospital = Object.assign({}, hospital);
      this.showHospitalForm(true);
    },
    showHospitalForm() {
      this.showModal = true;
    },
    async updateHospital() {
      this.loading = true;
      try {
        await this.$axios.patch(
          this.apiBaseUrl + `/hospitals/${this.hospital.id}`,
          Object.assign({}, this.hospital)
        );
        this.closeHospitalForm();
        this.showGlobalAlert("Updated Successfully");
        this.$refs.vuetable.reload();
        this.tableKey += 1;
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    }
  },
  mixins: [formMixins]
};
</script>
