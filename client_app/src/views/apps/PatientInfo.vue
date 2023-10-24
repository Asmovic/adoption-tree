<template>
  <div class="row">
    <div class="col-md-12">
      <div class="content">
        <section class="patient-details py-4" v-if="patient">
          <h3>Patient Information</h3>
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td>
                  <strong>Name:</strong>
                </td>
                <td>{{ patient.firstName }} {{ patient.lastName }}</td>
                <td>
                  <strong>Phone no:</strong>
                </td>
                <td>{{ patient.phone }}</td>
              </tr>
              <tr>
                <td>
                  <strong>Gender:</strong>
                </td>
                <td class="text--capitalize">{{ patient.gender }}</td>
                <td>
                  <strong>Biometric ID:</strong>
                </td>
                <td>{{ patient.biometricId }}</td>
              </tr>
              <tr>
                <td>
                  <strong>Start Date:</strong>
                </td>
                <td class="text--capitalize">{{ $dayjs(patient.startDate).format("DD/MM/YYYY") }}</td>
                <td>
                  <strong>End Date:</strong>
                </td>
                <td class="text--capitalize">{{ $dayjs(patient.endDate).format("DD/MM/YYYY") }}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <br />
        <section class="checkins" v-if="patient">
          <h3>Visits</h3>
          <table class="vuetable table table-hover table-bordered fixed">
            <thead>
              <tr>
                <td>#</td>
                <td>Date</td>
                <td>Action</td>
              </tr>
            </thead>
            <template v-for="(item, index) in checkins">
              <tr :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info"
                    @click="toggle(item.id)"
                  >{{ opened.includes(item.id) ? "Hide Note" : "View Note" }}</button>
                </td>
              </tr>
              <tr v-if="opened.includes(item.id)" :key="`${item.userId} ${item.createdAt}`">
                <td colspan="3">{{ item.note }}</td>
              </tr>
            </template>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  created() {
    this.getPatientInfo();
  },
  data() {
    return {
      checkins: [],
      opened: [],
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          formatter: date => dayjs(date).format("DD/MM/YYYY"),
          name: "createdAt",
          title: "Date"
        },
        {
          name: "action",
          title: "action"
        }
      ],
      patient: null
    };
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
    async getCheckIns(patientid) {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + `/patients/${patientid}/checkins`
        );
        this.checkins = data.data;
      } catch (error) {
        this.handleError(error);
      }
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    async getPatientInfo() {
      this.showGlobalPageLoader(true);
      try {
        this.getCheckIns(this.$route.params.id);
        const { data } = await this.$axios.get(
          this.apiBaseUrl + `/patients/${this.$route.params.id}`
        );
        this.patient = data;
      } catch (error) {
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  border-top: solid 4px #6abe0f;
  border-left: solid 2px #6abe0f;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
