<template>
  <div class="row">
    <div class="col-md-9">
      <h4>All Patients</h4>
      <vue-table api-url="/patients" :fields="fields">
        <template slot="sn" slot-scope="props">
          {{
          props.rowIndex + 1
          }}
        </template>
        <template
          slot="name"
          slot-scope="props"
        >{{ `${props.rowData.firstName} ${props.rowData.lastName}` }}</template>
        <template slot="action" slot-scope="props">
          <router-link
            :to="{
              name: 'PatientInfo',
              params: { id: props.rowData.id }
            }"
            tag="button"
            class="btn btn-sm btn-info"
          >View Details</router-link>
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
          name: "name",
          title: "Name"
        },
        {
          name: "phone",
          title: "Phone"
        },
        {
          name: "biometricId",
          title: "Patient ID"
        },
        {
          formatter: date =>
            date ? dayjs(date).format("DD/MM/YYYY") : "No checkins yet.",
          name: "lastCheckIn",
          title: "Last Checkin Date"
        },
        {
          name: "action",
          title: "action"
        }
      ]
    };
  }
};
</script>
