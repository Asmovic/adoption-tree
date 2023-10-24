let config = {
  appBaseUrl: process.env.VUE_APP_BASE_URL || "",
  apiBaseUrl: (process.env.VUE_APP_BASE_URL || "") + "/api",
  constants: {
    appStateId: "app_state_id",
    USER: "app_user",
    ACCESS_TOKEN: "user_access_token",
    REFRESH_TOKEN: "user_refresh_token",
    PENDING_PAYMENT_VALIDATION: "pending_pay_val"
  },
  dbConfig: {
    name: "adoptionTreeApp",
    storeName: "adoptionTreeStore"
  }
};

module.exports = config;
