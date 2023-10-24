import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Pages from "../components/Pages";
import Main from "../views/layout/Main.vue";

import db from "./../db";
import { constants } from "./../config";

import menuDefs from "./../menus";

const getRedirectRouteName = currentRoute => {
  const { activeRole } = db.get(constants.USER) || {};
  if (!activeRole) return (window.location = "/");

  let routeName = "Dashboard";
  const roleMenus = menuDefs[activeRole];
  if (!roleMenus) return routeName;

  const menu = roleMenus.find(menu => menu.route.name === currentRoute);
  return menu ? menu.route.name : roleMenus[0].route.name;
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/account/confirm",
    name: "ConfirmRegistration",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/account/Confirm.vue")
  },
  {
    path: "/pages/governors-address",
    name: "pages",
    component: () => import("../views/pages/GovernorsAddress.vue")
  },
  {
    path: "/pages/office-the-es",
    name: "pages",
    component: () => import("../views/pages/OfficeOfTheES.vue")
  },
  {
    path: "/pages/our-agency",
    name: "pages",
    component: () => import("../views/pages/OurAgency.vue")
  },
  {
    path: "/pages/health-plan-benefits",
    name: "pages",
    component: () => import("../views/pages/HealthPlanBenefits.vue")
  },
  {
    path: "/pages/contact-us",
    name: "pages",
    component: () => import("../views/pages/ContactUs.vue")
  },
  // {
  //   path: "/#statistics",
  //   name: "Statistics",
  //   component: () => import("../views/home/Statistics.vue")
  // },
  {
    path: "/pages/:slug",
    name: "pages",
    component: Pages
  },
  
  {
    path: "/adoption-payment-status",
    name: "AdoptionPaymentStatus",
    component: () => import("../views/apps/AdoptionPaymentStatus.vue")
  },
  {
    path: "/pay",
    name: "PayWithVoucher",
    component: () =>
      import(/* webpackChunkName: "pay" */ "../views/apps/PayWithVoucher.vue")
  },
  {
    path: "",
    name: "apps",

    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/Dashboard.vue")
      },
      {
        path: "adoptees",
        name: "MyAdoptees",
        component: () => import("../views/apps/AdopteesRequest.vue")
      },
      // {
      //   path: "update-profile",
      //   name: "UpdateProfile",
      //   component: () => import("../views/apps/UpdateProfile.vue")
      // },
      {
        path: "view-profile",
        name: "ViewProfile",
        component: () => import("../views/apps/UpdateProfile.vue")
      },
      {
        path: "manage-pages",
        name: "ManagePages",
        component: () => import("../views/apps/ManagePages.vue"),
        meta: {
          guardRoute: true
        }
      },
      {
        path: "manage-pages/new",
        name: "CreatePage",
        component: () => import("../views/apps/pages/CreatePage.vue"),
        meta: {
          guardRoute: true
        }
      },
      {
        path: "manage-pages/:id",
        name: "EditPage",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/pages/EditPage.vue")
      },
      {
        path: "adoptions",
        name: "MyAdoptions",
        component: () => import("../views/apps/Adoptions.vue")
      },
      {
        path: "adoptions/:id",
        name: "AdoptionInfo",
        component: () => import("../views/apps/AdoptionInfo.vue")
      },
      {
        path: "adoptions/:id",
        name: "DonationInfo",
        component: () => import("../views/apps/DonationInfo.vue")
      },
      {
        path: "adopt",
        name: "Adopt",
        component: () => import("../views/apps/Adoption.vue")
      },
      {
        path: "payment-status",
        name: "PaymentStatus",
        component: () => import("../views/apps/PaymentStatus.vue")
      },
      {
        path: "patients",
        name: "Patients",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/Patients.vue")
      },
      {
        path: "patients/checkin",
        name: "CheckinPatient",
        component: () => import("../views/apps/CheckinPatient.vue")
      },
      {
        path: "patients/:id",
        name: "PatientInfo",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/PatientInfo.vue")
      },
      {
        path: "/doctors",
        name: "Doctors",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/apps/Doctors.vue")
      },
      {
        path: "/users",
        name: "ManageUsers",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/apps/Users.vue")
      },
      {
        path: "/vision-board-stats",
        name: "ManageVisionBoard",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/apps/VisionBoardStats.vue")
      },
      {
        path: "/depts",
        name: "Departments",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/apps/Departments.vue")
      },
      {
        path: "health-plans",
        name: "HealthPlans",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/HealthPlans.vue")
      },
      {
        path: "hospitals",
        name: "Hospitals",
        meta: {
          guardRoute: true
        },
        component: () => import("../views/apps/Hospitals.vue")
      },
      {
        path: "/logs/adoptions",
        name: "AdoptionLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/Adoption.vue")
      },
      {
        path: "/logs/adoptee-info-requests",
        name: "AdopteeInfoRequestLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/AdopteeInfoRequests.vue")
      },
      {
        path: "/logs/donors",
        name: "DonorLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/Donors.vue")
      },
      {
        path: "/logs/payments",
        name: "PaymentLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/Payments.vue")
      },
      {
        path: "/logs/subscriptions",
        name: "SubscriptionLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/Subscriptions.vue")
      },
      {
        path: "/logs/hospitals/checkins",
        name: "CheckinLogs",
        meta: {
          guardRoute: true
        },
        component: () => import("./../views/logs/HospitalCheckins.vue")
      }
    ],
    component: Main
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const { guardRoute } = to.meta;

  if (!guardRoute) return next();

  const routeName = getRedirectRouteName(to.name);
  if (routeName !== to.name)
    return next({
      name: routeName
    });

  next();
});

export default router;
