<template>
  <div class="rd-container">
    <div class="rd-customer-panel">
      <div class="rd-customer-panel-header">
        <span class="rd-customer-panel-header-title rd-headline-3"
          >Customers list</span
        >
        <rd-input-button-small
          v-if="validate('create_customer')"
          :icon="'plus'"
          :type="'primary'"
          @clicked="openCustomerPanel"
        />
      </div>
      <div v-if="customers" class="rd-customer-panel-body">
        <div
          v-for="customer in customers"
          :key="customer._id"
          class="rd-customer"
          @click="openCustomerPanel(customer)"
        >
          <div class="rd-customer-image-container">
            <img
              :src="
                customer.image
                  ? `${config.public.apiBase}/files?name=${customer._id}/${customer.image._id}.${customer.image.extension}&kind=customer_image`
                  : '/default_customer.svg'
              "
              class="rd-customer-image"
            />
          </div>
          <div class="rd-customer-detail-container">
            <span class="rd-customer-name rd-headline-5">{{
              customer.name
            }}</span>
            <span class="rd-customer-contact rd-caption-text">{{
              customer.field
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Customer } from "types/customer";

  const { init, state } = useMain();
  const { customers, getCustomers } = useCustomer();
  const { validate } = useRole();
  const emits = defineEmits(["change-page", "open-panel"]);
  const config = useRuntimeConfig();

  definePageMeta({
    middleware: ["auth"],
  });

  function openCustomerPanel(customer?: Customer): void {
    emits("open-panel", {
      state: "show",
      type: "customer",
      data: {
        customer,
      },
    });
  }

  onMounted(async () => {
    customers.value = await getCustomers();
    setTimeout(() => {
      init.value = false;
      state.value = "idle";
    }, 250);
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 2rem 2rem 2rem;
    box-sizing: border-box;
    display: flex;
    .rd-customer-panel {
      position: relative;
      width: 100%;
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
      flex-direction: column;
      .rd-customer-panel-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        padding: 0.75rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-customer-panel-body {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;

        .rd-customer {
          position: relative;
          width: calc((100% - 1.5rem) / 3);
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: var(--background-depth-two-color);
          border: var(--border);
          box-sizing: border-box;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
          align-items: center;
          .rd-customer-image-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            background: #fafafa;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            img {
              position: relative;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .rd-customer-detail-container {
            position: relative;
            height: 100%;
            display: flex;
            gap: 0.25rem;
            flex-direction: column;
            justify-content: center;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      padding: 0 1rem 1rem 1rem;
      .rd-customer-panel {
        .rd-customer-panel-body {
          .rd-customer {
            width: 100%;
          }
        }
      }
      .rd-customer-add-button {
        bottom: 2rem;
        right: 2rem;
      }
    }
  }
</style>
