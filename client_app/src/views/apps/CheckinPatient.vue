<template>
  <div class="row">
    <div class="col-md-12">
      <div class="col-md-8 mt-2 py-2 mt-4 ml-4">
        <h3 class="text-success mb-4">
          <b>Input Patient Card Number</b>
        </h3>
        <div class="mt-4">
          <div class="flex flex--column">
            <form class="search flex" @submit.prevent="searchPatient">
              <input
                type="text"
                class="flex--expand form-control"
                v-model="searchPhoneNumber"
              />
              <div class="_space"></div>
              <button class="button" :disabled="!searchPhoneNumber">
                Search&nbsp;&nbsp;
                <div class="_space"></div>
                <ion-icon name="search"></ion-icon>
              </button>
            </form>
            <ul class="search-results pl-0 mt-3" v-if="searchResults">
              <template v-if="searchResults.length">
                <li
                  class="patient flex justify--space-between flex--items-center"
                  v-for="(patient, index) in searchResults"
                  :key="index"
                >
                  <span>
                    {{ patient.firstName }} {{ patient.middleName }}
                    {{ patient.lastName }}&nbsp;&nbsp;
                    <span v-if="!patient.isEnabled">(Plan expired)</span>
                  </span>
                  <div class="flex flex--items-center">
                    <strong>
                      Biometric ID&nbsp;
                    </strong>
                    <span class="_space"></span>
                    <span
                      class="btn btn-danger btn-sm"
                      v-if="!patient.biometricId"
                    >
                      Not registered
                    </span>
                    <span v-else>
                      {{ patient.biometricId }}
                    </span>
                  </div>
                  <button
                    class="button button--md btn btn-sm"
                    @click="patientInfo = patient"
                    :disabled="!patient.isEnabled"
                  >
                    Checkin
                  </button>
                </li>
              </template>
              <template v-else>
                <li class="patient">No patient found.</li>
              </template>
            </ul>
          </div>
        </div>
        <textarea
          placeholder="Add Notes"
          v-if="patientInfo"
          cols="30"
          rows="5"
          class="pt-2 pb-2"
          v-model="patientInfo.patientnote"
        ></textarea>
        <button
          v-if="patientInfo"
          class="button button--primary text--no-decoration mb-4"
          @click="handleSubmit()"
        >
          Submit Info
          <i class="fa fa-credit-card"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      searchResults: null,
      patientInfo: null,
      searchPhoneNumber: ""
    };
  },
  methods: {
    async searchPatient() {
      try {
        const phone = this.searchPhoneNumber;
        const { data } = await this.$axios.get(
          this.apiBaseUrl + `/patients?phone=${phone}`
        );
        const searchResults = data.data || [];
        const date = new Date();
        this.searchResults = searchResults.map(x => {
          return {
            fullName: `${x.firstName} ${x.middleName || ""} ${x.lastName}`,
            isEnabled: dayjs(x.endDate) > date,
            ...x
          };
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleSubmit() {
      const postData = {
        userId: this.patientInfo.id,
        note: this.patientInfo.patientnote
      };

      const { data } = await this.$axios.post(
        this.apiBaseUrl + "/patients/checkin",
        postData
      );

      if (data) {
        this.showGlobalAlert("Notes added Successfully");
        this.patientInfo = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-results {
  list-style: none;
  .patient {
    padding: 10px;
    background-color: #f8f8f8;
  }
}
</style>
