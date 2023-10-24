<template>
  <div class="row">
    <div class="col-9">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">My Adoptee Requests</h3>
          <button class="btn btn-primary btn-sm" @click="showRequestModal">New Request</button>
        </header>
        <br />
        <vue-table api-url="/adopters/adoptee-info-requests" :fields="fields">
          <template slot="reason" slot-scope="props">
            <div class="table-button-container">
              <button class="btn btn-sm btn-info" @click="showReason(props.rowData)">View</button>
            </div>
          </template>
        </vue-table>
      </section>
      <popup :size="popupSize" :show="showModal" @close-popup="closeRequestModal">
        <div class="content">
          <h4 for="adoptees">Request Adoptee Information</h4>
          <hr />
          <form action @submit.prevent="requestAdoptee" class="flex flex--column">
            <div class="form-group">
              <textarea
                class="form-control border-thick"
                placeholder="State your reason for request in few words"
                id="adoptees"
                rows="10"
                v-model="reason"
                cols="5"
                :readonly="!modalIsEditable"
              ></textarea>
              <br />
              <button
                class="button button--primary text--no-decoration"
                :disabled="this.reason == '' || loading || !modalIsEditable"
              >
                {{ buttonText }}
                <i class="fa fa-credit-card"></i>
              </button>
            </div>
          </form>
        </div>
      </popup>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import formMixins from "./../../mixins/formMixins";
import Popup from "./../../components/ui/Popup";
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  data() {
    return {
      reason: "",
      requests: [],
      loading: false,
      modalIsEditable: true,
      animate: false,
      fields: [
        {
          name: "createdAt",
          title: "Date",
          formatter: (date) => dayjs(date).format("DD/MM/YYYY"),
          sortField: "createdAt",
        },
        {
          name: "status",
          title: "Status",
          dataClass: "text--capitalize",
          formatter: (status) => {
            const classes = {
              approved: "btn-success",
              pending: "btn-warning",
              rejected: "btn-danger",
            };
            return `<span class='badge badge-pill btn-sm ${
              classes[status.toLowerCase()]
            }'>${status}</span>`;
          },
        },
        {
          name: "reason",
          title: "Reason",
        },
      ],
      showModal: false,
    };
  },
  components: {
    Popup,
    SidebarAds,
  },
  computed: {
    buttonText() {
      return this.loading ? " Please wait " : " Request ";
    },
  },
  methods: {
    closeRequestModal() {
      this.showModal = false;
      this.modalIsEditable = true;
      this.reason = "";
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
    async requestAdoptee() {
      this.loading = true;
      try {
        await this.$axios.post(this.apiBaseUrl + "/adopters/adoptee-info", {
          reason: this.reason,
        });
        this.closeRequestModal();
        this.showGlobalAlert("Submitted Successfully");
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    showReason({ reason }) {
      this.reason = reason;
      this.showRequestModal(false);
    },
    showRequestModal(editable = true) {
      this.modalIsEditable = editable;
      this.showModal = true;
    },
  },
  mixins: [formMixins],
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

.partitionone {
  float: left;
}
.partitiontwo {
  float: right;
  margin-left: 0;
}

.partitiontwo img {
  max-height: 273px;
}
</style>
