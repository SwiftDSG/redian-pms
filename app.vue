<template>
  <div class="rd-layout" ref="rdLayout">
    <rd-alert />
    <header v-if="user && viewMode !== 'desktop' && route.path !== '/login'" class="rd-header" ref="rdHeader">
      <button class="rd-header-navigation-button" @click="navigationHandler(navigationOpened ? 'close' : 'open')">
        <div class="rd-header-navigation-button-bar"></div>
        <div class="rd-header-navigation-button-bar"></div>
      </button>
    </header>
    <main @click="navigationHandler('close')" ref="rdBody" class="rd-body">

      <!-- <nuxt-page @shake="shake" @open-panel="panelHandler" /> -->
    </main>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

import { User } from "~~/interfaces/user.js";
import { Customer, CustomerRequest } from "~~/interfaces/customer.js";
interface NavigationLink {
  to: string;
  name: string;
  icon: string;
}
interface PanelHandlerOption {
  state: "show" | "hide";
  type?: PanelType;
  data?: any;
}

type PanelType =
  | "customer-form"
  | "employee-form"
  | "employee-role-form"
  | "product-form"
  | "product-details"
  | "product-stock-form"
  | "supplier-form"
  | "transaction-cancel"
  | "transaction-form"
  | "transaction-details"
  | "transaction-deliver-form"
  | "transaction-payment"
  | "transaction-payment-form"
  | "transaction-payment-fulfill"
  | "transaction-payment-warn";

const { user, login, refresh, logout } = useUser();
const { getCustomers, getCustomer, addCustomer } = useCustomer();
const { viewMode } = useMain();
const route = useRoute();

const rdLayout = ref<HTMLDivElement>(null);
const rdHeader = ref<HTMLElement>(null);
const rdNavigation = ref<HTMLElement>(null);
const rdOverview = ref<HTMLElement>(null);
const rdBody = ref<HTMLElement>(null);

const panelState = ref<"idle" | "hide">("idle");
const panelData = ref<any[]>([]);
const panelOpened = ref<PanelType>(null);
const panelSequence = ref<PanelType[]>([]);

const navigationAnim = ref<GSAPTimeline>(null);
const navigationOpened = ref<boolean>(false);
const navigationLinks: NavigationLink[] = [
  {
    to: "/",
    name: "Home",
    icon: "dashboard",
  },
  {
    to: "/inventory",
    name: "Inventory",
    icon: "inventory",
  },
  {
    to: "/transaction",
    name: "Transactions",
    icon: "transaction",
  },
  {
    to: "/employee",
    name: "Employees",
    icon: "account-multiple",
  },
  {
    to: "/customer",
    name: "Customers",
    icon: "customer",
  },
  {
    to: "/supplier",
    name: "Suppliers",
    icon: "supplier",
  },
];

