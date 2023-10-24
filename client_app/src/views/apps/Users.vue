<template>
  <div class="row">
    <div class="col-md-9">
      <header class="flex justify--space-between flex--items-flex-end">
        <h3 class="mb-0" style="line-height: 1">All Users</h3>
        <button
          class="btn btn-primary btn-sm flex flex--items-center"
          @click="showModal = true"
        >
          <span>Add New Admin User</span>&nbsp;&nbsp;&nbsp;
          <div class="_space"></div>
          <ion-icon name="add-circle"></ion-icon>
        </button>
      </header>
      <hr />
      <vue-table api-url="/users?type=admin" :fields="fields" ref="vuetable">
        <template slot="sn" slot-scope="props">
          {{ props.rowIndex + 1 }}
        </template>
        <template slot="name" slot-scope="props">{{
          `${props.rowData.firstName} ${props.rowData.lastName}`
        }}</template>
        <template slot="action" slot-scope="props">
          <button class="btn btn-sm btn-info" @click="showUser(props.rowData)">
            View Details
          </button>
        </template>
      </vue-table>
    </div>
    <popup :size="popupSize" :show="showModal" @close-popup="closeForm">
      <div class="content">
        <h4 for="adoptees">User Information</h4>
        <hr />
        <form action @submit.prevent="handleSubmit" class="flex flex--column">
          <div class="row">
            <div class="col-md-6">
              <label for="type">First Name</label>
              <input-group :error="formErrors.firstName">
                <input
                  type="text"
                  name="firstName"
                  required
                  v-model="user.firstName"
                  placeholder="First name"
                  @click="clearFormError('firstName')"
                />
              </input-group>
            </div>
            <div class="col-md-6">
              <label for="type">Last Name</label>
              <input-group :error="formErrors.lastName">
                <input
                  type="text"
                  name="lastName"
                  required
                  v-model="user.lastName"
                  placeholder="Last name"
                  @click="clearFormError('lastName')"
                />
              </input-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="type">Middle Name</label>
              <input-group :error="formErrors.middleName">
                <input
                  type="text"
                  name="middleName"
                  required
                  v-model="user.middleName"
                  placeholder="Middle name"
                  @click="clearFormError('middleName')"
                />
              </input-group>
            </div>
            <div class="col-md-6">
              <label for="type">Email Address</label>
              <input-group :error="formErrors.email">
                <input
                  type="email"
                  name="email"
                  required
                  v-model="user.email"
                  placeholder="Email Address"
                  @click="clearFormError('email')"
                />
              </input-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="type">Phone Number</label>
              <input-group :error="formErrors.phone">
                <input
                  type="tel"
                  name="phone"
                  required
                  v-model="user.phone"
                  placeholder="Phone Number"
                  @click="clearFormError('phone')"
                />
              </input-group>
            </div>
            <div class="col-md-6">
              <label for="type">Gender</label>
              <select-box required v-model="user.gender">
                <option value>Select Gender</option>
                <option
                  :value="gender.id"
                  v-for="(gender, index) in genders"
                  :key="index"
                  >{{ gender.name }}</option
                >
              </select-box>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label for="type">Select role</label>
              <select-box required v-model="user.role">
                <option value disabled>Select Role</option>
                <option
                  :value="role.name"
                  v-for="(role, index) in userRoles"
                  :key="index"
                  :selected="role.name === getUserRole()"
                  >{{ role.displayName }}</option
                >
              </select-box>
            </div>
            <div class="col-sm-6">
              <template v-if="showHospitalSelection">
                <label for="type">Select Hospital</label>
                <select-box required v-model="user.hospitalId">
                  <option value>Select Hospital</option>
                  <option
                    :value="hospital.id"
                    v-for="(hospital, index) in hospitals"
                    :key="index"
                    :selected="hospital.id === user.hospitalId"
                    >{{ hospital.name }}</option
                  >
                </select-box>
              </template>
            </div>
          </div>
          <div class="row" v-if="user.id">
            <div class="col-sm-6">
              <br />
              <p class="flex flex--items-baseline">
                <span>Active?&nbsp;</span>
                <span class="_space"></span>
                <input type="checkbox" name="active" v-model="user.active" />
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
  components: {
    Popup,
    SidebarAds
  },
  computed: {
    buttonText() {
      return this.loading ? " Please wait " : this.user.id ? "Update" : "Save";
    },
    showHospitalSelection() {
      return this.user.role == "HOSPITAL_ADMIN";
    }
  },
  created() {
    this.getHospitals();
  },
  data() {
    return {
      adoptions: [],
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
          name: "email",
          title: "Email"
        },
        {
          name: "phone",
          title: "Phone"
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
      hospitals: [],
      showLoader: false,
      showModal: false,
      user: {},
      userRoles: [
        { name: "SITE_ADMIN", displayName: "Admin" },
        { name: "HOSPITAL_ADMIN", displayName: "Hospital Admin" }
      ]
    };
  },
  methods: {
    closeForm() {
      this.user = {};
      this.showModal = false;
    },
    async getHospitals() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(this.apiBaseUrl + "/hospitals");
        this.hospitals = data.data;
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    },
    getUserRole() {
      const roles = this.user.roles || "[]";
      return JSON.parse(roles)[0];
    },
    handleSubmit() {
      this.user.id ? this.updateUser() : this.addUser();
    },
    async addUser() {
      this.loading = true;
      try {
        await this.$axios.post(
          this.apiBaseUrl + "/users/admin",
          Object.assign({}, this.user)
        );
        this.closeForm();
        this.showGlobalAlert("Added Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    async updateUser() {
      this.loading = true;
      try {
        await this.$axios.patch(
          this.apiBaseUrl + `/users/${this.user.id}`,
          Object.assign({}, this.user)
        );
        this.closeForm();
        this.showGlobalAlert("Updated Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    showUser(user) {
      this.user = user;
      this.showModal = true;
    }
  },
  mixins: [formMixins]
};
</script>
