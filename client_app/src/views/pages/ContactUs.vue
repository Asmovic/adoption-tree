<template>
  <div class="page-imshia">
    <div class="container mx-auto">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <section class="text--center">
            <img
              src="/assets/img/anambra-state-logo.jpg"
              class="state-logo"
              alt="Anambra State logo"
            />
            <div class="main">
              <h2 class="text--bold my-4">Contact Us</h2>
              <div class="address flex">
                <div class="map-icon pr-1">
                  <img src="/assets/svg/pin.svg" alt />
                </div>
                <h3>
                  No 6 Hon. Pete Ibida Street, Road 1 Abuja Estate, Opposite Government House, Awka, Anambra State
                </h3>
              </div>
            </div>
          </section>
          <section class="contact-links">
            <div class="link flex flex--items-center">
              <img src="/assets/svg/telephone.svg" class="pr-1" alt />
              <h3>08144445376</h3>
            </div>
            <div class="link flex flex--items-center">
              <img src="/assets/svg/facebook.svg" class="pr-1" alt />
              <h3>@ashia anambra</h3>
            </div>
            <div class="link flex flex--items-center">
              <img src="/assets/svg/email.svg" class="pr-1" alt />
              <h3>writeashia@yahoo.com</h3>
            </div>
            <div class="link flex flex--items-center">
              <img src="/assets/svg/twitter.svg" class="pr-1" alt />
              <h3>@ashiaanambra</h3>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.state-logo {
  max-width: 150px;
  margin-top: 20px;
}
p {
  font-size: 18px;
}

.content {
  padding-bottom: 60px;
}

.address {
  h3 {
    font-size: 20px;
    line-height: 1.4;
  }
}

.contact-links {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: center;
  column-gap: 15px;
  margin-top: 80px;
}

.link {
  padding-bottom: 20px;
  img {
    max-height: 35px;
  }
  h3 {
    font-size: 26px;
    margin-bottom: 0;
  }
}

@media screen and (max-width: 600px) {
  .contact-links {
    display: flex;
    flex-direction: column;
  }

  .link {
    justify-content: center;
  }
}
</style>
