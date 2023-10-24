<template>
  <div class="global-popup">
    <popup :size="popupSize" :show="showPopup" @close-popup="hidePopup">
      <adoption-form v-if="showForm.adoption" />
      <forgot-password-form class="flex" v-if="showForm['forgot-password']" />
      <login-form class="flex" v-if="showForm.login" />
      <adopter-phone-verification-form
        v-if="showForm['registration.adopter.phone.confirmation']"
      />
      <enrollee-phone-verification-form
        v-if="showForm['registration.enrollee.phone.confirmation']"
      />
      <register-adopter-form class="flex" v-if="showForm['registration.adopter']" />
      <register-enrollee-form class="flex" v-if="showForm['registration.enrollee']" />
      <registration-role-form class="flex" v-if="showForm['registration.role']" />
      <enrollee-adoption-form class="flex" v-if="showForm['enrollee.adoption']" />
    </popup>
  </div>
</template>

<script>
import AdoptionForm from "./../forms/AdoptionForm";
import EnrolleeAdoptionForm from "./../forms/EnrolleeAdoptionForm";
import AdopterPhoneVerificationForm from "./../forms/AdopterPhoneVerificationForm";
import EnrolleePhoneVerificationForm from "./../forms/EnrolleePhoneVerificationForm";
import ForgotPasswordForm from "./../forms/ForgotPasswordForm";
import LoginForm from "./../forms/LoginForm";
import RegistrationRoleForm from "./../forms/RegistrationRoleForm";
import RegisterAdopterForm from "./../forms/RegisterAdopterForm";
import RegisterEnrolleeForm from "./../forms/RegisterEnrolleeForm";
import Popup from "./../ui/Popup";

export default {
  components: {
    AdoptionForm,
    EnrolleeAdoptionForm,
    ForgotPasswordForm,
    LoginForm,
    AdopterPhoneVerificationForm,
    EnrolleePhoneVerificationForm,
    RegistrationRoleForm,
    RegisterAdopterForm,
    RegisterEnrolleeForm,
    Popup
  },
  data() {
    return {
      showPopup: false
    };
  },
  methods: {
    hidePopup() {
      this.showPopup = false;
      setTimeout(() => {
        this.$store.commit("hideGlobalForm");
      }, 300);
    }
  },
  mounted() {
    this.showPopup = true;
  }
};
</script>

<style lang="scss" scoped>
.global-popup {
  color: inherit;
}
</style>
