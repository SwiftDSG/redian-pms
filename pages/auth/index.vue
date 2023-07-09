<template>
  <div class="rd-container">
    <div v-if="createUser === false" class="rd-panel" ref="rdPanel">
      <div class="rd-panel-logo-container">
        <rd-svg name="logo" color="primary" />
      </div>
      <div class="rd-panel-title-container">
        <h1 class="rd-panel-title rd-headline-1">Welcome back</h1>
        <p class="rd-panel-subtitle rd-headline-5">
          Please fill in your credentials to continue.
        </p>
      </div>
      <form class="rd-panel-form" @keypress.enter.prevent="submit">
        <div class="rd-panel-form-input-wrapper">
          <rd-input-text class="rd-panel-form-input" :input="emailInput" />
        </div>
        <div class="rd-panel-form-input-wrapper">
          <rd-input-text class="rd-panel-form-input" :input="passwordInput" />
        </div>
        <div class="rd-panel-form-input-wrapper" style="margin-top: 1rem">
          <rd-input-button
            class="rd-panel-form-input"
            label="Login"
            :disabled="!email || !password"
            :loading="submitLoading"
            @clicked="submit"
          />
        </div>
      </form>
    </div>
    <div v-else-if="createUser === true" class="rd-panel" ref="rdPanel">
      <div class="rd-panel-logo-container">
        <rd-svg name="logo" color="primary" />
      </div>
      <div class="rd-panel-title-container">
        <h1 class="rd-panel-title rd-headline-1">Welcome!</h1>
        <p class="rd-panel-subtitle rd-headline-5">
          Fill your information below to create an owner account
        </p>
      </div>
      <form class="rd-panel-form" @keypress.enter.prevent="submit">
        <div class="rd-panel-form-input-wrapper">
          <rd-input-text class="rd-panel-form-input" :input="nameInput" />
        </div>
        <div class="rd-panel-form-input-wrapper">
          <rd-input-text class="rd-panel-form-input" :input="emailInput" />
        </div>
        <div class="rd-panel-form-input-wrapper">
          <rd-input-text class="rd-panel-form-input" :input="passwordInput" />
        </div>
        <div class="rd-panel-form-input-wrapper" style="margin-top: 1rem">
          <rd-input-button
            class="rd-panel-form-input"
            label="Submit"
            :disabled="!email || !password || (!!createUser && !name)"
            :loading="submitLoading"
            @clicked="submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { InputOption, View } from "~~/types/general";
  import { gsap } from "gsap";

  const { view, init } = useMain();
  const { login, getUsers, createUser: createOwner } = useUser();
  const router = useRouter();
  const emits = defineEmits(["shake"]);

  definePageMeta({
    middleware: ["no-auth"],
  });

  const rdPanel = ref<HTMLDivElement>();

  const submitLoading = ref<boolean>(false);
  const createUser = ref<boolean | null>(null);

  const nameInput = ref<InputOption>({
    name: "name",
    placeholder: "John Doe",
    model: "",
    label: "Your name",
    icon: "account",
    error: "",
  });
  const emailInput = ref<InputOption>({
    name: "email",
    placeholder: "somebody@example.com",
    model: "",
    label: "Email Address",
    icon: "at",
    type: "email",
    error: "",
  });
  const passwordInput = ref<InputOption>({
    name: "password",
    placeholder: "hush...",
    model: "",
    label: "Password",
    icon: "key",
    type: "password",
    error: "",
  });

  const name = computed<string>(() => nameInput.value.model);
  const email = computed<string>(() => emailInput.value.model);
  const password = computed<string>(() => passwordInput.value.model);

  const animate = {
    exit(view: View, rdPanel: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      if (view === "desktop") {
        tl.to(rdPanel, {
          scale: 1.125,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      } else {
        tl.to(rdPanel, {
          y: "150%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
  };
  async function submit() {
    if (email.value && password.value && !submitLoading.value) {
      submitLoading.value = true;
      if (createUser.value) {
        const payload = {
          request: {
            name: name.value,
            email: email.value,
            password: password.value,
          },
        };
        await createOwner(payload);
      }
      const user = await login(email.value, password.value);

      setTimeout(() => {
        submitLoading.value = false;
        if (user) {
          exit("/");
        } else {
          emits("shake");
        }
      }, 1000);
    }
  }

  function exit(path: string = "/"): void {
    setTimeout(() => {
      if (rdPanel.value)
        animate.exit(view.value, rdPanel.value, () => {
          router.push(path);
        });
    }, 100);
  }

  watch(
    () => rdPanel.value,
    (val) => {
      if (val) {
        if (view.value === "mobile") {
          gsap.to(val, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          });
        } else {
          gsap.to(val, {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      }
    }
  );

  onMounted(async () => {
    createUser.value = !(await getUsers())?.length;
    init.value = false;
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background-depth-two-color);
    .rd-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16rem;
      background: var(--background-depth-one-color);
      border-radius: 1rem;
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transform: translate(-50%, -50%);
      opacity: 0;
      .rd-panel-logo-container {
        position: relative;
        height: 2rem;
        margin-bottom: 0.75rem;
        display: flex;
      }
      .rd-panel-title-container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        h1.rd-panel-title {
          position: relative;
          text-align: center;
        }
        p.rd-panel-subtitle {
          position: relative;
          text-align: center;
          margin-top: 0.5rem;
          opacity: 0.5;
        }
      }
      form.rd-panel-form {
        position: relative;
        width: 100%;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        .rd-panel-form-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          .rd-panel-form-input {
            width: 100%;
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      .rd-panel {
        top: auto;
        bottom: 0;
        left: 0;
        width: 100vw;
        transform: translateY(150%);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background: var(--background-depth-one-color);
      }
    }
  }
</style>
