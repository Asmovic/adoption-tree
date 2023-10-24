<template>
  <div class>
    <dash-board-adopter v-if="this.loggedInUser.activeRole == 'DONOR'" />
    <dash-board-enrolee v-if="this.loggedInUser.activeRole == 'ENROLLEE'" />
  </div>
</template>

<script>
import DashBoardAdopter from "./../../components/dashboard/Adopter";
import DashBoardEnrolee from "./../../components/dashboard/Enrolee";

export default {
  components: {
    DashBoardAdopter,
    DashBoardEnrolee,
  },
};
</script>
<style lang="scss" scoped>
.container-body {
  display: flex;
  padding: 10px;
  padding-top: 20px;
  margin: 0;
}
</style>
