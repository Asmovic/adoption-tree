<template>
  <form action="/api/pages" method="post" @submit.prevent="saveOrUpdatePost">
    <div class="row">
      <div class="col-md-8">
        <div class="form-group">
          <input-group required>
            <label for="title">Title</label>
            <input
              type="text"
              class="form-control"
              v-model="post.title"
              id="title"
              placeholder="Post Title"
              required
            />
          </input-group>
        </div>
        <div class="form-group">
          <label>URL</label>
          <div class="flex flex--items-center">
            <div class="_space"></div>
            <span>{{ url }}</span>
            <div class="_space"></div>
            <div class="_space"></div>
            <input
              type="text"
              class="form-control page-slug"
              v-model="post.slug"
              :placeholder="pageSlug"
            />
          </div>
        </div>
        <div class="form-group">
          <input-group>
            <label for="content">Content</label>
            <editor
              apiKey="mz3a07jpadl4dx3gmvswvasjqih5guwy8ynqkapm6x0hun9m"
              :init="{
                height: 500,
                menubar: 'file edit insert view format table tools help',
                plugins: [
                  'advlist autolink lists link image charmap',
                  'searchreplace visualblocks code fullscreen',
                  'print preview anchor insertdatetime media',
                  'paste code help wordcount table'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic | \
                  alignleft aligncenter alignright | link image | \
                  bullist numlist outdent indent | help'
              }"
              v-model="post.content"
            >
            </editor>
          </input-group>
        </div>
        <div class="form-group">
          <label for="styles">Styles (Also accepts SCSS)</label>
          <textarea
            class="form-control"
            v-model="post.styles"
            id="styles"
            rows="10"
          />
        </div>
      </div>
      <div class="col-md-3 offset-md-1">
        <br />
        <button
          class="button button--primary"
          style="position: sticky; top: 150px;"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import slugify from "slugify";

export default {
  components: {
    Editor
  },
  computed: {
    buttonText() {
      return this.loading
        ? "Please wait.."
        : this.post.id
        ? "Update page"
        : "Save Page";
    },
    pageSlug() {
      const { title = "", slug } = this.post;
      if (slug) return slug;
      return slugify(title, { lower: true, remove: "'" });
    },
    url() {
      return `${window.location.origin}/pages/`;
    }
  },
  created() {
    if (this.id) this.getPage(this.id);
  },
  data() {
    return {
      post: {
        content: ""
      }
    };
  },
  methods: {
    async getPage(id) {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/pages/" + id
        );
        this.post = data;
      } catch (error) {
        const { message } = this.parseError(error);
        this.showGlobalAlert(message, "error");
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    },
    async savePage() {
      this.loading = true;
      try {
        const { data } = await this.$axios.post(
          this.apiBaseUrl + "/pages",
          Object.assign({}, this.post)
        );
        this.showGlobalAlert("Page Added Successfully");
        this.post = data;
        this.$router.replace({ name: "EditPage", params: { id: data.id } });
      } catch (error) {
        const { message } = this.parseError(error);
        this.showGlobalAlert(message, "error");
      }
      this.loading = false;
    },
    saveOrUpdatePost() {
      this.post.id ? this.updatePage() : this.savePage();
    },
    async updatePage() {
      this.loading = true;
      try {
        const { data } = await this.$axios.patch(
          this.apiBaseUrl + "/pages/" + this.post.id,
          Object.assign({}, this.post)
        );
        this.showGlobalAlert("Page Updated Successfully");
        this.post = data;
      } catch (error) {
        const { message } = this.parseError(error);
        this.showGlobalAlert(message, "error");
      }
      this.loading = false;
    }
  },
  props: {
    id: {
      type: Number,
      default() {
        return 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-slug {
  margin: 0;
  padding: 4px;
}

::v-deep .tox.tox-tinymce {
  width: 100%;
}
</style>
