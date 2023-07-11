<template>
  <div class="rd-layout" ref="rdLayout">
    <rd-progress-bar
      v-if="route.name !== 'auth'"
      class="rd-loading"
      type="overlay"
      :state="routeLoading ? 'show' : 'hide'"
      :immediate="true"
      :fixed="true"
    />
    <nav ref="rdNavigation" class="rd-navigation">
      <div
        class="rd-navigation-company"
        @click="panelHandler({ state: 'show', type: 'company' })"
      >
        <div class="rd-navigation-company-logo-container">
          <img
            :src="
              company?.image
                ? `${config.public.apiBase}/files?name=${company._id}/${company.image._id}.${company.image.extension}&kind=company_image`
                : `${config.public.base}/logo.svg`
            "
            class="rd-navigation-company-image"
          />
        </div>
        <div class="rd-navigation-company-detail-container">
          <span class="rd-navigation-company-name rd-headline-5">{{
            company?.name || "Edit company here"
          }}</span>
          <span class="rd-navigation-company-category rd-caption-text">{{
            company?.field || "Company field"
          }}</span>
        </div>
      </div>
      <a
        v-for="link in links"
        :key="link.to"
        :href="link.to"
        class="rd-navigation-link"
        :class="route.path === link.to ? 'rd-navigation-link-active' : ''"
        @click.prevent="
          changeHandler({
            name: link.name,
            href: link.to,
          })
        "
      >
        <div class="rd-navigation-link-icon-container">
          <rd-svg :name="link.icon" class="rd-navigation-link-icon" />
        </div>
        <span class="rd-navigation-link-name rd-headline-5">{{
          link.title
        }}</span>
      </a>
      <div class="rd-navigation-theme-switch">
        <div class="rd-navigation-theme-switch-icon-container">
          <rd-svg
            class="rd-navigation-theme-switch-icon"
            name="weather-night"
          />
        </div>
        <span class="rd-navigation-theme-switch-name rd-headline-6"
          >Dark Mode</span
        >
        <rd-input-toggle
          class="rd-navigation-theme-switch-input"
          :input="themeInput"
        />
      </div>
    </nav>
    <section class="rd-section">
      <header
        class="rd-header"
        :class="view !== 'desktop' && menuScroll > 0 ? 'rd-header-active' : ''"
      >
        <h1
          v-if="view === 'desktop' && routeCurrent"
          ref="rdHeaderTitle"
          class="rd-header-title rd-headline-1"
        >
          {{ routeCurrent.title }}
        </h1>
        <div v-if="user" class="rd-header-action">
          <div v-if="view === 'desktop'" class="rd-header-action-profile">
            <span class="rd-header-action-profile-name rd-headline-5">{{
              user.name
            }}</span>
            <span class="rd-header-action-profile-role rd-headline-6">{{
              user.role[0].name
            }}</span>
          </div>
          <rd-input-button-small
            v-if="view !== 'desktop'"
            icon="dots"
            @clicked="menuHandler"
          />
          <rd-input-button-small v-if="view === 'desktop'" icon="account" />
          <rd-input-button-small icon="logout" @clicked="exit" />
        </div>
      </header>
      <main class="rd-main" ref="rdMain">
        <h1
          v-if="view !== 'desktop' && routeCurrent"
          ref="rdHeaderTitle"
          class="rd-header-title rd-headline-1"
        >
          {{ routeCurrent.title }}
        </h1>
        <nuxt-page
          @open-panel="panelHandler"
          @change-page="changeHandler"
          @shake="shake"
        />
      </main>
    </section>
    <rd-company-panel
      v-if="panelOpened === 'company'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-customer-panel
      v-if="panelOpened === 'customer'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-role-panel
      v-if="panelOpened === 'role'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-user-panel
      v-if="panelOpened === 'user'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-add-panel
      v-if="panelOpened === 'project-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-area-add-panel
      v-if="panelOpened === 'project-area-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-area-remove-panel
      v-if="panelOpened === 'project-area-remove'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-incident-remove-panel
      v-if="panelOpened === 'project-incident-remove'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-report-add-panel
      v-if="panelOpened === 'project-report-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-report-export-panel
      v-if="panelOpened === 'project-report-export'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-role-panel
      v-if="panelOpened === 'project-role'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-task-panel
      v-if="panelOpened === 'project-task'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-task-add-panel
      v-if="panelOpened === 'project-task-add'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-task-delete-panel
      v-if="panelOpened === 'project-task-delete'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-task-period-panel
      v-if="panelOpened === 'project-task-period'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
    <rd-project-user-panel
      v-if="panelOpened === 'project-user'"
      :state="panelState"
      :data="panelData[0]"
      @exit="panelHandler({ state: 'hide' })"
      @open-panel="panelHandler"
      @change-page="changeHandler"
    />
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { InputToggleOption } from "types/general";

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
  type PanelType =
    | "company"
    | "customer"
    | "role"
    | "user"
    | "project-add"
    | "project-area-add"
    | "project-area-remove"
    | "project-incident-remove"
    | "project-task"
    | "project-task-add"
    | "project-task-delete"
    | "project-task-period"
    | "project-report-add"
    | "project-report-export"
    | "project-role"
    | "project-user";

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
    {
      title: "Users",
      name: "users",
      href: "/users",
    },
    {
      title: "Customers",
      name: "customers",
      href: "/customers",
    },
  ];

  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();
  const { view, rem, init, theme, state, getTheme, setTheme } = useMain();
  const { company, getCompany } = useCompany();
  const { user, logout } = useUser();

  const rdLayout = ref<HTMLDivElement | undefined>(undefined);
  const rdMain = ref<HTMLDivElement | undefined>(undefined);
  const rdHeaderTitle = ref<HTMLDivElement | undefined>(undefined);
  const rdNavigation = ref<HTMLDivElement | undefined>(undefined);

  const panelState = ref<"idle" | "hide">("idle");
  const panelData = ref<any[]>([]);
  const panelOpened = ref<PanelType | undefined>(undefined);
  const panelSequence = ref<(PanelType | undefined)[]>([]);

  const menuOpened = ref<boolean>(false);
  const menuScroll = ref<number>(0);

  const routeChanging = ref<Route | undefined>(undefined);
  const routeLoading = ref<boolean>(true);
  const routeCurrent = computed<Route>(
    () => routes.find((a) => a.name === route?.name) || routes[0]
  );

  const themeInput = ref<InputToggleOption>({
    model: false,
  });

  const animate = {
    leavePage(
      rdMain: HTMLElement,
      rdHeaderTitle: HTMLElement,
      cb: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdMain, {
        opacity: 0,
        duration: 0.25,
      }).to(
        rdHeaderTitle,
        {
          opacity: 0,
          duration: 0.25,
        },
        "<0"
      );
    },
    enterPage(
      rdMain: HTMLElement,
      rdHeaderTitle: HTMLElement,
      cb?: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdMain, {
        opacity: 1,
        duration: 0.25,
      }).to(
        rdHeaderTitle,
        {
          opacity: 1,
          duration: 0.25,
        },
        "<0"
      );
    },
    openMenu(rdNavigation: HTMLElement): void {
      const tl: GSAPTimeline = gsap.timeline();

      tl.to(rdNavigation, {
        x: "100%",
        duration: 0.375,
        ease: "power2.out",
      });
    },
    closeMenu(rdNavigation: HTMLElement): void {
      const tl: GSAPTimeline = gsap.timeline();

      tl.to(rdNavigation, {
        x: 0,
        duration: 0.375,
        ease: "power2.inOut",
      });
    },
  };

  function panelHandler({ state, type, data }: PanelHandlerOption): void {
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
      panelOpened.value = undefined;
      let sequence: PanelHandlerOption["type"] = undefined;
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
  function changeHandler(to: Route, e?: MouseEvent): MouseEvent | undefined {
    if (!routeChanging.value && route.path !== (to.href || "/")) {
      state.value = "changing";
      routeChanging.value = routes.find((a) => a.name === to.name);
      if (routeChanging.value && rdMain.value && rdHeaderTitle.value) {
        animate.leavePage(rdMain.value, rdHeaderTitle.value, () => {
          router.push(to.href || "/");
        });
      }
    }
    return e;
  }
  function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
    if (e.matches) view.value = "mobile";
    else view.value = "desktop";
    rem.value = parseInt(getComputedStyle?.(document.body)?.fontSize) || 24;
  }
  function menuHandler(): void {
    if (rdNavigation.value) {
      if (!menuOpened.value) {
        menuOpened.value = true;
        animate.openMenu(rdNavigation.value);
      } else {
        menuOpened.value = false;
        animate.closeMenu(rdNavigation.value);
      }
    }
  }
  function exit(): void {
    logout();
    if (rdMain.value && rdHeaderTitle.value) {
      animate.leavePage(rdMain.value, rdHeaderTitle.value, () => {
        window.location.assign(`${config.public.base}/auth`);
      });
    }
  }
  function shake(): void {
    if (rdLayout.value) rdLayout.value.classList.add("rd-layout-shake");
    setTimeout(() => {
      if (rdLayout.value) rdLayout.value.classList.remove("rd-layout-shake");
    }, 500);
  }
  function scroll(): void {
    menuScroll.value = document.documentElement.scrollTop;
  }

  watch(
    () => view.value,
    (val, oldVal) => {
      if (val && oldVal) location.reload();
    }
  );
  watch(
    () => init.value,
    (val, oldVal) => {
      if (oldVal && !val) routeLoading.value = false;
    }
  );
  watch(
    () => state.value,
    (val, oldVal) => {
      if (oldVal === "changing" && val === "idle") {
        if (rdMain.value && rdHeaderTitle.value) {
          routeChanging.value = undefined;
          animate.enterPage(rdMain.value, rdHeaderTitle.value);
        }
        if (menuOpened.value) menuHandler();
      }
    }
  );
  watch(
    () => themeInput.value.model,
    (val) => {
      setTheme(val ? "dark" : "light");
      if (val) document.documentElement.classList.add("rd-dark");
      else document.documentElement.classList.remove("rd-dark");
    }
  );

  onBeforeMount(() => {
    getTheme();
    themeInput.value.model = theme.value === "dark";
    getCompany();
  });
  onMounted(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
    mediaQuery.addEventListener("change", resizeHandler);
    resizeHandler(mediaQuery);

    window.addEventListener("scroll", scroll);
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  });
</script>

