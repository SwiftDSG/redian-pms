<template>
  <div class="rd-layout" ref="rdLayout">
    <nav class="rd-navigation">
      <div class="rd-navigation-logo-container">
        <rd-svg name="logo" class="rd-navigation-logo" />
      </div>
      <a v-for="link in links" :key="link.to" :href="link.to" class="rd-navigation-link"
        :class="route.path === link.to ? 'rd-navigation-link-active' : ''" @click.prevent="
          changeHandler({
            name: link.name,
            href: link.to,
          })
          ">
        <div class="rd-navigation-link-icon-container">
          <rd-svg :name="link.icon" class="rd-navigation-link-icon" />
        </div>
        <span class="rd-navigation-link-name rd-headline-5">{{
          link.title
        }}</span>
      </a>
    </nav>
    <section class="rd-section">
      <header class="rd-header">
        <div class="rd-header-title-container" ref="rdHeaderTitle">
          <h1 v-if="routeCurrent" class="rd-header-title rd-headline-1">
            {{ routeCurrent.title }}
          </h1>
          <h1 v-if="routeChanging" class="rd-header-title rd-header-title-decoy rd-headline-1">
            {{ routeChanging.title }}
          </h1>
        </div>
        <div class="rd-header-action">
          <div v-if="viewMode === 'desktop'" class="rd-header-action-profile">
            <span class="rd-header-action-profile-name rd-headline-5">John Doe</span>
            <span class="rd-header-action-profile-role rd-headline-6">Owner</span>
          </div>
          <rd-input-button-small v-if="viewMode !== 'desktop'" icon="account" />
          <rd-input-button-small v-if="viewMode === 'desktop'" icon="account" />
          <rd-input-button-small v-if="viewMode === 'desktop'" icon="bell" />
          <rd-input-button-small icon="dots" />
        </div>
      </header>
      <main class="rd-main" ref="rdMain">
        <nuxt-page @open-panel="panelHandler" @change-page="changeHandler" />
      </main>
    </section>
    <rd-project-area-add-panel v-if="panelOpened === 'project-area-add'" :state="panelState" :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })" @open-panel="panelHandler" @change-page="changeHandler" />
    <rd-project-task-add-panel v-if="panelOpened === 'project-task-add'" :state="panelState" :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })" @open-panel="panelHandler" @change-page="changeHandler" />
  </div>
</template>

<script lang="ts" setup>
import { gsap } from "gsap";
import { User } from "~~/types/user.js";
const { user, login } = useUser();

type Link = {
  title: string;
  name: string;
  icon: string;
  to: string;
};
type Route = {
  title?: string;
  name: string;
  href: string;
};
type PanelHandlerOption = {
  state: "show" | "hide";
  type?: PanelType;
  data?: any;
};
type PanelType = "project-area-add" | "project-task-add";

const links: Link[] = [
  {
    title: "Dashboard",
    name: "index",
    icon: "dashboard",
    to: "/",
  },
  {
    title: "Projects",
    name: "projects",
    icon: "list",
    to: "/projects",
  },
  {
    title: "Users",
    name: "users",
    icon: "account-multiple",
    to: "/users",
  },
  {
    title: "Customers",
    name: "customers",
    icon: "account-circle",
    to: "/customers",
  },
];
const routes: Route[] = [
  {
    title: "Dashboard",
    name: "index",
    href: "/",
  },
  {
    title: "Projects",
    name: "projects",
    href: "/projects",
  },
  {
    title: "Project Overview",
    name: "projects-project_id",
    href: "/projects/[]",
  },
];

const route = useRoute();
const router = useRouter();
const { viewMode, rem } = useMain();
const { refresh } = useUser();

const routeCurrent = computed<Route>(() => {
  return routes.find((a) => a.name === route.name);
});
const routeChanging = ref<Route>(null);

const rdMain = ref<HTMLDivElement>(null);
const rdHeaderTitle = ref<HTMLDivElement>(null);

const panelState = ref<"idle" | "hide">("idle");
const panelData = ref<any[]>([]);
const panelOpened = ref<PanelType>(null);
const panelSequence = ref<PanelType[]>([]);

