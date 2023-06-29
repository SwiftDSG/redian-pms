<template>
  <rd-panel
    class="rd-panel"
    label="Add project"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="codeInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select :input="customerInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-date :input="periodStartInput" class="rd-panel-input" />
        <rd-input-date :input="periodEndInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name || !code || !customer_id || !period"
        :loading="loadingSubmit"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputDateOption, InputOption } from "~~/types/general";
  import { ProjectRequest } from "~~/types/project";
  const { createProject, getProjects } = useProject();
  const { customers, getCustomers } = useCustomer();

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const loadingSubmit = ref<boolean>(false);

  const nameInput = ref<InputOption>({
    label: "Project name",
    name: "name",
    model: "",
    error: "",
    placeholder: "Some Project",
  });
  const codeInput = ref<InputOption>({
    label: "Project code",
    name: "code",
    model: "",
    error: "",
    placeholder: "PRJC/01/001",
  });
  const customerInput = ref<InputOption>({
    label: "Project customer",
    name: "customer",
    model: "",
    value: "",
    error: "",
    placeholder: "Select customer",
  });
  const periodStartInput = ref<InputDateOption>({
    label: "Start date",
    name: "period-start",
    model: "",
    value: "",
    error: "",
    placeholder: "DD-MM-YYYY",
  });
  const periodEndInput = ref<InputDateOption>({
    label: "End date",
    name: "period-end",
    model: "",
    value: "",
    error: "",
    placeholder: "DD-MM-YYYY",
  });

  const name = computed<ProjectRequest["name"]>(() => nameInput.value.model);
  const code = computed<ProjectRequest["code"]>(() => codeInput.value.model);
  const customer_id = computed<ProjectRequest["customer_id"] | undefined>(
    () => customerInput.value.value
  );
  const period = computed<ProjectRequest["period"] | undefined>(() => {
    if (periodStartInput.value.value && periodEndInput.value.value) {
      return {
        start: new Date(periodStartInput.value.value).setHours(0, 0, 0, 0),
        end: new Date(periodEndInput.value.value).setHours(23, 59, 59, 999),
      };
    } else {
      return undefined;
    }
  });

  async function submit(): Promise<void> {
    if (customer_id.value && period.value) {
      loadingSubmit.value = true;
      const payload: ProjectRequest = {
        name: name.value,
        code: code.value,
        customer_id: customer_id.value,
        period: period.value,
      };
      await createProject({
        request: payload,
      });
      await getProjects();
      loadingSubmit.value = false;
      panelState.value = "hide";
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
  watch(
    () => customers.value,
    (val) => {
      if (val?.length) {
        customerInput.value.options = val.map((a) => ({
          name: a.name,
          value: a._id,
        }));
      }
    },
    {
      immediate: true,
    }
  );

  onMounted(async () => {
    if (!customers.value?.length) {
      loading.value = true;
    }
    await getCustomers();
    setTimeout(() => {
      loading.value = false;
    }, 500);
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
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
  }
</style>
