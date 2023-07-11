<template>
  <rd-panel
    class="rd-panel"
    label="Edit company"
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
        <rd-input-text :input="fieldInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-textarea :input="addressInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="emailInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="phoneInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name || !contact.address"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { CompanyRequest } from "~~/types/company";
  import { InputFileOption, InputOption } from "~~/types/general";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const config = useRuntimeConfig();
  const { company, createCompany, updateCompany, getCompany } = useCompany();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const imageInput = ref<InputFileOption>({
    file: undefined,
    label: "Company logo",
    type: "image",
  });
  const nameInput = ref<InputOption>({
    label: "Company name",
    name: "name",
    model: "",
    placeholder: "PT. Redian Grup Sejahtera",
  });
  const fieldInput = ref<InputOption>({
    label: "Company field",
    name: "field",
    model: "",
    placeholder: "Digital Creative Agency",
  });
  const addressInput = ref<InputOption>({
    label: "Company address",
    name: "address",
    model: "",
    placeholder: "Somewhere",
  });
  const emailInput = ref<InputOption>({
    label: "Company email",
    name: "email",
    model: "",
    type: "email",
    placeholder: "hello@redian.id",
  });
  const phoneInput = ref<InputOption>({
    label: "Company phone",
    name: "phone",
    model: "",
    placeholder: "+62 812 3456 7890",
  });

  const name = computed<CompanyRequest["name"]>(() => nameInput.value.model);
  const field = computed<CompanyRequest["field"]>(() => fieldInput.value.model);
  const contact = computed<CompanyRequest["contact"]>(() => ({
    address: addressInput.value.model,
    email: emailInput.value.model,
    phone: phoneInput.value.model,
  }));
  const image = computed<CompanyRequest["image"]>(() =>
    imageInput.value.file
      ? {
          extension: imageInput.value.file.type,
        }
      : undefined
  );
  const image_photo = computed<CompanyRequest["image_photo"]>(
    () => imageInput.value.file
  );

  async function submit(): Promise<void> {
    loading.value = true;

    const payload = {
      company_id: "",
      request: {
        name: name.value,
        field: field.value,
        contact: contact.value,
        image: image.value,
        image_photo: image_photo.value,
      },
    };

    if (company.value) {
      payload.company_id = company.value._id;
      await updateCompany(payload);
    } else {
      await createCompany(payload);
    }

    await getCompany();

    loading.value = false;
    panelState.value = "hide";
  }
  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    if (company.value) {
      nameInput.value.model = company.value.name;
      fieldInput.value.model = company.value.field;
      addressInput.value.model = company.value.contact.address;
      emailInput.value.model = company.value.contact.email || "";
      phoneInput.value.model = company.value.contact.phone || "";
      if (company.value.image) {
        imageInput.value.image_url = `${config.public.apiBase}/files?name=${company.value._id}/${company.value.image._id}.${company.value.image.extension}&kind=company_image`;
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
        &:last-child {
          margin-bottom: 7rem;
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
        .rd-panel-input-wrapper {
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
