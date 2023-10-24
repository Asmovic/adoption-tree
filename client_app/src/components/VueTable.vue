<template>
  <section>
    <template v-if="showExportButton">
      <div class="flex justify--end">
        <button
          class="button btn-sm"
          :disabled="!exportUrl"
          @click="exportFile"
        >
          Export
        </button>
      </div>
      <hr />
    </template>
    <vuetable
      ref="vuetable"
      :api-url="generatedApiUrl"
      v-bind="$attrs"
      :http-fetch="fetch"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:loading="onLoading"
      @vuetable:loaded="onLoaded"
      :transform="transform"
      :detail-row-component="detailRowComponent"
      detail-row-transition="row-visible"
      :css="{ tableClass: 'table table-hover table-bordered' }"
      :detailRowOptions="{ fieldToDisplay: detailRowField }"
      :query-params="queryParams_"
      @vuetable:load-error="handleError"
    >
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </vuetable>
    <vuetable-pagination
      ref="pagination"
      @vuetable-pagination:change-page="onChangePage"
    />
    <stretch-loader :show="loading" />
  </section>
</template>

<script>
import Vuetable from "vuetable-2";
import { VuetablePagination } from "vuetable-2";
export default {
  components: { Vuetable, VuetablePagination },
  computed: {
    generatedApiUrl() {
      return this.$appConfig.apiBaseUrl + this.apiUrl;
    },
    queryParams_() {
      return Object.assign(
        { perPage: "perPage", page: "page", sort: "sort" },
        this.queryParams
      );
    }
  },
  data() {
    return {
      exportUrl: null,
      loading: false,
      pagination: {}
    };
  },
  inheritAttrs: false,
  methods: {
    async exportFile() {
      this.loading = true;

      try {
        await this.$axios.get(this.exportUrl);
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    },
    async fetch(apiUrl, httpOptions) {
      try {
        this.loading = true;
        const request = await this.$axios.get(apiUrl, httpOptions);
        const { _responseUrl, pagination = {} } = request;
        this.exportUrl = `${_responseUrl}&download=true`;
        this.pagination = pagination;
        return Promise.resolve(request);
      } catch (error) {
        this.handleError(error);
        this.exportUrl = null;
        return Promise.reject(error);
      } finally {
        this.loading = false;
      }
    },
    generatePageUrl(currentPage, lastPage, direction) {
      currentPage = parseInt(currentPage || 1);
      let page = direction;
      if (direction === "next") {
        page = currentPage + 1;
        console.log(page);
        if (page > lastPage) return null;
      } else {
        if (page === 0) return null;
        page = currentPage - 1;
      }

      return this.generatedApiUrl + `?page=${page}`;
    },
    handleError(payload, description) {
      console.log(payload, description);
    },
    onLoaded() {
      this.showGlobalPageLoader(false);
    },
    onLoading() {
      this.showGlobalPageLoader(true);
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      page = page || 1;
      console.log(page);
      this.$refs.vuetable.changePage(page);
    },
    refresh() {
      this.$refs.vuetable.refresh();
    },
    reload() {
      this.$refs.vuetable.reload();
    },
    toggleDetailRow(rowId) {
      this.$refs.vuetable.toggleDetailRow(rowId);
    },
    transform(_data) {
      let returnedData = null;
      let { data, pagination = this.pagination, ...others } = _data;
      if (!data) {
        data = others;
        returnedData = { data };
      } else returnedData = _data;
      const { total, currentPage, lastPage, perPage, from, to } =
        pagination || {};
      const transformedData = {
        per_page: perPage,
        last_page: lastPage,
        current_page: parseInt(currentPage),
        total,
        from,
        to,
        next_page_url: this.generatePageUrl(currentPage, lastPage, "next"),
        previous_page_url: this.generatePageUrl(
          currentPage,
          lastPage,
          "previous"
        )
      };
      returnedData.pagination = transformedData;
      return returnedData;
    }
  },
  props: {
    apiUrl: {
      type: String
    },
    detailRowComponent: {
      type: undefined
    },
    detailRowField: {
      type: String
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    showExportButton: {
      type: Boolean,
      default() {
        return false;
      }
    }
  }
};
</script>
