<template>
  <div class="row">
    <div class="col-9">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">All Doctors</h3>
          <button class="btn btn-primary btn-sm flex flex--items-center" @click="showDoctorForm">
            <span>Add New Doctor</span>&nbsp;&nbsp;&nbsp;
            <div class="_space"></div>
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </header>
        <br />
        <vue-table api-url="/doctors" :fields="fields" ref="vuetable">
          <template slot="sn" slot-scope="props">{{ props.rowIndex + 1 }}</template>
          <template
            slot="name"
            slot-scope="props"
          >{{ `${props.rowData.firstName} ${props.rowData.lastName}` }}</template>
          <template slot="action" slot-scope="props">
            <button class="btn btn-sm btn-info" @click="showDoctor(props.rowData)">Details</button>
          </template>
        </vue-table>
      </section>
      <popup :size="popupSize" :show="showModal" @close-popup="closeDoctorForm">
        <div class="content">
          <h4 for="adoptees">Doctor Information</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.firstName">
                  <input
                    type="text"
                    name="firstName"
                    required
                    v-model="doctor.firstName"
                    placeholder="First name"
                    @click="clearFormError('firstName')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <input-group :error="formErrors.lastName">
                  <input
                    type="text"
                    name="lastName"
                    required
                    v-model="doctor.lastName"
                    placeholder="Last name"
                    @click="clearFormError('lastName')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.middleName">
                  <input
                    type="text"
                    name="middleName"
                    required
                    v-model="doctor.middleName"
                    placeholder="Middle name"
                    @click="clearFormError('middleName')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <input-group :error="formErrors.email">
                  <input
                    type="email"
                    name="email"
                    required
                    v-model="doctor.email"
                    placeholder="Email Address"
                    @click="clearFormError('email')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.phone">
                  <input
                    type="tel"
                    name="phone"
                    required
                    v-model="doctor.phone"
                    placeholder="Phone Number"
                    @click="clearFormError('phone')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <select-box required v-model="doctor.gender">
                  <option value>Select Gender</option>
                  <option
                    :value="gender.id"
                    v-for="(gender, index) in genders"
                    :key="index"
                  >{{ gender.name }}</option>
                </select-box>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.idNumber">
                  <input
                    type="text"
                    name="idNumber"
                    required
                    v-model="doctor.idNumber"
                    placeholder="ID Number"
                    @click="clearFormError('idNumber')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <select-box required v-model="doctor.departmentId">
                  <option value>Select Department</option>
                  <option
                    :value="department.id"
                    v-for="(department, index) in departments"
                    :key="index"
                    :selected="department.id === doctor.departmentId"
                  >{{ department.name }}</option>
                </select-box>
              </div>
            </div>
            <div class="row" v-if="doctor.id">
              <div class="col-sm-6">
                <br />
                <p class="flex flex--items-baseline">
                  <span>Active?&nbsp;</span>
                  <span class="_space"></span>
                  <input type="checkbox" name="active" v-model="doctor.active" />
                </p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-md-3 offset-md-9">
                <button type="submit" class="button full-width">{{ buttonText }}</button>
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
      departments: [],
      doctor: {},
      requests: [],
      loading: false,
      modalIsEditable: true,
      animate: false,
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
          name: "idNumber",
          title: "ID no."
        },
        {
          name: "department",
          title: "Department"
        },
        {
          name: "action",
          title: "action"
        }
      ],
      genders: [
        { id: "male", name: "Male" },
        { id: "female", name: "Female" },
        { id: "unspecified", name: "Unspecified" }
      ],
      showLoader: false,
      showModal: false
    };
  },
  components: {
    Popup,
    SidebarAds
  },
  computed: {
    buttonText() {
      return this.loading
        ? " Please wait "
        : this.doctor.id
        ? "Update"
        : "Save";
    }
  },
  methods: {
    closeDoctorForm() {
      this.showModal = false;
      this.modalIsEditable = true;
      this.doctor = {};
    },
    async getAdoptionRequests() {
      this.showGlobalPageLoader(true);

      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/adopters/adoptee-info-requests"
        );

        this.requests = data.data;

        console.log(data);
      } catch (error) {
        this.handleError(error);
      }

      this.showGlobalPageLoader(false);
    },
    async getDepartments() {
      this.showLoader = true;
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/form-data/doctor-registration-data"
        );
        this.departments = data;
        // this.hospitals = data.hospitals;
      } catch (error) {
        this.handleError(error);
      }

      this.showLoader = false;
    },
    handleSubmit() {
      this.doctor.id ? this.updateDoctor() : this.addDoctor();
    },
    async addDoctor() {
      this.loading = true;
      try {
        await this.$axios.post(
          this.apiBaseUrl + "/doctors",
          Object.assign({}, this.doctor)
        );
        this.closeDoctorForm();
        this.showGlobalAlert("Added Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    async showDoctor(doctor) {
      this.doctor = Object.assign({}, doctor);
      this.showDoctorForm(true);
    },
    async showDoctorForm(editable = true) {
      this.modalIsEditable = editable;
      this.showModal = true;

      if (!this.departments.length) {
        this.getDepartments();
      }
    },
    async updateDoctor() {
      this.loading = true;
      try {
        await this.$axios.patch(
          this.apiBaseUrl + `/doctors/${this.doctor.id}`,
          Object.assign({}, this.doctor)
        );
        this.closeDoctorForm();
        this.showGlobalAlert("Updated Successfully");
        this.$refs.vuetable.reload();
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
