import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import db from "./db";
import config from "./config";
import dayjs from "dayjs";
import VueProgressBar from "vue-progressbar";

import "./globalComponents";

axios.defaults.withCredentials = true;
axios.defaults.headers.get["Cache-control"] = "no-cache";
axios.interceptors.request.use(axiosConfig => {
  const accessToken = db.get(config.constants.ACCESS_TOKEN);
  const refreshToken = db.get(config.constants.REFRESH_TOKEN);
  if (accessToken && refreshToken) {
    axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
    axiosConfig.headers["X-Refresh-Token"] = refreshToken;
  }

  return axiosConfig;
});

const handleAxiosResponse = response => {
  console.log("Response", response);
  const { responseURL } = response.request;
  if (!response) return;
  const headers = response.headers;
  const accessToken = headers["x-access-token"];
  const refreshToken = headers["x-refresh-token"];
  const killSwitch = headers["x-kill-session"];

  if (killSwitch) {
    // Exit application
    store.commit("endSession");
  }
  if (accessToken) {
    db.save(config.constants.ACCESS_TOKEN, accessToken);
  }

  if (refreshToken) {
    db.save(config.constants.REFRESH_TOKEN, refreshToken);
  }

  const { data } = response;

  const responseData = data || response;
  if (typeof responseData === "object") {
    responseData._responseUrl = responseURL;
  }

  return responseData;
};

axios.interceptors.response.use(
  response => handleAxiosResponse(response),
  error => {
    const data = handleAxiosResponse(error.response);
    return Promise.reject(data);
  }
);

const progressOptions = {
  color: "#bffaf3",
  failedColor: "#874b4b",
  thickness: "3px",
  transition: {
    speed: "0.2s",
    opacity: "0.6s",
    termination: 300
  },
  autoRevert: true,
  position: "absolute",
  top: "initial",
  location: "top",
  inverse: false
};

Vue.prototype.$axios = axios;
Vue.prototype.$db = db;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$appConfig = config;

Vue.config.productionTip = false;
Vue.config.ignoredElements = ["ion-icon"];

import VueTable from "./components/VueTable.vue";
Vue.component("vue-table", VueTable);
Vue.use(VueProgressBar, progressOptions);

Vue.mixin({
  computed: {
    formError_() {
      return this.$store.getters.formError;
    },
    globalAlertMessage() {
      return this.$store.getters.globalAlertMessage;
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    showForm() {
      return this.$store.getters.showGlobalForm;
    },
    globalPageLoaderIsVisible() {
      return this.$store.getters.globalPageLoaderIsVisible;
    },
    popupSize() {
      return this.$store.getters.popupSize;
    },
    showGlobalPopup() {
      return this.$store.getters.showGlobalPopup;
    },
    stateId() {
      return this.$store.getters.stateId;
    }
  },
  data() {
    return {
      apiBaseUrl: config.apiBaseUrl,
      filters: {},
      formErrors: {},
      loading: false
    };
  },
  methods: {
    addFiltersToUrl(url, filters) {
      const params = filters
        .filter(x => !!x.value)
        .map(x => {
          const { name, value } = x;
          return `${name}=${value}`;
        })
        .join("&");
      const query = params.length ? "?" + params : "";
      return url + query;
    },
    handleError(error) {
      if (!error) {
        alert("Please check your network connection.");
        return;
      }

      if (error.type === "validation") {
        const formErrors = {};
        error.errors.forEach(error => {
          formErrors[error.key] = error.message;
        });
        this.formErrors = formErrors;
        this.$store.commit("setFormError", error.errors[0].message);
        return;
      }

      if (typeof error === "string") {
        return this.$store.commit("setFormError", error);
      }

      const globalFormError = error.errors
        .map(error => error.message)
        .join("<br />");
      this.$store.commit("setFormError", globalFormError);
    },
    hideGlobalForm(formName) {
      this.$store.commit("hideGlobalForm", formName);
    },
    hideGlobalPopup() {
      this.$store.commit("hideGlobalPopup");
    },
    getFormattedAmount(amount, shorten = false) {
      amount = parseFloat(amount || 0);
      return (
        "N" +
        (shorten ? this.shortenAmount(amount, 1) : amount.toLocaleString())
      );
    },
    parseError(error) {
      console.log(error);
      if (!error) {
        return { message: "Please check your network connection." };
      }

      if (error.type === "validation" || Array.isArray(error.errors)) {
        const message = error.errors.map(error => error.message).join("\n");
        return { message };
      }

      if (typeof error === "string") {
        return { message: error };
      }
    },
    shortenAmount(amount, precision = 0) {
      if (amount > 1000 * 1000 * 1000 * 1000)
        return parseFloat(amount / 1000000000000).toFixed(precision) + "TRN";

      if (amount > 1000 * 1000 * 1000)
        return parseFloat(amount / 1000000000).toFixed(precision) + "BN";

      if (amount > 1000 * 1000)
        return parseFloat(amount / 1000000).toFixed(precision) + "M";

      if (amount > 1000)
        return parseFloat(amount / 1000).toFixed(precision) + "K";

      return parseFloat(amount).toFixed(precision);
    },
    showGlobalAlert(message, type = "success") {
      this.$store.commit("setGlobalAlertMessage", {
        message,
        type
      });

      setTimeout(() => {
        this.$store.commit("hideGlobalAlertMessage");
      }, 3000);
    },
    setPopupSize(size) {
      this.$store.commit("setPopupSize", size);
    },
    showGlobalForm(formName) {
      this.$store.commit("showGlobalForm", formName);
    },
    showGlobalPageLoader(bool) {
      this.$store.commit("showGlobalPageLoader", bool);
    }
  },
  watch: {
    formErrors: {
      deep: true,
      handler(errors) {
        const firstKey = Object.keys(errors)[0];
        if (typeof firstKey !== "undefined" && errors[firstKey] === null)
          this.$store.commit("setFormError", null);
      }
    }
  }
});

// const shortenAmount = amount => {
//   if (amount > 1000 * 1000 * 1000 * 1000)
//     return parseFloat(amount / 1000000000000).toFixed(1) + "TRN";

//   if (amount > 1000 * 1000 * 1000)
//     return parseFloat(amount / 1000000000).toFixed(1) + "BN";

//   if (amount > 1000 * 1000)
//     return parseFloat(amount / 1000000).toFixed(1) + "M";

//   if (amount > 1000) return parseFloat(amount / 1000).toFixed(1) + "K";

//   return parseFloat(amount).toFixed(1);
// };

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
