<template>
  <div class="page-governors-address">
    <div class="jumbotron">
      <div class="container mx-auto">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <section class="flex flex--column flex--items-center">
              <h2
                class="main-heading text--center text--white text--bold"
              >FROM THE DESK OF THE EXECUTIVE SECRETARY</h2>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="address">
      <div class="container mx-auto">
        <p>
          Anambra State Health Insurance Scheme is a veritable platform to give every resident of Anambra State access to healthcare that is of good quality and affordable from a network of equitably distributed healthcare facilities. Since the commencement of operation, in January 2019, we have enrolled over 184,000 persons into this scheme. We have financed almost one million hospital visits including payment for surgeries and deliveries for a significant proportion. The scheme has drastically reduced out-of-pocket health expenditure in Anambra state, while improving the health-seeking behavior of our people. This has resulted in reduced morbidity and mortality for our people.
        </p>
        <p>
          Anambra State Health Insurance Agency (ASHIA) has innovatively developed a system for payment of premium for persons in the informal sector, termed “Adoption Model”. This enables persons of means and philanthropic spirit to pay premium for vulnerable and less privileged members of our communities in an adopter-adoptee relationship. The adoption model has brought in over 30,000 enrollees into our scheme. This has provided financial risk-protection for minimum 30,000 households in the State.
        </p>
        <p>
          To enable more persons to be adopted into our scheme by men and women of goodwill as well as corporate organizations in search of objective avenues for corporate social responsibility, we have developed this mobile adoption tree with the support of the European Union and WHO. In doing this, we collaborated with the National Social Safety Coordinating Office of the Federal Ministry of Humanitarian Affairs, to enumerate vulnerable members of our communities using the World Bank Community Based Target approach. This list has been uploaded here for your use in paying premium for these persons who ordinarily cannot do it for themselves.
        </p>
        <p>
          Additionally, we have developed a system that would enable our people to pay their ASHIA premium in installments using an electronic wallet system that will save their contribution until they complete the required amount for activation of their insurance with the scheme. This is a major revolution in health insurance business in Nigeria.
I hereby invite you all to surf this space with us as we serve you better. ASHIA is here to make access to quality health fiat accompli for all residents of Anambra State.

        </p>
        <footer class="flex justify--space-between flex--items-center">
          <div class="footer-logo">
            <img src="/assets/img/anambra-state-logo.jpg" alt="Anambra state logo" />
          </div>
          <div class="footer-text">
            <h3 class="text--bold mb-0">Simeon Onyemaechi, MBBS, PhD</h3>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jumbotron {
  padding: 220px 0px;
  background: url(/assets/img/dr-simeon-onyemaechi.jpg) center center no-repeat;
  background-size: cover;

  .main-heading {
    font-size: 60px;
    line-height: 1.1;
  }
}

p {
  font-size: 18px;
}

.footer-logo {
  max-width: 160px;
}

.info p {
  font-size: 24px;
  line-height: 1.1;
}

footer {
  padding-bottom: 30px;
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

  footer {
    flex-direction: column;
    align-items: center;
  }
}
</style>