const animate = {
  init(
    viewMode: "desktop" | "mobile",
    rdNavigation: HTMLElement,
    rdOverview: HTMLElement,
    rdHeader: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      tl.to([rdNavigation, rdOverview], {
        x: 0,
        duration: 0.5,
        ease: "power4.out",
      });
    }
  },
  exit(
    viewMode: "desktop" | "mobile",
    rdNavigation: HTMLElement,
    rdOverview: HTMLElement,
    rdHeader: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      tl.to(rdNavigation, {
        x: "-150%",
        duration: 0.5,
        ease: "power4.in",
      }).to(
        rdOverview,
        {
          x: "150%",
          duration: 0.5,
          ease: "power4.in",
        },
        "<0"
      );
    }
  },
  exitPage(rdBody: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
        setTimeout(() => {
          gsap.to(rdBody, {
            opacity: 1,
            duration: 0,
          });
        }, 250);
      },
    });

    tl.to(rdBody, {
      opacity: 0,
      duration: 0.25,
    });
  },
  navigationHandler(
    viewMode: "desktop" | "mobile",
    rdHeader: HTMLElement,
    rdNavigation: HTMLElement,
    rdBody: HTMLElement,
    cb?: () => void
  ): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline({
      paused: true,
      onComplete() {
        if (cb) cb();
      },
    });

    const rdNavigationButton: HTMLElement =
      viewMode === "desktop"
        ? rdNavigation.querySelector("button.rd-navigation-button")
        : rdHeader.querySelector("button.rd-header-navigation-button");
    const rdNavigationButtonBarOne: HTMLElement =
      rdNavigationButton.querySelector(
        viewMode === "desktop"
          ? ".rd-navigation-button-bar:first-child"
          : ".rd-header-navigation-button-bar:first-child"
      );
    const rdNavigationButtonBarTwo: HTMLElement =
      rdNavigationButton.querySelector(
        viewMode === "desktop"
          ? ".rd-navigation-button-bar:last-child"
          : ".rd-header-navigation-button-bar:last-child"
      );
    const rdNavigationLinkBackground: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-navigation-link-background")
    );
    const rdNavigationTextContainer: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-text-container")
    );
    const rdNavigationText: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-text")
    );

    if (viewMode === "desktop") {
      tl.to(rdNavigation, {
        width: "12.5rem",
        duration: 0.5,
        ease: "power4.inOut",
      })
        .to(
          rdNavigationLinkBackground,
          {
            width: "10.5rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationButton,
          {
            x: "6.5rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationTextContainer,
          {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationText,
          {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdBody,
          {
            scale: 0.875,
            opacity: 0.5,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        );
    } else {
      const rdNavigationBackground: HTMLElement = rdNavigation.querySelector(
        ".rd-navigation-background"
      );
      const rdNavigationLinks: HTMLElement[] = gsap.utils.toArray(
        rdNavigation.querySelectorAll("a.rd-navigation-link")
      );

      tl.to(
        rdBody,
        {
          scale: 0.75,
          opacity: 0.5,
          duration: 0.5,
          ease: "power4.inOut",
        },
        "<0"
      )
        .to(
          rdHeader,
          {
            x: "1rem",
            y: "1rem",
            width: "-=2rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationBackground,
          {
            width: "100%",
            height: "100%",
            borderRadius: "1rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationLinks,
          {
            opacity: 1,
            duration: 0.25,
          },
          "<0.25"
        );
    }

    tl.to(
      rdNavigationButtonBarOne,
      {
        x: "-0.375rem",
        width: 0,
        duration: 0.25,
      },
      "<0"
    )
      .to(
        rdNavigationButtonBarTwo,
        {
          x: "0.375rem",
          width: 0,
          duration: 0.25,
        },
        "<0"
      )
      .to(rdNavigationButtonBarOne, {
        y: "-0.375rem",
        rotateZ: 45,
        duration: 0,
      })
      .to(rdNavigationButtonBarTwo, {
        y: "-0.375rem",
        rotateZ: -45,
        duration: 0,
      })
      .to(rdNavigationButtonBarOne, {
        x: 0,
        y: 0,
        width: "0.75rem",
        duration: 0.25,
      })
      .to(
        rdNavigationButtonBarTwo,
        {
          x: 0,
          y: 0,
          width: "0.75rem",
          duration: 0.25,
        },
        "<0"
      );

    return tl;
  },
  overviewHandler(
    state: "show" | "hide",
    viewMode: "desktop" | "mobile",
    rdOverview: HTMLElement,
    cb?: () => void
  ): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      if (state === "hide") {
        tl.to(rdOverview, {
          opacity: 0,
          scale: 1.125,
          duration: 0.25,
          ease: "power2.inOut",
        });
      } else {
        tl.to(rdOverview, {
          opacity: 0,
          scale: 0.875,
          duration: 0,
        }).to(rdOverview, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.inOut",
        });
      }
    }

    return tl;
  },
};

function navigationHandler(state: "open" | "close"): void {
  if (user.value) {
    if (!navigationAnim.value)
      navigationAnim.value = animate.navigationHandler(
        viewMode.value,
        rdHeader.value,
        rdNavigation.value,
        rdBody.value,
        () => {
          navigationOpened.value = true;
        }
      );
    if (state === "open") {
      navigationAnim.value.play();
    } else {
      navigationOpened.value = false;
      navigationAnim.value.reverse();
    }
  }
}

function overviewHandler(state: "show" | "hide", cb?: () => void): void {
  animate.overviewHandler(state, viewMode.value, rdOverview.value, cb);
}

function panelHandler({ state, type, data }: PanelHandlerOption): void {
  if (state === "show") {
    panelSequence.value.unshift(type);
    if (panelSequence.value.length === 1) {
      panelState.value = "idle";
      overviewHandler("hide", () => {
        panelData.value.unshift(data);
        panelOpened.value = panelSequence.value[0];
      });
    } else {
      panelState.value = "hide";
      setTimeout(() => {
        panelData.value.unshift(data);
        panelOpened.value = panelSequence.value[0];
      }, 250);
    }
  } else {
    panelOpened.value = null;
    if (panelState.value === "hide") {
      panelState.value = "idle";
      if (panelSequence.value[0] === panelSequence.value[1]) {
        panelData.value.splice(1, 1);
        panelSequence.value.splice(1, 1);
      }
    } else {
      panelData.value.splice(0, 1);
      panelSequence.value.splice(0, 1);
      if (panelSequence.value[0]) {
        setTimeout(() => {
          panelOpened.value = panelSequence.value[0];
        }, 50);
      } else {
        overviewHandler("show");
      }
    }
  }
}

function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
  if (e.matches) viewMode.value = "mobile";
  else viewMode.value = "desktop";
}

function exit(): void {
  animate.exit(
    viewMode.value,
    rdNavigation.value,
    rdOverview.value,
    rdHeader.value,
    () => {
      logout();
      navigate("/login");
    }
  );
}

function shake(): void {
  rdLayout.value.classList.add("rd-layout-shake");
  setTimeout(() => {
    rdLayout.value.classList.remove("rd-layout-shake");
  }, 500);
}

function navigate(to: string): void {
  navigationHandler("close");
  animate.exitPage(rdBody.value, () => {
    navigateTo(to);
  });
}

watch(
  () => viewMode.value,
  (val, oldVal) => {
    if (val && oldVal) location.reload();
  }
);

watch(
  () => route.path,
  (val: string, oldVal: string) => {
    if (oldVal === "/login" && val) {
      setTimeout(() => {
        animate.init(
          viewMode.value,
          rdNavigation.value,
          rdOverview.value,
          rdHeader.value
        );
      }, 500);
    }
  }
);

async function submit() {
  const user: User = await login("kdwiheldy@gmail.com", "bb2109wyt01");

  setTimeout(() => {
    const payload: CustomerRequest = {
      name: "PT. Mencari Cinta Sejati",
      contact: {
        address: "Aja",
        email: "s",
        phone: "koko"
      },
      person: [{
        name: "Hendri",
        address: "jaksjdk",
        phone: "asd",
        email: "asd",
        role: "asd",
      }]
    }
    addCustomer(payload)
    setTimeout(() => {
      getCustomers()
      setTimeout(() => {
        getCustomer("64628b103724b46e6648c417")
      }, 1000);
    }, 1000);
  }, 1000);

}

onMounted(async () => {
  setTimeout(() => {
    submit();

  }, 1000);
});
</script>

<style lang="scss" scoped>
.rd-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--background-depth-two-color);
  display: flex;

  nav.rd-navigation {
    z-index: 2;
    position: fixed;
    top: 2rem;
    left: 2rem;
    width: 4rem;
    height: calc(100vh - 4rem);
    background: var(--primary-color);
    transform: translateX(-150%);
    border-radius: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-navigation-logo {
      position: relative;
      width: 4rem;
      height: 4rem;
      padding: 0 1.5rem;
      // padding: 0 1.75rem 0 1.25rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button.rd-navigation-button {
      cursor: pointer;
      position: absolute;
      top: 1rem;
      left: 3rem;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border-radius: 0.75rem;
      background: var(--background-depth-one-color);
      box-shadow: var(--box-shadow);
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;

      .rd-navigation-button-bar {
        pointer-events: none;
        position: absolute;
        width: 0.75rem;
        height: 1.5px;
        background: var(--font-color);

        &:first-child {
          transform: translateY(-0.125rem);
        }

        &:last-child {
          transform: translateY(0.125rem);
        }
      }
    }

    a.rd-navigation-link {
      cursor: pointer;
      position: relative;
      width: 100%;
      height: 2rem;
      padding-left: 1rem;
      margin-bottom: 0.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .rd-navigation-link-background {
        position: absolute;
        top: 0;
        left: 1rem;
        width: 2rem;
        height: 2rem;
        background: var(--background-depth-one-color);
        border-radius: 0.75rem;
        opacity: 0.1;
        transition: 0.25s opacity;
      }

      .rd-navigation-link-icon {
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      span.rd-navigation-link-name {
        position: absolute;
        left: 3rem;
        height: 2rem;
        color: #fff;
        display: flex;
        align-items: center;
        transition: 0.25s color;
      }

      &.rd-navigation-link-active {
        .rd-navigation-link-background {
          opacity: 1;
        }

        span.rd-navigation-link-name {
          color: var(--secondary-color);
        }
      }
    }
  }

  main.rd-body {
    z-index: 1;
    position: relative;
    width: calc(100vw - 23rem);
    margin-left: 6rem;
    padding: 2rem;
    box-sizing: border-box;
    display: flex;
    transform-origin: right 50vh;
  }

  section.rd-overview {
    z-index: 0;
    position: fixed;
    top: 2rem;
    right: 2rem;
    width: 15rem;
    height: calc(100vh - 4rem);
    background: var(--background-depth-three-color);
    border-radius: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    transform: translateX(150%);
  }

  &.rd-layout-shake {
    animation: rd-shake 0.25s infinite;
  }

  @media only screen and (max-width: 1024px) {
    header.rd-header {
      z-index: 3;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 5rem;
      padding: 1.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      button.rd-header-navigation-button {
        cursor: pointer;
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0;
        border-radius: 0.75rem;
        background: var(--background-depth-one-color);
        box-shadow: var(--box-shadow);
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;

        .rd-header-navigation-button-bar {
          pointer-events: none;
          position: absolute;
          width: 0.75rem;
          height: 1.5px;
          background: var(--font-color);

          &:first-child {
            // transform: translateY(-0.125rem) translateX(-0.5rem);
            transform: translateY(-0.125rem);
          }

          &:last-child {
            // transform: translateY(0.125rem) translateX(0.5rem);
            transform: translateY(0.125rem);
          }
        }
      }
    }

    nav.rd-navigation {
      pointer-events: none;
      top: 1.5rem;
      left: 1.5rem;
      width: calc(100vw - 3rem);
      height: calc(100vh - 3rem);
      padding-top: 4rem;
      background: transparent;
      transform: none;

      .rd-navigation-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 0.75rem;
        background: var(--primary-color);
      }

      a.rd-navigation-link {
        opacity: 0;

        .rd-navigation-link-background {
          width: calc(100vw - 5rem);
        }

        span.rd-navigation-link-name {
          span.rd-text-wrapper {
            span.rd-text-container {
              transform: translateX(0) translateY(0);

              span.rd-text {
                transform: translateX(0) translateY(0);
              }
            }
          }
        }
      }
    }

    main.rd-body {
      width: 100vw;
      margin: 0;
      padding: 5rem 1.5rem 1.5rem 1.5rem;
      transform-origin: center 50vh;
    }

    section.rd-overview {
      display: none;
    }
  }
}
</style>

