<template>
  <rd-panel
    class="rd-panel"
    label="Edit profile"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-image :input="imageInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="passwordInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { UserRequest } from "types/user";
  import { InputFileOption, InputOption } from "~~/types/general";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const config = useRuntimeConfig();
  const { user, updateUser } = useUser();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const imageInput = ref<InputFileOption>({
    file: undefined,
    label: "Picture",
    type: "image",
  });
  const nameInput = ref<InputOption>({
    label: "Name",
    name: "name",
    model: "",
    placeholder: "PT. Redian Grup Sejahtera",
  });
  const passwordInput = ref<InputOption>({
    label: "Password",
    name: "field",
    type: "password",
    model: "",
    placeholder: "Fill in to update your password",
  });

  const name = computed<UserRequest["name"]>(() => nameInput.value.model);
  const password = computed<UserRequest["password"]>(
    () => passwordInput.value.model || "*"
  );
  const image = computed<UserRequest["image"]>(() =>
    imageInput.value.file
      ? {
          extension: imageInput.value.file.type,
        }
      : undefined
  );
  const image_photo = computed<UserRequest["image_photo"]>(
    () => imageInput.value.file
  );
  async function submit(): Promise<void> {
    if (user.value) {
      loading.value = true;

      const payload = {
        user_id: user.value._id,
        request: {
          email: user.value.email,
          name: name.value,
          password: password.value,
          image: image.value,
          image_photo: image_photo.value,
        },
      };
      await updateUser(payload);

      loading.value = false;
      panelState.value = "hide";
    }
  }
  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    if (user.value) {
      nameInput.value.model = user.value.name;
      if (user.value.image) {
        imageInput.value.image_url = `${config.public.apiBase}/files?name=${user.value._id}/${user.value.image._id}.${user.value.image.extension}&kind=user_image`;
      }
    }
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
      gap: 1rem;
      flex-direction: column;
      .rd-panel-input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        gap: 0.75rem;
        align-items: flex-end;
        .rd-panel-input {
          position: relative;
          width: 100%;
        }
      }
      .rd-panel-fieldset {
        position: relative;
        width: 100%;
        border: var(--border);
        border-radius: 0.75rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem 0;
        flex-wrap: wrap;
        .rd-panel-fieldset-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-panel-fieldset-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            border: var(--border);
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .rd-panel-fieldset-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          .rd-panel-fieldset-input-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
            .rd-panel-fieldset-input {
              width: 100%;
            }
          }
          .rd-panel-fieldset-person-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            .rd-panel-fieldset-person {
              position: relative;
              width: 100%;
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0.75rem;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              .rd-panel-fieldset-person-header {
                position: relative;
                width: 100%;
                height: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .rd-panel-fieldset-person-name-container {
                  position: relative;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                }
              }
              .rd-panel-fieldset-person-body {
                position: relative;
                width: 100%;
                display: flex;
                gap: 0.75rem 0;
                flex-wrap: wrap;
                .rd-panel-fieldset-person-detail {
                  position: relative;
                  width: 50%;
                  display: flex;
                  flex-direction: column;
                  span {
                    position: relative;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  &.rd-panel-fieldset-person-detail-address {
                    width: 100%;
                    span {
                      white-space: normal;
                      overflow: auto;
                      text-overflow: none;
                    }
                  }
                }
              }
            }
          }
        }
        &:last-child {
          margin-bottom: 6rem;
        }
      }
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: var(--background-depth-one-color);
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .rd-panel-button {
        width: 100%;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
    @media only screen and (max-width: 1024px) {
      .rd-panel-body {
        .rd-panel-fieldset {
          &:last-child {
            margin-bottom: 5rem;
          }
        }
      }
      .rd-panel-footer {
        height: 4rem;
        padding: 1rem;
      }
    }
  }
</style>