<style lang="scss" scoped>
  .rd-layout {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: var(--background-depth-two-color);
    display: flex;
    .rd-loading {
      z-index: 2000;
    }
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

      .rd-navigation-company {
        position: relative;
        width: 100%;
        height: 6rem;
        padding: 2rem 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .rd-navigation-company-logo-container {
          position: relative;
          width: 2rem;
          height: 2rem;
          border-radius: 0.75rem;
          box-sizing: border-box;
          background: #fafafa;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            position: relative;
            width: 60%;
            height: 60%;
            object-fit: contain;
          }
        }
        .rd-navigation-company-detail-container {
          position: relative;
          width: calc(100% - 2.5rem);
          display: flex;
          flex-direction: column;
          span {
            position: relative;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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
        transition: 0.25s background-color, 0.25s opacity;
        opacity: 0.375;
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
          opacity: 1;
          span.rd-navigation-link-name {
            color: var(--font-secondary-color);
          }
        }
        &:hover {
          opacity: 1;
        }
      }
      .rd-navigation-theme-switch {
        position: absolute;
        bottom: 2rem;
        width: calc(100% - 4rem);
        border-radius: 0.75rem;
        border: var(--border);
        text-decoration: none;
        padding: 0.5rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        transition: 0.25s opacity;
        opacity: 0.375;
        .rd-navigation-theme-switch-icon-container {
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
        span.rd-navigation-theme-sitch-name {
          color: var(--font-main-color);
          text-decoration: none;
          transition: 0.25s color;
        }
        .rd-navigation-theme-switch-input {
          position: absolute;
          right: 0.75rem;
        }
        &:hover {
          opacity: 1;
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
        h1.rd-header-title {
          position: relative;
          height: 100%;
          white-space: nowrap;
          display: flex;
          align-items: center;
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
    &.rd-layout-shake {
      animation: rd-shake 0.25s infinite;
    }
    @media only screen and (max-width: 1024px) {
      min-height: auto;
      nav.rd-navigation {
        z-index: 3;
        position: fixed;
        left: -100%;
        width: 100vw;
        height: calc(100vh);
        height: calc(var(--vh, 1vh) * 100);
        padding: 5rem 1rem 1rem 1rem;
        box-sizing: border-box;
        touch-action: none;
        .rd-navigation-company {
          height: 3rem;
          padding: 0 0 2rem 0;
        }
        .rd-navigation-theme-switch {
          bottom: 1rem;
          width: calc(100% - 2rem);
        }
      }
      section.rd-section {
        height: auto;
        header.rd-header {
          z-index: 4;
          position: fixed;
          top: 0;
          height: 4rem;
          padding: 1rem;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0);
          transition: 0.25s background-color;
          .rd-header-action {
            width: 100%;
            justify-content: space-between;
          }
          &.rd-header-active {
            background: var(--background-depth-one-color);
          }
        }
        main.rd-main {
          z-index: 1;
          width: 100%;
          min-height: auto;
          padding-top: 4rem;
          box-sizing: border-box;
          flex-direction: column;
          h1.rd-header-title {
            position: relative;
            width: 100%;
            height: 2rem;
            padding: 0 1rem;
            margin: 1rem 0;
            box-sizing: border-box;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  :root {
    -webkit-tap-highlight-color: transparent;
    --primary-color: #ffd975;
    --secondary-color: #242529;
    --error-color: #ff584c;
    --warning-color: #ffd975;
    --success-color: #6bc785;
    --border-color: #fafafa;
    --font-main-color: #242529;
    --font-secondary-color: #242529;
    --font-sub-color: rgba(0, 0, 0, 0.375);
    --background-depth-one-color: #ffffff;
    --background-depth-two-color: #fafafa;
    --background-depth-three-color: #f0f0f0;
    --border: 1px solid var(--border-color);
    --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
  }
  ::-webkit-scrollbar {
    display: none;
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

    &.rd-dark {
      --primary-color: #fff37a;
      --warning-color: #fff37a;
      --background-depth-one-color: #2d2e32;
      --background-depth-two-color: #242529;
      --background-depth-three-color: #202124;
      --border-color: #242529;
      --box-shadow: 0 0.5rem 1rem rgba(15, 16, 17, 0.25);
      --font-main-color: #fdebdd;
      --font-secondary-color: #242529;
      --font-sub-color: rgba(253, 235, 221, 0.375);
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
