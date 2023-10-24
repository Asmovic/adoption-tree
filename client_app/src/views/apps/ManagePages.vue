<template>
  <div class="row">
    <div class="col-12">
      <section class="adoptee-requests">
        <header class="flex justify--space-between flex--items-flex-end">
          <h3 class="mb-0" style="line-height: 1">All Pages</h3>
          <router-link
            :to="{ name: 'CreatePage' }"
            tag="button"
            class="btn btn-primary btn-sm flex flex--items-center"
          >
            <span>Add New Page</span>&nbsp;&nbsp;&nbsp;
            <div class="_space"></div>
            <ion-icon name="add-circle"></ion-icon>
          </router-link>
        </header>
        <br />
        <vue-table api-url="/pages" :fields="fields" ref="vuetable">
          <template slot="sn" slot-scope="props">{{
            +props.rowIndex + 1
          }}</template>
          <template slot="action" slot-scope="props">
            <router-link
              :to="{
                name: 'EditPage',
                params: { id: props.rowData.id }
              }"
              tag="button"
              class="btn btn-sm btn-info"
              >Edit Page</router-link
            >
            <span class="_space"></span>
            <a
              :href="`/pages/${props.rowData.slug}`"
              class="btn btn-sm btn-primary"
              target="_blank"
            >
              View Page</a
            >
          </template>
        </vue-table>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          name: "title"
        },
        {
          name: "slug"
        },
        {
          name: "action",
          title: "action"
        }
      ]
    };
  }
};
</script>
