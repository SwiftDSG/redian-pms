<template>
  <div class="rd-panel-container">
    <div class="rd-panel-customer-container">
      <div class="rd-panel-customer-header">
        <span class="rd-panel-customer-header-title rd-headline-3"
          >Customers list</span
        >
        <rd-input-button-small
          :icon="'plus'"
          :type="'primary'"
          @clicked="openCustomerPanel"
        />
      </div>
      <div v-if="customers" class="rd-panel-customer-body">
        <div
          v-for="customer in customers"
          :key="customer._id"
          class="rd-panel-customer"
        >
          <div class="rd-panel-customer-image"></div>
          <div class="rd-panel-customer-detail">
            <span class="rd-panel-customer-name rd-headline-4">{{
              customer.name
            }}</span>
            <span class="rd-panel-customer-customer rd-caption-text">{{
              ` ${customer.person.length} contact`
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { customers, getCustomers } = useCustomer();
  const emits = defineEmits(["change-page", "open-panel"]);

  definePageMeta({
    middleware: ["auth"],
  });

  function openCustomerPanel(): void {
    emits("open-panel", {
      state: "show",
      type: "customer",
    });
  }

  onMounted(async () => {
    customers.value = await getCustomers();
  });
</script>

<style lang="scss" scoped>
  .rd-panel-container {
    position: relative;
    width: 100%;
    margin: 0 2rem 2rem 2rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;

    .rd-panel-customer-container {
      position: relative;
      width: 20rem;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .rd-panel-customer-header {
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

      .rd-panel-customer-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 0.75rem;
        overflow-y: auto;
        .rd-panel-customer {
          position: relative;
          width: 100%;
          height: 3.5rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: var(--border);
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .rd-panel-customer-detail {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            span.rd-panel-customer-name {
              position: relative;
              margin-bottom: 0.25rem;
            }

            span.rd-panel-customer-permissions {
              cursor: pointer;
              position: relative;
              transition: 0.125s opacity;

              &:hover {
                opacity: 1;
              }
            }
          }

          .rd-panel-customer-action-container {
            position: relative;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .rd-panel-customer-container {
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .rd-panel-customer-header {
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

      .rd-panel-customer-body {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;

        .rd-panel-customer {
          position: relative;
          width: calc((100% - 1.5rem) / 3);
          height: 4rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: var(--border);
          box-sizing: border-box;
          display: flex;
          gap: 0.75rem;
          justify-content: flex-start;
          align-items: center;

          .rd-panel-customer-image {
            position: relative;
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 0.5rem;
            background: var(--border-color);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .rd-panel-customer-detail {
            position: relative;
            width: calc(100% - 3.75rem);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
</style>
