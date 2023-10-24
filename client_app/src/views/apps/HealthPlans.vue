<template>
  <div class="row">
    <div class="col-md-12">
      <header class="flex justify--space-between flex--items-flex-end">
        <h3 class="mb-0">Health Plans</h3>
        <button
          class="btn btn-primary btn-sm flex flex--items-center"
          @click="showPlan = true"
        >
          <span>Add New Plan</span>&nbsp;&nbsp;&nbsp;
          <div class="_space"></div>
          <ion-icon name="add-circle"></ion-icon>
        </button>
      </header>
      <hr />
      <table class="table table-bordered table-striped" v-if="renderTable">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Type</th>
            <th>One-time (N)</th>
            <th>Weekly (N)</th>
            <th>Monthly (N)</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plan, index) in healthPlans" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="text--capitalize">{{ plan.type }}</td>
            <td>{{ getFormattedAmount(plan.onetimeAmount) }}</td>
            <td>{{ getFormattedAmount(plan.weeklyAmount) }}</td>
            <td>{{ getFormattedAmount(plan.monthlyAmount) }}</td>
            <td>
              <ion-icon
                name="checkmark-circle-outline"
                class="text-success"
                style="font-size: 24px"
                v-if="plan.isActive"
              />
              <ion-icon
                name="close-circle"
                class="text-danger"
                style="font-size: 24px"
                v-else
              />
            </td>
            <td>
              <button class="btn btn-info btn-sm" @click="viewPlan(plan)">
                View Plan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <popup :size="popupSize" :show="showPlan" @close-popup="closeForm">
        <div class="content">
          <h4 for="adoptees">Plan Information</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-6">
                <label for="type">Plan Type</label>
                <input-group :error="formErrors.type">
                  <input
                    type="text"
                    name="type"
                    required
                    v-model="healthPlan.type"
                    placeholder="Type"
                    @click="clearFormError('type')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <label for="onetimeAmount">One-time Amount (N)</label>
                <input-group :error="formErrors.onetimeAmount">
                  <input
                    type="number"
                    name="onetimeAmount"
                    required
                    v-model="healthPlan.onetimeAmount"
                    placeholder="One-time Amount (N)"
                    @click="clearFormError('onetimeAmount')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="weeklyAmount">Weekly Amount (N)</label>
                <input-group :error="formErrors.weeklyAmount">
                  <input
                    type="number"
                    name="weeklyAmount"
                    required
                    v-model="healthPlan.weeklyAmount"
                    placeholder="Weekly Amount (N)"
                    @click="clearFormError('weeklyAmount')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <label for="monthlyAmount">Monthly Amount (N)</label>
                <input-group :error="formErrors.monthlyAmount">
                  <input
                    type="number"
                    name="monthlyAmount"
                    required
                    v-model="healthPlan.monthlyAmount"
                    placeholder="Monthly Amount (N)"
                    @click="clearFormError('monthlyAmount')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row" v-if="healthPlan.id">
              <div class="col-sm-6">
                <br />
                <span class="flex flex--items-baseline">
                  <span>Active?&nbsp;</span>
                  <span class="_space"></span>
                  <input
                    type="checkbox"
                    name="isActive"
                    v-model="healthPlan.isActive"
                  />
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-md-3 offset-md-9">
                <button type="submit" class="button full-width">
                  {{ buttonText }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
import Popup from "./../../components/ui/Popup";
export default {
  components: {
    Popup
  },
  computed: {
    buttonText() {
      return this.loading
        ? " Please wait "
        : this.healthPlan.id
        ? "Update"
        : "Save";
    }
  },
  created() {
    this.getPlans();
  },
  data() {
    return {
      healthPlan: {},
      healthPlans: [],
      showLoader: false,
      showPlan: false,
      renderTable: true
    };
  },
  methods: {
    async addHealthPlan() {
      this.loading = true;
      try {
        const { data } = await this.$axios.post(
          this.apiBaseUrl + "/health-plans",
          Object.assign({}, this.healthPlan)
        );
        this.closeForm();
        this.showGlobalAlert("Added Successfully");
        this.healthPlans.push(data);
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    closeForm() {
      this.showPlan = false;
      this.healthPlan = {};
    },
    async getPlans() {
      this.showGlobalPageLoader(true);

      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/health-plans"
        );
        this.healthPlans = data;
      } catch (error) {
        this.handleError(error);
      }

      this.showGlobalPageLoader(false);
    },
    handleSubmit() {
      this.healthPlan.id ? this.updateHealthPlan() : this.addHealthPlan();
    },
    async updateHealthPlan() {
      this.loading = true;
      try {
        const { data } = await this.$axios.patch(
          this.apiBaseUrl + `/health-plans/${this.healthPlan.id}`,
          Object.assign({}, this.healthPlan)
        );
        this.closeForm();
        this.showGlobalAlert("Updated Successfully");
        const index = this.healthPlans.findIndex(x => x.id === data.id);
        console.log("index", index);
        this.$set(this.healthPlans, index, data);
        this.renderTable = false;
        setTimeout(() => {
          this.renderTable = true;
        }, 50);
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    viewPlan(plan) {
      this.healthPlan = Object.assign({}, plan);
      this.showPlan = true;
    }
  },
  mixins: [formMixins]
};
</script>
