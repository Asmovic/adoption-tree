<template>
  <div class="row">
    <div class="col-9">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">All Stats</h3>
          <button
            class="btn btn-primary btn-sm flex flex--items-center"
            @click="showStatForm"
          >
            <span>Add New Stat</span>&nbsp;&nbsp;&nbsp;
            <div class="_space"></div>
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </header>
        <br />
        <vue-table api-url="/vision-board" :fields="fields" ref="vuetable">
          <template slot="sn" slot-scope="props">{{
            props.rowIndex + 1
          }}</template>
          <template slot="icon" slot-scope="props">
            <span v-html="props.rowData.icon" class="stat-icon"></span>
          </template>
          <template slot="isActive" slot-scope="props">
            <ion-icon
              name="checkmark-circle-outline"
              class="text-success"
              style="font-size: 24px"
              v-if="props.rowData.isActive"
            />
            <ion-icon
              name="close-circle"
              class="text-danger"
              style="font-size: 24px"
              v-else
            />
          </template>
          <template slot="action" slot-scope="props">
            <button
              class="btn btn-sm btn-info"
              @click="showStat(props.rowData)"
            >
              Details
            </button>
          </template>
        </vue-table>
      </section>
      <popup :size="popupSize" :show="showModal" @close-popup="closeStatForm">
        <div class="content">
          <h4 for="adoptees">New Stat</h4>
          <hr />
          <form action @submit.prevent="handleSubmit" class="flex flex--column">
            <div class="row">
              <div class="col-md-6">
                <input-group :error="formErrors.title">
                  <label for="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    v-model="stat.title"
                    placeholder="Title"
                    @click="clearFormError('title')"
                  />
                </input-group>
              </div>
              <div class="col-md-6">
                <input-group :error="formErrors.value">
                  <label for="value">Value</label>
                  <input
                    type="text"
                    name="value"
                    required
                    v-model="stat.value"
                    placeholder="Value"
                    @click="clearFormError('value')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <input-group>
                  <label for="icon">Icon</label>
                  <textarea
                    name="icon"
                    rows="5"
                    v-model="stat.icon"
                    @click="clearFormError('icon')"
                    placeholder="Icon (paste HTML text)"
                  ></textarea>
                </input-group>
              </div>
              <div class="col-sm-6">
                <div class="row">
                  <div class="col-sm-12">
                    <input-group :error="formErrors.updateWithEndpoint">
                      <label for="updateWithEndpoint"
                        ><span>Update With Endpoint? </span>
                        <span class="_space"></span>
                        <input
                          style="display: inline-block"
                          type="checkbox"
                          name="updateWithEndpoint"
                          v-model="stat.updateWithEndpoint"
                      /></label>
                    </input-group>
                  </div>
                  <div class="col-md-12">
                    <input-group :error="formErrors.endpoint">
                      <label for="endpoint">Endpoint</label>
                      <input
                        type="text"
                        name="endpoint"
                        :required="stat.updateWithEndpoint"
                        :disabled="!stat.updateWithEndpoint"
                        v-model="stat.endpoint"
                        placeholder="Endpoint"
                        @click="clearFormError('endpoint')"
                      />
                    </input-group>
                  </div>
                  <div class="col-sm-12" v-if="stat.id">
                    <br />
                    <p class="flex flex--items-baseline">
                      <span>Active?&nbsp;</span>
                      <span class="_space"></span>
                      <input
                        type="checkbox"
                        name="isActive"
                        v-model="stat.isActive"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-md-3 offset-md-9">
                <button type="submit" class="button full-width">
                  {{ buttonText }}
                </button>
              </div>
            </div>
          </form>
          <stretch-loader :show="showLoader" />
        </div>
      </popup>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
import Popup from "./../../components/ui/Popup";
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  data() {
    return {
      stat: {},
      requests: [],
      loading: false,
      modalIsEditable: true,
      animate: false,
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          name: "title",
          title: "Title"
        },
        {
          name: "icon",
          title: "Icon"
        },
        {
          name: "isActive",
          title: "Active"
        },
        {
          name: "action",
          title: "action"
        }
      ],
      showLoader: false,
      showModal: false
    };
  },
  components: {
    Popup,
    SidebarAds
  },
  computed: {
    buttonText() {
      return this.loading ? " Please wait " : this.stat.id ? "Update" : "Save";
    }
  },
  methods: {
    closeStatForm() {
      this.showModal = false;
      this.modalIsEditable = true;
      this.stat = {};
    },
    handleSubmit() {
      this.stat.id ? this.updateStat() : this.addStat();
    },
    async addStat() {
      this.loading = true;
      try {
        await this.$axios.post(
          this.apiBaseUrl + "/vision-board",
          Object.assign({}, this.stat)
        );
        this.closeStatForm();
        this.showGlobalAlert("Added Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    },
    async showStat(stat) {
      this.stat = Object.assign({}, stat);
      this.showStatForm(true);
    },
    async showStatForm(editable = true) {
      this.modalIsEditable = editable;
      this.showModal = true;
    },
    async updateStat() {
      this.loading = true;
      try {
        await this.$axios.patch(
          this.apiBaseUrl + `/vision-board/${this.stat.id}`,
          Object.assign({}, this.stat)
        );
        this.closeStatForm();
        this.showGlobalAlert("Updated Successfully");
        this.$refs.vuetable.reload();
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }
      this.loading = false;
    }
  },
  mixins: [formMixins]
};
</script>

<style lang="scss" scoped>
.stat-icon {
  display: flex;
  justify-content: center;
  ::v-deep {
    svg {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
