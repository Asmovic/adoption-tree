<template>
  <!-- <div class="sidebar-ads"> -->
    <div class="buy-button">
    <img src="/assets/img/dashboard-adopter2.png" alt class="adopter" />
    <div class="flex grid">
      <!-- <div class="adverttext grid"> -->
       <div class="grid"> 
        
          <button type="button" class="btn btn-light button-default get-started-btn align-self-center buy-btn"
          @click="handleClick">{{ buttonText }}</button>
       
        
      </div>
      <h5 class="text--center mb-0 adverttext-info">
        Many helpless Anambra State children have being lost because they had no
        health insurance.
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    buttonText() {
      return (
        (this.loggedInUser.activeRole === "DONOR" ? "Adopt" : "Buy") + " Now!"
      );
    },
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
// .sidebar-ads {
//   // top: 100px;
//   // position: sticky;
//   // // margin-left: -15px;
//   // padding-right: 15px;
// }

.buy-btn{
  background: #69be0f;
}
.adverttext {
  margin: 0;
  padding: 15px;
  min-height: 70px;
  color: #fff;
  border: 1.2px solid #fff;
  background: #69be0f;
}

.adverttext-info {
  color: #fff;
}

.get-started-btn {
  box-shadow: 1px 6px 3px #00000053;
  margin: 0px;
}

@media screen and (max-width: $medium-screen) {
  // .sidebar-ads {
  //   position: relative;
  // }
  .buy-button{
    display: none;
  }
}
</style>
