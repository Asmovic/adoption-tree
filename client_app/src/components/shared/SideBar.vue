<template>
  <div class="flex-column nav-pills sidenavbar" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <ul class="menu">
      <li v-for="(menu, index) in appMenus" :key="index">
        <template v-if="menu.route.url">
          <a class="nav-link" :href="menu.route.url">{{ menu.name }}</a>
        </template>
        <template v-else>
          <router-link :to="{ name: menu.route.name }" exact>{{
            menu.name
          }}</router-link>
        </template>
      </li>
      <li>
        <div class="fallback">
          <button type="button" class="btn btn-light button-default get-started-btn align-self-center buy-btn"
          @click="handleClick">{{ buttonText }}</button>
        </div>
        
        <!-- <a class="nav-link">Buy Plan</a> -->
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import menus from "./../../menus";
export default {
  computed: {
    appMenus() {
      // console.log("menus: ", menus[this.loggedInUser.activeRole].push({ name: 'Buy Plan', route: {
      //   name: 'buyPlan'
      // }}));
      return (menus[this.loggedInUser.activeRole] || []).filter(
        x => x.show !== false
      );
    },
    buttonText() {
      return (
        (this.loggedInUser.activeRole === "DONOR" ? "Adopt" : "Buy") + " Now!"
      );
    }
  },
  methods: {
    handleClick() {
      const form =
        this.loggedInUser.activeRole === "DONOR"
          ? "adoption"
          : "enrollee.adoption";
      this.showGlobalForm(form);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidenavbar {
  background-color: #f5fffd;
  color: #000;
  border-radius: 4px;
  padding: 20px 0 80px 0;
  left: 0;
  margin: 0;
  height: 100%;
}

.menu {
  padding: 0 10px;
}

.sidenavbar .menu li {
  display: flex;
  border-bottom: 1px solid #d1d1d1;
  transition: background-color 0.5s ease;
}

.sidenavbar .menu a {
  flex: 1;
  justify-content: left;
  display: inline-flex;
  color: #000;
  font-size: 16px;
  text-decoration: none;
  padding: 10px 15px;
  position: relative;

  &.router-link-active {
    background-color: $primary-color;
  }
}

.sidenavbar a:active {
  color: rgb(219, 187, 6);
}

.sidenavbar .menu a>.fa {
  font-weight: bold;
  margin-left: 8px;
}

.sidenavbar .menu li:hover {
  background-color: #f5fffd;
}

.sidenavbar .menu li a:hover {
  background-color: $primary-color;
}

.sidenavbar .menu li:hover .sidebar {
  display: flex;
  background-color: #f5fffd;
}

.fallback {
  display: none;
}
@media (max-width:629px) {
  .fallback {
    display: block;
  }
}
</style>
