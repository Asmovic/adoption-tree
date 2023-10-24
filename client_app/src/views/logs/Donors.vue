<template>
  <div class="row">
    <div class="col-md-12">
      <header class="flex justify--space-between flex--items-flex-end">
        <h3 class="mb-0" style="line-height: 1">Adopters</h3>
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
            <strong>LGA</strong>
            <div class="_space"></div>
            <select-box v-model="filters.lgaId" className="form-control">
              <option value selected disabled>Filter by </option>
              <option value>All</option>
              <option
                :value="lga.id"
                v-for="(lga, index) in lgas"
                :key="index"
                >{{ lga.name }}</option
              >
            </select-box>
          </div>
        </div>
      </div>
      <vue-table
        :api-url="apiUrl_"
        :fields="fields"
        :query-params="queryParams"
        ref="vuetable"
      >
        <template slot="sn" slot-scope="props">
          {{ parseInt(props.rowIndex) + 1 }}
        </template>
        <template slot="name" slot-scope="props">
          {{ props.rowData.firstName }} {{ props.rowData.lastName }}
        </template>
      </vue-table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    apiUrl_() {
      const url = "/adopters";
      return this.addFiltersToUrl(url, [
        { name: "startDate", value: this.filters.startDate },
        { name: "endDate", value: this.filters.endDate },
        { name: "lgaId", value: this.filters.lgaId }
      ]);
    }
  },
  created() {
    this.getLGAs();
  },
  data() {
    return {
      fields: [
        {
          name: "sn",
          title: "S/N"
        },
        {
          name: "name",
          title: "Adopter"
        },
        {
          name: "email",
          title: "Email"
        },
        {
          name: "phone",
          title: "Phone no."
        },
        {
          name: "gender",
          dataClass: "text--capitalize"
        },
        {
          name: "createdAt",
          title: "Joined",
          formatter: date => this.$dayjs(date).format("DD/MM/YYYY")
        }
      ],
      filters: {},
      lgas: [],
      queryParams: {}
    };
  },
  methods: {
    async getLGAs() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/form-data/lgas"
        );
        console.log(data);
        this.lgas = data;
      } catch (error) {
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    }
  }
};
</script>
