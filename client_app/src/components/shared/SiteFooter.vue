<template>
  <footer class="site-footer">
    <div class="container mx-auto flex">
      <div class="links flex flex--items-center">
        <router-link to="/pages/our-agency">About Us</router-link>
        <!-- <router-link to="/posts">Posts</router-link> -->
        <router-link to="/pages/contact-us">Contact Us</router-link>
      </div>
      <section class="flex flex--column flex--items-center">
        <div class="powered-by text--center">
          <h4 class="fw-md text--center my-0">
            Powered by
            <br />WHO and SaltinGStein with funding from the EU
          </h4>
          <p>Copyright {{ copyrightYear }}. All Rights Reserved</p>
        </div>
      </section>
    </div>
    <global-popup v-if="showGlobalPopup" />
  </footer>
</template>

<script>
import GlobalPopup from "./GlobalPopup";
export default {
  computed: {
    copyrightYear() {
      return new Date().getFullYear();
    }
  },
  components: {
    GlobalPopup
  }
};
</script>

<style lang="scss" scoped>
.site-footer {
  background-color: $primary-color;
  padding: 30px 0;
}

.links {
  a {
    margin-right: 20px;
    &:hover,
    &.router-link-exact-active {
      color: #ffeb3b;
    }
  }
  & + section {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>
