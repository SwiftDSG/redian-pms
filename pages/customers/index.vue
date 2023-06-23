<template>
  <div class="rd-panel-container">
    <div class="rd-panel-user-container">
      <div class="rd-panel-user-header">
        <span class="rd-panel-role-header-title rd-headline-3">Customers list</span>
        <rd-input-button-small :icon="'plus'" :type="'primary'" />
      </div>
      <div v-if="customersData" class="rd-panel-user-body">
        <div v-for="cust in customersData" :key="cust._id" class="rd-panel-user">
          <div class="rd-panel-user-image"></div>
          <div class="rd-panel-user-detail">
            <span class="rd-panel-user-name rd-headline-4">{{ cust.name }}</span>
            <span class="rd-panel-user-role rd-caption-text">{{ ` ${cust.person.length} contact` }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from "gsap";
import { ProjectResponse, ProjectUserResponse } from "~~/types/project";


const { getCustomers } = useCustomer();
const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

// let customersData = [];

const customersData = ref<any>(null);
const rdPanel = ref<HTMLDivElement>(null);
const rdPanelRoleBody = ref<HTMLDivElement>(null);
const rdPanelUserBody = ref<HTMLDivElement>(null);

const animate = {
  init(rdComponent: HTMLElement, cb: () => void): void {
    const tl = gsap.timeline({
      onComplete: cb,
    });

    tl.to(rdComponent, {
      opacity: 1,
      duration: 0.25,
    });
  },
  exit(rdComponent: HTMLElement): void {
    const tl = gsap.timeline({
      onComplete() {
        rdComponent.removeAttribute("style");
      },
    });

    tl.to(rdComponent, {
      opacity: 0,
      duration: 0.25,
    });
  },
};



onMounted(async () => {
  customersData.value = await getCustomers();
  animate.init(rdPanel.value, () => {
    emits("changing-done");
  });
  console.log(customersData)
});
</script>

<style lang="scss" scoped>
.rd-panel-container {
  position: relative;
  width: 100%;
  height: 100%;
  // height: calc(100vh - 11rem);
  box-sizing: border-box;
  display: flex;
  flex: 1;
  border-radius: 1rem;
  margin: 0 2rem 2rem 2rem;
  // margin-bottom: 2rem;
  border: var(--border);
  border-right: var(--border);
  background: var(--background-depth-one-color);

  .rd-panel-role-container {
    position: relative;
    width: 20rem;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    border-right: var(--border);
    flex-direction: column;

    .rd-panel-role-header {
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

    .rd-panel-role-body {
      position: relative;
      width: 100%;
      height: calc(100% - 3.5rem);
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      gap: 0.75rem;
      flex-direction: column;
      overflow-y: auto;

      .rd-panel-role {
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

        .rd-panel-role-detail {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          span.rd-panel-role-name {
            position: relative;
            margin-bottom: 0.25rem;
          }

          span.rd-panel-role-permissions {
            cursor: pointer;
            position: relative;
            transition: 0.125s opacity;

            &:hover {
              opacity: 1;
            }
          }
        }

        .rd-panel-role-action-container {
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

  .rd-panel-user-container {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-panel-user-header {
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

    .rd-panel-user-body {
      position: relative;
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      // align-items: flex-start;

      .rd-panel-user {
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

        .rd-panel-user-image {
          position: relative;
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 0.5rem;
          background: var(--border-color);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .rd-panel-user-detail {
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
