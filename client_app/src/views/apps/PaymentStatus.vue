<template>
  <div class="row">
    <div class="col-md-9">
      <h4>My payment statement</h4>
      <vue-table api-url="/adoptions/mine" :fields="fields">
        <template slot="sn" slot-scope="props">{{
          props.rowIndex + 1
        }}</template>
        <template slot="receipt" slot-scope="props">
          <div
            class="table-button-container"
            v-if="props.rowData.status === 'success'"
          >
            <router-link
              :to="{
                name: 'AdoptionInfo',
                params: { id: props.rowData.id }
              }"
              tag="button"
              class="btn btn-sm btn-info"
              >View Receipt</router-link
            >
          </div>
        </template>
      </vue-table>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  components: {
    SidebarAds
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
          name: "id",
          title: "Payment ID"
        },
        {
          name: "createdAt",
          title: "Date",
          formatter: date => dayjs(date).format("DD/MM/YYYY HH:mm"),
          sortField: "createdAt"
        },
        {
          name: "channel",
          title: "Payment Method",
          dataClass: "text--capitalize",
          formatter: method => this.getPaymentType(method),
          sortField: "createdAt"
        },
        {
          name: "amount",
          title: "Amount",
          formatter: method => this.getFormattedAmount(method),
          sortField: "createdAt"
        },
        {
          name: "status",
          title: "Status",
          dataClass: "text--capitalize",
          formatter: status => {
            const classes = {
              success: "btn-success",
              pending: "btn-warning",
              failed: "btn-danger"
            };
            return `<span class='badge badge-pill btn-sm ${
              classes[status.toLowerCase()]
            }'>${status}</span>`;
          }
        },

        {
          name: "receipt",
          title: "Actions"
        }
      ]
    };
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
    getPaymentType(type) {
      return type.replace(/_/g, " ");
    }
  }
};
</script>