const animate = {
  leavePage(
    rdMain: HTMLElement,
    rdHeaderTitle: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete: () => {
        if (cb) cb();
        setTimeout(() => {
          rdHeaderTitleActual.removeAttribute("style");
          // rdHeaderTitleDecoy.removeAttribute("style");
        }, 50);
      },
    });

    const rdHeaderTitleActual = rdHeaderTitle.children[0];
    const rdHeaderTitleDecoy = rdHeaderTitle.children[1];

    tl.to(rdMain, {
      opacity: 0,
      duration: 0.25,
    })
      .to(
        rdHeaderTitleDecoy,
        {
          top: "-=2rem",
          opacity: 1,
          duration: 0.25,
          ease: "power2.inOut",
        },
        "<0"
      )
      .to(
        rdHeaderTitleActual,
        {
          top: "-=2rem",
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
        },
        "<0"
      );
  },
  enterPage(rdMain: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete: cb,
    });

    tl.to(rdMain, {
      opacity: 1,
      duration: 0.25,
    });
  },
};

function panelHandler({ state, type, data }: PanelHandlerOption): void {
  console.log(state);
  if (state === "show") {
    if (panelSequence.value.length === 0) {
      panelState.value = "idle";
      panelSequence.value.unshift(type);
      panelData.value.unshift(data || {});
      panelOpened.value = panelSequence.value[0];
    } else {
      panelState.value = "hide";
      panelSequence.value.push(type);
      panelData.value.push(data || {});
    }
  } else {
    panelOpened.value = null;
    let sequence: PanelHandlerOption["type"] = null;
    let payload: PanelHandlerOption["data"] = null;
    if (panelState.value === "hide") {
      panelState.value = "idle";
      sequence = panelSequence.value.pop();
      payload = panelData.value.pop();
      if (sequence === panelSequence.value[0]) {
        panelData.value.splice(0, 1);
        panelSequence.value.splice(0, 1);
      }
    } else {
      panelState.value = "hide";
      panelData.value.splice(0, 1);
      panelSequence.value.splice(0, 1);
      sequence = panelSequence.value.pop();
      payload = panelData.value.pop();
    }
    if (sequence) {
      setTimeout(() => {
        panelState.value = "idle";
        panelSequence.value.unshift(sequence);
        panelData.value.unshift(payload || {});
        panelOpened.value = panelSequence.value[0];
      }, 50);
    }
  }
}
function changeHandler(to: Route, e?: MouseEvent): MouseEvent {
  if (!routeChanging.value) {
    routeChanging.value = routes.find((a) => a.name === to.name);
    if (routeChanging.value) {
      setTimeout(() => {
        animate.leavePage(rdMain.value, rdHeaderTitle.value, () => {
          if (route.path !== (to.href || "/")) {
            router.push(to.href || "/");
            setTimeout(() => {
              routeChanging.value = null;
              animate.enterPage(rdMain.value);
            }, 150);
          }
        });
      }, 100);
    }
  }
  return e;
}
function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
  if (e.matches) viewMode.value = "mobile";
  else viewMode.value = "desktop";
  rem.value = parseInt(getComputedStyle?.(document.body)?.fontSize) || 24;
}