<style lang="scss">
:root {
  --error-color: #fe5e47;
  --success-color: #08aa7c;
  // --font-color: #fff;
  --font-color: #000;
  --primary-color: #dcaf84;
  // --primary-color: #503216;
  --secondary-color: #775b59;
  // --background-depth-one-color: #301e0d;
  // --background-depth-two-color: #201409;
  // --background-depth-three-color: #100a04;
  // --background-depth-four-color: #503216;
  // --background-depth-five-color: #402812;
  --background-depth-one-color: #fff;
  --background-depth-two-color: #fbf5ef;
  --background-depth-three-color: #f6eadf;
  --background-depth-four-color: #f2e0cf;
  --background-depth-five-color: #edd5bf;
  // --box-shadow: 0 0.5rem 1rem rgba(50, 50, 50, 0.125);
  --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
}

html,
body {
  position: relative;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-family: "Quicksand", -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--font-color);
  overflow-x: hidden;

  @media only screen and (max-width: 1919px) and (min-width: 1600px) {
    font-size: 22px;
  }

  @media only screen and (max-width: 1599px) and (min-width: 1480px) {
    font-size: 21px;
  }

  @media only screen and (max-width: 1479px) and (min-width: 1380px) {
    font-size: 20px;
  }

  @media only screen and (max-width: 1379px) and (min-width: 1320px) {
    font-size: 19px;
  }

  @media only screen and (max-width: 1319px) and (min-width: 1024px) {
    font-size: 18px;
  }

  @media only screen and (max-width: 640px) {
    font-size: 24px;
  }

  @media only screen and (max-width: 320px) {
    font-size: 17px;
  }

  @media only screen and (max-width: 1024px) {
    height: auto;
    overflow-y: auto;
  }
}

