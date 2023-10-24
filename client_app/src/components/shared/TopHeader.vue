<template>
  <header class="site-header flex flex--items-center">
    <div class="flex justify--space-between full-width">
      <div class="logos--left">
        <div class="large-screen-only">
          <div class="nav-toggle" role="button" ref="navToggle">
            <img src="/assets/svg/snackbar.svg" alt="Mobile nav toggle" />
          </div>
        </div>
        <img src="/assets/img/eu-logo.png" alt="European union logo" />
        <img
          src="/assets/img/who-logo.png"
          alt="World Health Organization logo"
          class="who-logo"
        />
      </div>
      <div class="flex">
        <div class="large-screen-only">
          <div class="mobile-overlay" ref="overlay"></div>
        </div>
        <nav class="flex site-navigation" ref="navigation">
          <div class="large-screen-only">
            <a
              href="#"
              class="nav-link back-btn"
              @click.prevent="toggleNavigation"
            >
              <div class="flex">
                <img src="/assets/img/back-arrow.png" alt="" />
                <span>Back</span>
              </div>
            </a>
            <hr class="m-0" />
          </div>
          <a href="/" class="nav-link">Home</a>
          <a href="/pages/governors-address" class="nav-link"
            >Governor's Address</a
          >
          <li class="nav-link has-children">
            About Us
            <arrow-down />
            <ul class="nav-link__children">
              <li
                class="nav-link--child"
                v-for="(menu, index) in dropDownMenus"
                :key="index"
              >
                <a :href="menu.link" class="nav-link">{{ menu.title }}</a>
              </li>
            </ul>
          </li>
          <div
            class="auth-buttons flex flex--column px-2 pt-2 large-screen-only"
          >
            <template v-if="loggedInUser">
              <router-link
                :to="{ name: 'Dashboard' }"
                class="button button--primary text--no-decoration"
                >Dashboard</router-link
              >
              <button class="button button--primary" @click="logOut">
                Log Out
              </button>
            </template>
            <template v-else>
              <button
                class="button button--primary"
                @click="showGlobalForm('login')"
              >
                Login
              </button>
              <button
                class="button button--primary"
                @click="showGlobalForm('registration.role')"
              >
                Register
              </button>
            </template>
          </div>
        </nav>
        <div class="logos--right flex flex--items-center">
          <div class="auth-buttons desktop flex">
            <template v-if="loggedInUser">
              <router-link
                :to="{ name: 'Dashboard' }"
                class="button button--primary text--no-decoration"
                >Dashboard</router-link
              >
              <button class="button button--primary" @click="logOut">
                Log Out
              </button>
            </template>
            <template v-else>
              <button
                class="button button--primary"
                @click="showGlobalForm('login')"
              >
                Login
              </button>
              <button
                class="button button--primary"
                @click="showGlobalForm('registration.role')"
              >
                Register
              </button>
            </template>
          </div>
          <img src="/assets/img/anambra-gov-logo.png" alt="government logo" />
        </div>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
  </header>
</template>

<script>
import ArrowDown from "./../ui/icons/ArrowDown";
import formMixins from "./../../mixins/formMixins";
import NavPages from "./../../data/nav_pages.json";

export default {
  components: {
    ArrowDown
  },
  computed: {
    dropDownMenus() {
      return this.stateId ? NavPages[String(this.stateId)] : [];
    },
    showRoleSelection() {
      const { adopter, enrollee } = this.showForm.registration;
      return !(adopter || enrollee);
    }
  },
  created() {
    this.getStateId();
  },
  data() {
    return {
      roleOptions: [
        {
          name: "ENROLLEE",
          displayName: "Enrollee"
        },
        {
          name: "DONOR",
          displayName: "Adopter"
        }
      ]
    };
  },
  methods: {
    async getStateId() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/form-data/state-id"
        );
        this.$store.commit("setStateId", data);
      } catch (error) {
        console.log(error);
      }
    },
    toggleNavigation() {
      const navigation = this.$refs.navigation;
      const overlay = this.$refs.overlay;

      if (navigation.classList.contains("expanded")) {
        overlay.style.display = "none";
        navigation.classList.remove("expanded");
      } else {
        overlay.style.display = "block";
        navigation.classList.add("expanded");
      }
    },
    logOut() {
      this.$store.commit("endSession");
    }
  },
  mounted() {
    this.$refs.navToggle.addEventListener("click", this.toggleNavigation);
    this.$refs.overlay.addEventListener("click", this.toggleNavigation);
  },
  beforeDestroy() {
    this.$refs.navToggle.removeEventListener("click", this.toggleNavigation);
    this.$refs.overlay.removeEventListener("click", this.toggleNavigation);
  },
  mixins: [formMixins]
};
</script>

<style lang="scss" scoped>
.site-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  min-height: 80px;
  padding: 0 20px;
  background-color: white;
  box-shadow: 0 5px 14px 0px #00000017;
  z-index: 32;
}

.form-header {
  font-size: 45px;
}

.back-btn img {
  height: 24px;
  margin-left: -8px;
}

.logos {
  &--left {
    img {
      height: 60px;
      margin-right: 12px;
    }
  }

  &--right {
    > * {
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
    img {
      height: 60px;
    }
  }
}

.site-navigation {
  margin-right: 20px;
  transition: all 0.25s ease-in-out;
}

.mobile-overlay {
  background: #000;
  opacity: 0.6;
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.nav-link {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 12px;
  transition: all 0.25s ease-in-out;
  position: relative;

  .icon-arrow-down {
    margin-left: 6px;
  }

  &:hover {
    background-color: #00000017;
    text-decoration: none;
    color: inherit;

    > .icon-arrow-down {
      transform: rotate(180deg);
    }

    .nav-link__children {
      height: auto;
      opacity: 1;
    }
  }

  &__children {
    position: absolute;
    transition: opacity 0.25s;
    opacity: 0;
    height: 0;
    top: 100%;
    left: 0;
    padding-left: 0;
    min-width: 200px;
    text-decoration: none;
    list-style: none;
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 10px 10px 0px #0000002b;
    overflow: hidden;

    .nav-link {
      font-size: 14px;
      line-height: 1.25;
      padding: 12px 8px;
      display: block;
      padding: 8px;
      height: auto;
    }
  }
}

.nav-toggle {
  width: 32px;
  margin-right: 16px;
}

.large-screen-only {
  @media screen and (min-width: $large-screen + 2px) {
    display: none;
  }
}

.auth-buttons {
  gap: 6px;
}

@media screen and (max-width: $large-screen) {
  .auth-buttons {
    &.desktop {
      display: none;
    }
  }

  .site-header {
    min-height: 40px !important;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .logos {
    &--left {
      display: flex;
      align-items: center;

      img {
        height: 40px;
      }
    }

    &--right {
      img {
        height: 40px;
      }
    }
  }

  .site-navigation {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    max-width: 40%;
    box-shadow: 3px 0px 17px 3px #00000075;
    flex-direction: column;
    transform: translateX(-100%);

    &.expanded {
      transform: translateX(0);
    }

    .nav-link {
      align-items: flex-start;
      height: auto;
      padding: 8px 12px;
    }
  }

  .nav-toggle {
    width: 24px;
    margin-right: 16px;
  }
}

@media screen and (max-width: $medium-screen) {
  .site-header {
    min-height: 40px !important;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .site-navigation {
    max-width: 60%;
  }

  .logos {
    &--left {
      display: flex;
      align-items: center;

      img {
        height: 40px;
      }
    }

    &--right {
      img {
        height: 40px;
      }
    }
  }
}
</style>
