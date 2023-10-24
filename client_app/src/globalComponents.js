import Vue from "vue";
import PrettyCheck from "pretty-checkbox-vue/check";
import FormError from "./components/ui/forms/FormError.vue";
import InputGroup from "./components/ui/forms/InputGroup.vue";
import SelectBox from "./components/ui/forms/SelectBox.vue";
import StretchLoader from "./components/ui/StretchLoader.vue";

Vue.component("form-error", FormError);
Vue.component("input-group", InputGroup);
Vue.component("pretty-check", PrettyCheck);
Vue.component("select-box", SelectBox);
Vue.component("stretch-loader", StretchLoader);