watch(
  () => viewMode.value,
  (val, oldVal) => {
    if (val && oldVal) location.reload();
  }
);
async function submit() { // MUST DELETE LATER!!!
  const user: User = await login("kdwiheldy@gmail.com", "bb2109wyt01");
}
onMounted(() => {
  const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
  mediaQuery.addEventListener("change", resizeHandler);
  submit(); // MUST DELETE LATER!!!
  resizeHandler(mediaQuery);
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
    position: relative;
    width: 15rem;
    height: 100vh;
    background-color: var(--background-depth-one-color);
    border-right: var(--border);
    padding: 0 2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-navigation-logo-container {
      position: relative;
      width: 100%;
      height: 6rem;
      padding: 2rem 0;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .rd-navigation-logo {
        position: relative;
        height: 100%;
      }
    }

    a.rd-navigation-link {
      cursor: pointer;
      position: relative;
      width: 100%;
      border-radius: 0.75rem;
      border: var(--border);
      text-decoration: none;
      padding: 0.5rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      transition: 0.25s background-color;

      .rd-navigation-link-icon-container {
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        border: var(--border);
        box-sizing: border-box;
        margin-right: 0.5rem;
        background-color: var(--background-depth-one-color);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      span.rd-navigation-link-name {
        color: var(--font-main-color);
        text-decoration: none;
        transition: 0.25s color;
      }

      &.rd-navigation-link-active {
        background-color: var(--primary-color);

        span.rd-navigation-link-name {
          color: var(--font-secondary-color);
        }
      }
    }
  }

  section.rd-section {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    header.rd-header {
      position: relative;
      width: 100%;
      height: 6rem;
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rd-header-title-container {
        position: relative;
        width: 10rem;
        height: 100%;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;

        // overflow: hidden;
        h1.rd-header-title {
          position: relative;
          height: 100%;
          white-space: nowrap;
          display: flex;
          align-items: center;

          &.rd-header-title-decoy {
            pointer-events: none;
            position: absolute;
            top: 100%;
            opacity: 0;
          }
        }
      }

      .rd-header-action {
        position: relative;
        height: 100%;
        display: flex;
        gap: 0.5rem;

        .rd-header-action-profile {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;

          span.rd-header-action-profile-role {
            position: relative;
            height: 1rem;
            padding: 0 0.5rem;
            border-radius: 0.5rem;
            box-sizing: border-box;
            background-color: var(--primary-color);
            color: var(--font-secondary-color);
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    main.rd-main {
      position: relative;
      width: 100%;
      min-height: calc(100% - 6rem);
      display: flex;
    }
  }

  @media only screen and (max-width: 1024px) {
    nav.rd-navigation {
      position: absolute;
      left: -100%;
      top: 0;
      width: 100vw;
      height: 100vh;
    }

    section.rd-section {
      header.rd-header {
        position: relative;
        height: auto;
        padding: 1rem;
        flex-direction: column-reverse;

        .rd-header-action {
          width: 100%;
          margin-bottom: 1rem;
          justify-content: space-between;
        }

        .rd-header-title-container {
          width: 100%;
          height: 2rem;
        }
      }
    }
  }
}
</style>

<style lang="scss">
:root {
  -webkit-tap-highlight-color: transparent;
  --primary-color: #000;
  --secondary-color: #fff;
  // --secondary-color: #fff37c;
  --error-color: #ff584c;
  --warning-color: #ffc904;
  --success-color: #6bc785;
  --border-color: #cfcfcf;
  --font-main-color: #000;
  --font-secondary-color: #fff;
  --font-sub-color: rgba(0, 0, 0, 0.375);
  --background-depth-one-color: #ffffff;
  --background-depth-two-color: #efefef;
  --background-depth-three-color: #dfdfdf;
  --border: 1px solid var(--border-color);
  --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
  // @media (prefers-color-scheme: dark) {
  //   --background-depth-one-color: #290e17;
  //   --background-depth-two-color: #36121f;
  //   --background-depth-three-color: #3e1422;
  //   --border-color: #4a2532;
  //   --box-shadow: 0 0.5rem 1rem rgba(56, 56, 56, 0.125);
  //   --font-main-color: #bba5ad;
  // }
}

html,
body {
  position: relative;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--font-main-color);
  background: var(--background-depth-two-color);
  overflow-x: hidden;

  @media only screen and (max-width: 1900px) and (min-width: 1600px) {
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

    .rd-title-1 {
      font-size: 1.25rem;
    }

    .rd-title-2 {
      font-size: 1.125rem;
    }
  }
}

.rd-title-1 {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: "Poppins";
}

.rd-title-2 {
  font-size: 1.375rem;
  font-weight: 700;
  font-family: "Poppins";
}

.rd-headline-1 {
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-headline-2 {
  font-size: 1rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-headline-3 {
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-headline-4 {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-headline-5 {
  font-size: 0.65rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-headline-6 {
  font-size: 0.55rem;
  font-weight: 600;
  font-family: "Poppins";
}

.rd-subtitle-text {
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Poppins";
}

.rd-body-text {
  font-size: 0.6rem;
  font-weight: 500;
  font-family: "Poppins";
}

.rd-caption-text {
  font-size: 0.55rem;
  font-family: "Poppins";
  font-weight: 500;
  color: var(--font-main-color);
  opacity: 0.5;
}

.rd-button-text {
  font-family: "Poppins";
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
