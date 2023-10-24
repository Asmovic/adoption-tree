<template>
  <div class="row">
    <div class="col-md-12">
      <section class="adoption-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">
            Adoptee Information Requests
          </h3>
        </header>
        <br />
        <div class="table-filters flex">
          <div class="date-filters flex">
            <div class="flex flex--items-center">
              <strong class="full-width">Start Date &nbsp;</strong>
              <div class="_space"></div>
              <input
                type="date"
                name="startDate"
                id="startDate"
                class="form-control"
                v-model="filters.startDate"
              />
            </div>
            <div class="_space"></div>
            <div class="_space"></div>
            <div class="_space"></div>
            <div class="flex flex--items-center">
              <strong class="full-width">End Date</strong>
              <div class="_space"></div>
              <input
                type="date"
                name="endDate"
                id="endDate"
                class="form-control"
                v-model="filters.endDate"
              />
            </div>
          </div>
        </div>
        <vue-table :api-url="apiUrl_" :fields="fields" ref="vuetable">
          <template slot="sn" slot-scope="props">{{
            props.rowIndex + 1
          }}</template>
          <template slot="status" slot-scope="props">
            <span
              class="badge badge-pill badge-warning"
              v-if="props.rowData.status === 'pending'"
            >
              Pending
            </span>
            <span
              class="badge badge-pill badge-success"
              v-else-if="props.rowData.status === 'approved'"
            >
              Approved
            </span>
            <span class="badge badge-pill badge-danger" v-else>
              Rejected
            </span>
          </template>
          <template slot="action" slot-scope="props">
            <button
              class="btn btn-sm btn-info"
              @click="showInfo(props.rowData)"
            >
              Details
            </button>
          </template>
        </vue-table>
      </section>
      <popup size="md" :show="showModal" @close-popup="closeInfoForm">
        <div class="content">
          <h4 for="adoptees">Info Information</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-12">
                <label for="reason">Reason</label>
                <input-group :error="formErrors.reason">
                  <textarea
                    name="reason"
                    required
                    class="form-control"
                    v-model="info.reason"
                    placeholder="Reason for request"
                    @click="clearFormError('reason')"
                  ></textarea>
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <label for="status">Update status</label>
                <select-box
                  required
                  v-model="info.status"
                  name="status"
                  className="form-control text--capitalize"
                >
                  <option
                    :value="status"
                    v-for="(status, index) in statuses"
                    :key="index"
                    :selected="status === info.status"
                    >{{ status }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row" v-if="info.status === 'rejected'">
              <div class="col-md-12">
                <label for="comment">Comment</label>
                <input-group :error="formErrors.comment">
                  <textarea
                    name="reason"
                    required
                    class="form-control"
                    v-model="info.comment"
                    placeholder="Comment"
                    @click="clearFormError('comment')"
                  ></textarea>
                </input-group>
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
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
import Popup from "./../../components/ui/Popup";
export default {
  computed: {
    apiUrl_() {
      const url = "/adoptee-info";
      return this.addFiltersToUrl(url, [
        { name: "startDate", value: this.filters.startDate },
        { name: "endDate", value: this.filters.endDate }
      ]);
    },
    buttonText() {
      return this.loading ? " Please wait " : "Update Status";
    }
  },
  data() {
    return {
      filters: {},
      info: {},
      loading: false,
      requests: [],
      statuses: ["pending", "approved", "rejected"],
      animate: false,
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          name: "user",
          title: "User"
        },
        {
          name: "status"
        },
        {
          name: "createdAt",
          title: "Date",
          formatter: date => this.$dayjs(date).format("DD/MM/YYYY")
        },
        {
          name: "action",
          title: "action"
        }
      ],
      showLoader: false,
      showModal: false
    };
  },
  components: {
    Popup
  },
  methods: {
    closeInfoForm() {
      this.showModal = false;
      this.info = {};
    },
    async handleSubmit() {
      this.loading = true;
      const payload = { status: this.info.status };
      try {
        await this.$axios.patch(
          this.apiBaseUrl + `/adoptee-info/${this.info.id}/change-status`,
          payload
        );
        this.closeInfoForm();
        this.showGlobalAlert("Updated Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        const { message } = this.parseError(error);
        this.showGlobalAlert(message, "error");
      }
      this.loading = false;
    },
    async showInfo(info) {
      this.info = Object.assign({}, info);
      this.showModal = true;
    }
  },
  mixins: [formMixins]
};
</script>
