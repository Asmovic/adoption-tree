<template>
  <div class="row">
    <div class="col-md-9">
      <h4>My Adoptions</h4>
      <vue-table api-url="/adoptions/mineadoptions" :fields="fields">
        <template slot="sn" slot-scope="props">{{
          props.rowIndex + 1
        }}</template>
        <template slot="receipt" slot-scope="props">
          <div
            class="table-button-container"
            v-if="props.rowData.paymentProcessed === 'success'"
          >
            <router-link
              :to="{
                name: 'DonationInfo',
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
          name: "noOfAdoptees",
          title: "Adoptions"
        },
        {
          name: "paymentId",
          title: "Payment ID"
        },
        {
          name: "createdAt",
          title: "Date",
          formatter: date => dayjs(date).format("DD/MM/YYYY"),
          sortField: "createdAt"
        },
        {
          name: "paymentType",
          title: "Payment Method",
          dataClass: "text--capitalize",
          formatter: method => this.getPaymentType(method),
          sortField: "createdAt"
        },
        {
          name: "paymentProcessed",
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
