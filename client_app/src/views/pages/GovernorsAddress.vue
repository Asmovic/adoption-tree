<template>
  <div class="page-governors-address">
    <div class="jumbotron">
      <div class="container mx-auto">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <section class="flex flex--column flex--items-center">
              <div class="row">
                <div class="col-md-8 offset-md-2">
                  <h2
                    class="text--center text--white mb-0 sub-heading px-2"
                  >MESSAGE FROM HIS EXCELLENCY</h2>
                </div>
              </div>
              <h1
                class="main-heading text--center text--white text--bold"
              >THE GOVERNOR OF ANAMBRA STATE</h1>
              <h3 class="gov-name text--primary text--center">Prof. Charles Soludo</h3>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="we-rise">
      <div class="container mx-auto">
        <img src="/assets/img/soludo.jpg" class="img-right" alt="Prof. Charles Soludo" />
        <p>
          Anambra State Health Insurance Scheme was established with the aim to provide mandatory Health Insurance which shall entitle the insured persons to the benefits of prescribed good quality and cost-effective health services as set out in the service delivery package.
        </p>
        <p>
          The Agency is mandated by law to provide quality healthcare that is efficient, equitable, affordable and accessible to all residents of our dear State.
        </p>
        <p>
          My government has supported the Agency in the best way possible on its way to achieving the uncommon feats for which it has become a reference point for social health insurance schemes in Nigeria. We have without fail, met all the obligations placed on government by the law establishing the scheme. The Agency has lived up to expectation in delivering on its set goals. We are however, not resting on our oars, as we strive to cover more grounds until we achieve universal health coverage for all resident of Anambra State, which is my pact with ndi Anambra as we stated clearly in the People's Manifesto, a pact with Soludo.
        </p>
        <p>
          The Aku luo uno philosophy which is typified by the adoption model of health insurance developed by ASHIA, holds the best potential towards achieving the Universal Health Coverage target of the UN sustainable development goals.
        </p>
        <p>
          I therefore call on our people to utilize the opportunity provided by the ease of payment as well as ease of adoption provided by this platform, to key into this scheme for the greater good of all of us.
        </p>
        <p>
          The era for a healthy Anambra is indeed here.
        </p>
        <p>
          God bless Anambra state.
        </p>
        <p>
          God bless the Federal Republic of Nigeria.
        </p>
        <footer class="flex justify--space-between">
          <div class="footer-logo">
            <img src="/assets/img/anambra-state-logo.jpg" alt="Anambra state logo" />
          </div>
          <div class="footer-text">
            <h3 class="text--bold mb-0">Prof. Charles Soludo</h3>
            <h4 class="text--bold">Executive Governor, Anambra State</h4>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap");
.jumbotron {
  padding: 180px 0px;
  background: url(/assets/img/Charles-Soludo.jpg) center center no-repeat;
  background-size: cover;

  .main-heading {
    width: 980px;
    max-width: 100%;
    font-size: 64px;
    line-height: 1.1;
  }

  .sub-heading {
    font-size: 50px;
    line-height: 59px;
    font-family: "Raleway Medium", sans-serif;
  }
}

.img-left {
  float: left;
  padding-right: 40px;
}

.img-left,
.img-right {
  width: 48%;
}

.img-right {
  padding-left: 40px;
  float: right;
}

p {
  font-size: 18px;
}

.gov-name {
  font-size: 46px;
  margin-top: 80px;
}

.footer-logo {
  max-width: 160px;
}

.we-rise {
  padding-bottom: 60px;
  .heading {
    font-size: 38px;
  }
}

@media screen and (max-width: 600px) {
  .jumbotron {
    .main-heading {
      font-size: 48px;
      line-height: 1.1;
    }

    .sub-heading {
      font-size: 36px;
      line-height: 40px;
    }
  }

  .gov-name {
    font-size: 32px;
    margin-top: 40px;
  }

  footer {
    flex-direction: column;
    align-items: center;
  }

  .img-right {
    float: none;
    width: 100%;
    margin-bottom: 20px;
    padding: 0;
  }
}
</style>
