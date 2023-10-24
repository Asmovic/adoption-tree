<template>
  <section class="posts-photo-gallery">
    <div class="container mx-auto grid">
      <div class="recent-posts">
        <header class="flex flex--items-center">
          <h2 class="text--bold text--primary my-0">Recent Posts</h2>
          <span class="line"></span>
        </header>
        <div class="post-titles">
          <h4 class="fw-md title flex flex--items-center">Anambra State AdoptionTREE</h4>
          <h4 class="fw-md title flex flex--items-center">AdoptionTREE first quarter report</h4>
          <h4 class="fw-md title flex flex--items-center">Most Recent Adoptions</h4>
          <h4 class="fw-md title flex flex--items-center">AdoptionTREE launched in 15 Local Govts.</h4>
        </div>
      </div>
      <div class="photo-gallery">
        <header class="flex flex--items-center">
          <h2 class="text--bold text--primary my-0">Photo Gallery</h2>
        </header>
        <div class="thumbnails">
          <img
            src="/assets/img/african-children-laughing.png"
            alt="African children laughing"
            class="img--rounded"
          />
          <img
            src="/assets/img/starving-children-africa.png"
            alt="Starving African children"
            class="img--rounded"
          />
          <img src="/assets/img/img_4596.png" alt class="img--rounded" />
          <img
            src="/assets/img/18083719995_ca92481f5c_b.png"
            alt="AdoptionTree enrollees"
            class="img--rounded"
          />
          <img src="/assets/img/file_0_original.png" alt="kkk" class="img--rounded" />
          <img
            src="/assets/img/african-children-laughing.png"
            alt="African children laughing"
            class="img--rounded"
          />
          <img
            src="/assets/img/starving-children-africa.png"
            alt="Starving African children"
            class="img--rounded"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.posts-photo-gallery {
  margin: 140px 0 80px;
}
.title {
  &::before {
    content: " ";
    display: inline-block;
    width: 28px;
    height: 28px;
    background-color: $primary-color;
    border-radius: 50%;
    border: 6px solid $primary-color-lighter;
    margin-right: 8px;
  }
}

.line {
  height: 1px;
  flex: 1;
  background-color: $primary-color;
}

header h2 {
  margin-right: 56px;
}

.grid {
  grid-template-columns: repeat(2, calc(50% - 24px));
  gap: 48px;
}

.thumbnails {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 14px;
}
</style>