.rd-headline-1 {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-headline-2 {
  font-size: 1rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-headline-3 {
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-headline-4 {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-headline-5 {
  font-size: 0.65rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-headline-6 {
  font-size: 0.55rem;
  font-weight: 700;
  font-family: "Quicksand";
}

.rd-subtitle-text {
  font-size: 0.65rem;
  font-weight: 500;
  font-family: "Quicksand";
}

.rd-body-text {
  font-size: 0.6rem;
  font-weight: 500;
  font-family: "Quicksand";
}

.rd-caption-text {
  font-size: 0.55rem;
  font-family: "Quicksand";
  font-weight: 500;
}

.rd-button-text {
  font-family: "Quicksand";
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.125rem;
  transform: translateX(0.0625rem);
}

span.rd-text-wrapper,
span.rd-word-wrapper,
span.rd-letter-wrapper,
span.rd-image-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  span.rd-text-container,
  span.rd-word-container,
  span.rd-letter-container,
  span.rd-image-container {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    &.rd-text-container-up,
    &.rd-word-container-up,
    &.rd-letter-container-up,
    &.rd-image-container-up {
      transform: translateY(-100%);

      span.rd-text,
      span.rd-word,
      span.rd-letter,
      img.rd-image {
        transform: translateY(100%);

        &.rd-image:not(.rd-image-contain) {
          transform: translateY(100%) scale(1.25);
        }

        &.rd-image-contain {
          object-fit: contain;
          transform: translateY(100%) scale(1);
        }
      }
    }

    &.rd-text-container-down,
    &.rd-word-container-down,
    &.rd-letter-container-down,
    &.rd-image-container-down {
      transform: translateY(100%);

      span.rd-text,
      span.rd-word,
      span.rd-letter,
      img.rd-image {
        transform: translateY(-100%);

        &.rd-image:not(.rd-image-contain) {
          transform: translateY(-100%) scale(1.25);
        }

        &.rd-image-contain {
          object-fit: contain;
          transform: translateY(-100%) scale(1);
        }
      }
    }

    &.rd-text-container-left,
    &.rd-word-container-left,
    &.rd-letter-container-left,
    &.rd-image-container-left {
      transform: translateX(-100%);

      span.rd-text,
      span.rd-word,
      span.rd-letter,
      img.rd-image {
        transform: translateX(100%);

        &.rd-image:not(.rd-image-contain) {
          transform: translateX(100%) scale(1.25);
        }

        &.rd-image-contain {
          object-fit: contain;
          transform: translateX(100%) scale(1);
        }
      }
    }

    &.rd-text-container-right,
    &.rd-word-container-right,
    &.rd-letter-container-right,
    &.rd-image-container-right {
      transform: translateX(100%);

      span.rd-text,
      span.rd-word,
      span.rd-letter,
      img.rd-image {
        transform: translateX(-100%);

        &.rd-image:not(.rd-image-contain) {
          transform: translateX(-100%) scale(1.25);
        }

        &.rd-image-contain {
          object-fit: contain;
          transform: translateX(-100%) scale(1);
        }
      }
    }
  }
}

span.rd-image-wrapper {
  width: 100%;
  height: 100%;

  span.rd-image-container {
    width: 100%;
    height: 100%;

    img.rd-image {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.25);
    }
  }
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
  padding: 0;
}

@keyframes rd-loading {
  0% {
    left: 0;
    right: 100%;
  }

  50% {
    left: 0;
    right: 0;
  }

  100% {
    left: 100%;
    right: 0;
  }
}

@keyframes rd-shake {
  0% {
    transform: translate(1px, 1px);
  }

  10% {
    transform: translate(-1px, -2px);
  }

  20% {
    transform: translate(-3px, 0px);
  }

  30% {
    transform: translate(3px, 2px);
  }

  40% {
    transform: translate(1px, -1px);
  }

  50% {
    transform: translate(-1px, 2px);
  }

  60% {
    transform: translate(-3px, 1px);
  }

  70% {
    transform: translate(3px, 1px);
  }

  80% {
    transform: translate(-1px, -1px);
  }

  90% {
    transform: translate(1px, 2px);
  }

  100% {
    transform: translate(1px, -2px);
  }
}

@keyframes rd-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes rd-circular-rotate {
  0% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(-140deg);
  }

  100% {
    transform: rotate(0);
  }
}
</style>
