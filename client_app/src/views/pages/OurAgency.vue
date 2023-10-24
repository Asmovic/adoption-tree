<template>
  <div class="page-imshia">
    <div class="container mx-auto">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <section class="text--center">
            <div class="main">
              <h2 class="text--bold mt-4">Our Agency</h2>
              <p>
                Anambra State Health Insurance Agency (ASHIA) is a non-profit
                government agency established by the Anambra State Health
                Insurance Scheme Law of 2016. The Agency is mandated by law to
                promote, regulate, supervise, implement and ensure the effective
                administration of the Scheme.
              </p>
            </div>
            <h2 class="text--bold mt-4">Our Vision</h2>
            <p>
              To achieve Universal Health Coverage (UHC) in Anambra State by the
              year 2030.
            </p>
            <br />
            <h2 class="text--bold mt-4">Our Mission</h2>
            <p>
              Strategic purchasing of quality health care services for all
              residents of Anambra State in a pre-payment model from equitably
              distributed network of standard facilities managed in a
              digitalized system in a manner that positions the State to achieve
              the SDGs Universal Health Coverage target.
            </p>
          </section>
        </div>
      </div>
      <div class="showcase">
        <div class="row">
          <div class="col-md-3" v-for="i in 4" :key="i">
            <img :src="`/assets/img/showcase-${i}.jpg`" alt class="pb-3" />
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-8 offset-md-2">
          <h2 class="text--bold mt-4">Key Achievements Since 2017 To Date</h2>
          <ul class="pl-3 text--center" style="list-style-position: inside;">
            <li>Registration of over 86,000 individuals into the scheme</li>
            <li>
              Accreditation and adoption of over 300 healthcare service
              providers into the scheme.
            </li>
            <li>
              Encouraged payment of premium for the poor and vulnerable persons
              into the scheme by philanthropists through the Adoption Model.
            </li>
            <li>Encouraged family registration through the family package.</li>
            <li>Rehabilitation of government facilities in the rural areas.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jumbotron {
  padding: 220px 0px;
  background: url(/assets/img/imsha-banner-img.jpg) center center no-repeat;
  background-size: cover;

  .main-heading {
    width: 1100px;
    max-width: 100%;
    font-size: 72px;
    line-height: 1;

    @media screen and (max-width: $medium-screen) {
      font-size: 36px;
    }
  }
}

p {
  font-size: 18px;
}

.content {
  padding-bottom: 60px;
}
</style>
