<template>
  <div class="row">
    <div class="col-md-12">
      <header class="flex justify--space-between flex--items-flex-end">
        <h3 class="mb-0" style="line-height: 1">Payments</h3>
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
          <div class="_space"></div>
          <div class="_space"></div>
          <div class="_space"></div>
          <div class="flex flex--items-center">
            <strong>Status</strong>
            <div class="_space"></div>
            <select-box
              v-model="filters.status"
              className="form-control text--capitalize"
            >
              <option value selected disabled>Filter by</option>
              <option value>All</option>
              <option
                :value="status"
                v-for="(status, index) in statuses"
                :key="index"
                class="text--capitalize"
              >
                {{ status }}
              </option>
            </select-box>
          </div>
        </div>
      </div>
      <vue-table :api-url="apiUrl_" :fields="fields">
        <template slot="sn" slot-scope="props">
          {{ parseInt(props.rowIndex) + 1 }}
        </template>
        <template slot="status" slot-scope="props">
          <span>
            <button
              class="btn btn-sm btn-success"
              v-if="props.rowData.status.toLowerCase() === 'success'"
            >
              {{ props.rowData.status }}
            </button>
            <button
              class="btn btn-sm btn-warning"
              v-else-if="props.rowData.status.toLowerCase() === 'pending'"
            >
              {{ props.rowData.status }}
            </button>
            <button class="btn btn-sm btn-danger" v-else>
              {{ props.rowData.status }}
            </button>
          </span>
        </template>
        <template slot="action" slot-scope="props">
          <router-link
            :to="{
              name: 'PatientInfo',
              params: { id: props.rowData.id },
            }"
            tag="button"
            class="btn btn-sm btn-info"
            >View Details</router-link
          >
        </template>
      </vue-table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    apiUrl_() {
      const url = "/payments";
      return this.addFiltersToUrl(url, [
        { name: "startDate", value: this.filters.startDate },
        { name: "endDate", value: this.filters.endDate },
        { name: "status", value: this.filters.status },
      ]);
    },
  },
  data() {
    return {
      fields: [
        {
          name: "sn",
          title: "S/N",
        },
        {
          name: "amount",
          title: "Amount",
          formatter: (amount) => this.getFormattedAmount(amount),
        },
        {
          name: "paymentDate",
          title: "Payment Date",
          formatter: (date) => this.$dayjs(date).format("DD/MM/YYYY"),
        },
        {
          name: "channel",
          title: "Channel",
          dataClass: "text--capitalize",
        },
        {
          name: "gateway",
          dataClass: "text--capitalize",
        },
        {
          name: "reference",
          dataClass: "text--capitalize",
        },
        {
          name: "status",
          title: "Payment Status",
          dataClass: "text--capitalize text--center",
          sortField: "status",
        },
      ],
      statuses: ["success", "failed", "pending"],
    };
  },
  methods: {
    getPaymentType(type) {
      return type.replace(/_/g, " ");
    },
  },
};
</script>
