<template>
  <rd-panel
    class="rd-panel"
    label="Add customer"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
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
      <div class="rd-panel-fieldset" style="margin-bottom: 6rem">
        <div class="rd-panel-fieldset-header">
          <span class="rd-panel-fieldset-name rd-headline-4"
            >Contact person(s)</span
          >
          <div class="rd-panel-fieldset-icon-container">
            <rd-svg class="rd-panel-fieldset-icon" name="account-multiple" />
          </div>
        </div>
        <div class="rd-panel-fieldset-body">
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-text
              :input="personNameInput"
              class="rd-panel-fieldset-input"
            />
          </div>
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-textarea
              :input="personAddressInput"
              class="rd-panel-fieldset-input"
            />
          </div>
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-text
              :input="personEmailInput"
              class="rd-panel-fieldset-input"
            />
          </div>
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-text
              :input="personPhoneInput"
              class="rd-panel-fieldset-input"
            />
          </div>
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-text
              :input="personRoleInput"
              class="rd-panel-fieldset-input"
            />
          </div>
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-button
              label="Add person"
              class="rd-panel-fieldset-input"
              :disabled="!person?.name || !person?.role"
              @clicked="addPerson"
            />
          </div>
          <div v-if="persons?.length" class="rd-panel-fieldset-person-wrapper">
            <div
              v-for="(person, i) in persons"
              :key="i"
              class="rd-panel-fieldset-person"
            >
              <div class="rd-panel-fieldset-person-header">
                <div class="rd-panel-fieldset-person-name-container">
                  <span class="rd-panel-fieldset-person-name rd-headline-5">{{
                    person.name
                  }}</span>
                  <span class="rd-panel-fieldset-person-role rd-caption-text">{{
                    person.role
                  }}</span>
                </div>
                <rd-input-button-small
                  icon="close"
                  @clicked="removePerson(i)"
                />
              </div>
              <div
                v-if="person.phone || person.email || person.address"
                class="rd-panel-fieldset-person-body"
              >
                <div
                  v-if="person.phone"
                  class="rd-panel-fieldset-person-detail"
                >
                  <span
                    class="rd-panel-fieldset-person-placeholder rd-caption-text"
                    >Phone</span
                  >
                  <span class="rd-panel-fieldset-person-value rd-headline-5">{{
                    person.phone
                  }}</span>
                </div>
                <div
                  v-if="person.email"
                  class="rd-panel-fieldset-person-detail"
                >
                  <span
                    class="rd-panel-fieldset-person-placeholder rd-caption-text"
                    >Email</span
                  >
                  <span class="rd-panel-fieldset-person-value rd-headline-5">{{
                    person.email
                  }}</span>
                </div>
                <div
                  v-if="person.address"
                  class="rd-panel-fieldset-person-detail rd-panel-fieldset-person-detail-address"
                >
                  <span
                    class="rd-panel-fieldset-person-placeholder rd-caption-text"
                    >Address</span
                  >
                  <span class="rd-panel-fieldset-person-value rd-headline-5">{{
                    person.address
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name || !contact.address || !persons?.length"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { CustomerPerson, CustomerRequest } from "~~/types/customer";
  import { InputOption } from "~~/types/general";

  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { customers, createCustomer, getCustomers } = useCustomer();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const persons = ref<CustomerPerson[]>([]);

  const nameInput = ref<InputOption>({
    label: "Customer name",
    name: "name",
    model: "",
    placeholder: "PT. ABC",
  });
  const addressInput = ref<InputOption>({
    label: "Customer address",
    name: "address",
    model: "",
    placeholder: "Somewhere",
  });
  const emailInput = ref<InputOption>({
    label: "Customer email",
    name: "email",
    model: "",
    type: "email",
    placeholder: "abc@xyz.com",
  });
  const phoneInput = ref<InputOption>({
    label: "Customer phone",
    name: "phone",
    model: "",
    placeholder: "+62 812 3456 7890",
  });
  const personNameInput = ref<InputOption>({
    label: "Name",
    name: "name",
    model: "",
    placeholder: "Jane Doe",
  });
  const personAddressInput = ref<InputOption>({
    label: "Address",
    name: "address",
    model: "",
    placeholder: "Somewhere",
  });
  const personEmailInput = ref<InputOption>({
    label: "Email",
    name: "email",
    model: "",
    type: "email",
    placeholder: "purchasing@abc.com",
  });
  const personPhoneInput = ref<InputOption>({
    label: "Phone",
    name: "phone",
    model: "",
    placeholder: "+62 812 3456 7890",
  });
  const personRoleInput = ref<InputOption>({
    label: "Role",
    name: "role",
    model: "",
    placeholder: "Purchasing",
  });

  const name = computed<CustomerRequest["name"]>(() => nameInput.value.model);
  const contact = computed<CustomerRequest["contact"]>(() => ({
    address: addressInput.value.model,
    email: emailInput.value.model,
    phone: phoneInput.value.model,
  }));
  const person = computed<CustomerPerson>(() => ({
    name: personNameInput.value.model,
    address: personAddressInput.value.model,
    phone: personPhoneInput.value.model,
    email: personEmailInput.value.model,
    role: personRoleInput.value.model,
  }));

  function addPerson(): void {
    persons.value.push(person.value);

    personNameInput.value.model = "";
    personAddressInput.value.model = "";
    personEmailInput.value.model = "";
    personPhoneInput.value.model = "";
    personRoleInput.value.model = "";
  }
  function removePerson(i: number): void {
    persons.value.splice(i, 1);
  }
  async function submit(): Promise<void> {
    loading.value = true;

    const payload = {
      request: {
        name: name.value,
        contact: contact.value,
        person: persons.value,
      },
    };

    await createCustomer(payload);

    customers.value = await getCustomers();

    loading.value = false;
    panelState.value = "hide";
  }
  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
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
