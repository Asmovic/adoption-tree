import Vue from "vue";
import Vuex from "vuex";

import db from "./../db";
import { constants } from "./../config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: null,
    formError: "",
    globalAlertMessage: {
      show: false,
      type: "success",
      text: ""
    },
    showGlobalForm: {
      adoption: false,
      ["enrollee.adoption"]: false,
      login: false,
      ["registration.adopter.phone.confirmation"]: false,
      ["registration.enrollee.phone.confirmation"]: false,
      ["registration.role"]: false,
      ["registration.adopter"]: false,
      ["registration.enrollee"]: false,
      ["forgot-password"]: false
    },
    showGlobalPopup: false,
    globalPageLoaderIsVisible: false,
    popupSize: "lg",
    refreshToken: null,
    registrationOptionsData: null,
    stateId: db.get(constants.appStateId),
    user: db.get(constants.USER)
  },
  getters: {
    accessToken(state) {
      return state.accessToken;
    },
    formError(state) {
      return state.formError;
    },
    globalAlertMessage(state) {
      return state.globalAlertMessage;
    },
    loggedInUser(state) {
      return state.user;
    },
    popupSize(state) {
      return state.popupSize;
    },
    refreshToken(state) {
      return state.refreshToken;
    },
    registrationOptionsData(state) {
      return state.registrationOptionsData;
    },
    showGlobalForm(state) {
      return state.showGlobalForm;
    },
    showGlobalPopup(state) {
      return state.showGlobalPopup;
    },
    stateId(state) {
      return parseInt(state.stateId || 0);
    },
    globalPageLoaderIsVisible(state) {
      return state.globalPageLoaderIsVisible;
    }
  },
  mutations: {
    endSession() {
      localStorage.clear();
      window.location = "/";
    },
    hideGlobalAlertMessage(state) {
      state.globalAlertMessage.show = false;
    },
    hideGlobalForm(state, formName) {
      state.showGlobalPopup = false;
      if (formName) {
        state.showGlobalForm[formName] = false;
      } else {
        Object.keys(state.showGlobalForm).forEach(key => {
          state.showGlobalForm[key] = false;
        });
      }

      state.popupSize = "lg";
    },
    hideGlobalPopup(state) {
      state.showGlobalPopup = false;
    },
    setAccessToken(state, token) {
      state.accessToken = token;
      db.save(constants.ACCESS_TOKEN, token);
    },
    setFormError(state, error) {
      state.formError = error;
    },
    setGlobalAlertMessage(state, { message, type }) {
      const colors = {
        error: "danger"
      };

      const color = colors[type] || type;
      state.globalAlertMessage.type = color;
      state.globalAlertMessage.text = message;
      state.globalAlertMessage.show = true;
    },
    setPopupSize(state, size) {
      state.popupSize = size;
    },
    setRefreshToken(state, token) {
      state.refreshToken = token;
      db.save(constants.REFRESH_TOKEN, token);
    },
    getRegistrationOptionsData(state, data) {
      state.registrationOptionsData = data;
    },
    setStateId(state, id) {
      state.stateId = id;
      db.save(constants.appStateId, id);
    },
    setUser(state, user) {
      state.user = user;
      db.save(constants.USER, user);
    },
    showGlobalForm(state, formName) {
      Object.keys(state.showGlobalForm).forEach(key => {
        state.showGlobalForm[key] = formName === key ? true : false;
      });
      state.showGlobalPopup = true;
    },
    showGlobalPageLoader(state, bool) {
      state.globalPageLoaderIsVisible = bool;
    },
    showGlobalPopup(state) {
      state.showGlobalPopup = true;
    }
  },
  actions: {},
  modules: {}
});
