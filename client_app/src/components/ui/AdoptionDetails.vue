<template>
  <div class="adoption-details mx-auto">
    <header class="bg-primary">
      <h3 class="mb-0 text--white">Payment details</h3>
    </header>
    <hr class="m-0" />
    <section class="body">
      <div class="line flex justify--space-between">
        <strong>Channel</strong>
        <span>{{ data.gateway }}</span>
      </div>
      <div class="line flex justify--space-between">
        <strong>Description</strong>
        <span class="text--capitalize">{{ data.description }}</span>
      </div>
      <div class="line flex justify--space-between">
        <strong>Payment Method</strong>
        <span class="text--capitalize">{{ getPaymentType(data.channel) }}</span>
      </div>
      <div class="line flex justify--space-between">
        <strong>Start Date</strong>
        <span class="text--capitalize">{{
          $dayjs(data.paymentDate).format("DD/MM/YYYY")
        }}</span>
      </div>
      <div class="line flex justify--space-between">
        <strong>Reference</strong>
        <span class="text--capitalize">{{ data.reference }}</span>
      </div>
      <div class="line flex justify--space-between">
        <strong>Total Amount</strong>
        <span class="text--capitalize">{{
          getFormattedAmount(data.amount)
        }}</span>
      </div>
    </section>
    <slot></slot>
    <div class="close-btn flex justify--center pb-4" v-if="$slots.close">
      <slot name="close"></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getPaymentType(type) {
      return type.replace(/_/g, " ").toLowerCase();
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.adoption-details {
  background-color: #fff;
  width: 500px;
  max-width: 100%;
  box-shadow: 0 20px 40px 2px #00000021;
}

header,
.body {
  padding: 15px;
}

.line {
  padding: 10px 0;
  border-bottom: 1px solid #e6e6e6;

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    border-bottom: none;
  }
}
</style>
