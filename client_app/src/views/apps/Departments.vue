<template>
  <div class="row">
    <div class="col-9">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">All Departments</h3>
          <button class="btn btn-primary btn-sm flex flex--items-center" @click="showDeptForm">
            <span>Add New Department</span>&nbsp;&nbsp;&nbsp;
            <div class="_space"></div>
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </header>
        <br />
        <!-- <vue-table api-url="/form-data/doctor-registration-data" :fields="fields" ref="vuetable">
          <template slot="name" slot-scope="props">{{ `${props.rowData.name}` }}</template>
        </vue-table>-->
        <table class="vuetable table table-hover table-bordered fixed">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
            </tr>
          </thead>
          <template v-for="(item,index) in departments">
            <tr :key="item.id">
              <td>{{index+1}}</td>
              <td>{{ item.name }}</td>
            </tr>
            <!-- <tr v-if="opened.includes(item.id)" :key="item.id">
              <td colspan="3">{{item.note}}</td>
            </tr>-->
          </template>
        </table>
      </section>
      <popup :size="popupSize" :show="showModal" @close-popup="closeDoctorForm">
        <div class="content">
          <h4 for="adoptees">Department Information</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-12">
                <input-group :error="formErrors.firstName">
                  <input
                    type="text"
                    name="name"
                    required
                    v-model="department.name"
                    placeholder="Department name"
                    @click="clearFormError('name')"
                  />
                </input-group>
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
      department: {},
      requests: [],
      loading: false,
      modalIsEditable: true,
      animate: false,
      fields: [
        {
          name: "name",
          title: "Name"
        }
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
  created() {
    this.getDepartments();
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
        console.log("Departments: ", this.departments);
      } catch (error) {
        this.handleError(error);
      }

      this.showLoader = false;
    },
    handleSubmit() {
      this.department.id ? this.updateDoctor() : this.addDepartment();
    },
    async addDepartment() {
      this.loading = true;
      try {
        await this.$axios.post(
          this.apiBaseUrl + "/form-data/hospital-department-add",
          Object.assign({}, this.department)
        );
        this.closeDoctorForm();
        this.showGlobalAlert("Added Successfully");
        this.department = {};
        //this.$refs.vuetable.reload();
        this.getDepartments();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    async showDoctor(doctor) {
      this.doctor = Object.assign({}, doctor);
      this.showDeptForm(true);
    },
    async showDeptForm(editable = true) {
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
