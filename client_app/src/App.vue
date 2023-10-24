<template>
  <div id="app" class="flex flex--column justify--space-between">
    <span class="alert global-alert" :class="alertClasses">{{
      globalAlertMessage.text
    }}</span>
    <top-header />
    <main class="flex flex--expand flex--column">
      <router-view />
    </main>
    <site-footer />
    <loader :show="globalPageLoaderIsVisible" />
  </div>
</template>

<script>
import SiteFooter from "@/components/shared/SiteFooter";
import TopHeader from "@/components/shared/TopHeader";
import Loader from "./components/ui/GlobalLoader";
export default {
  components: {
    Loader,
    SiteFooter,
    TopHeader
  },
  computed: {
    alertClasses() {
      const { type, show } = this.globalAlertMessage;
      const classes = [`alert-${type}`];
      if (show) classes.push("show");
      return classes;
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap");
@import "~pretty-checkbox/src/pretty-checkbox.scss";
@import "./assets/stylesheets/styles.scss";
</style>
