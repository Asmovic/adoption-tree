<template>
  <div class="row">
    <div class="col-md-12">
      <header class="flex justify--space-between flex--items-flex-end">
        <h3 class="mb-0" style="line-height: 1">Subscriptions</h3>
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
      <vue-table :api-url="apiUrl_" :fields="fields">
        <template slot="sn" slot-scope="props">
          {{ parseInt(props.rowIndex) + 1 }}
        </template>
      </vue-table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    apiUrl_() {
      const url = "/subscriptions";
      return this.addFiltersToUrl(url, [
        { name: "startDate", value: this.filters.startDate },
        { name: "endDate", value: this.filters.endDate }
      ]);
    }
  },
  data() {
    return {
      fields: [
        {
          name: "sn",
          title: "S/N"
        },
        {
          name: "user",
          title: "Adopter"
        },
        {
          name: "amount",
          title: "Amount",
          formatter: amount => this.getFormattedAmount(amount)
        },
        {
          name: "startDate",
          title: "Start Date",
          formatter: date => this.$dayjs(date).format("DD/MM/YYYY")
        },
        {
          name: "durationType",
          title: "Interval",
          dataClass: "text--capitalize"
        }
      ]
    };
  }
};
</script>
