<template>
  <div class="rd-panel-container">
    <div class="rd-panel-role-container">
      <div class="rd-panel-role-header">
        <span class="rd-panel-role-header-title rd-headline-3">Role list</span>
        <rd-input-button-small :icon="'plus'" :type="'primary'" />
      </div>
      <div class="rd-panel-role-body">
        <div class="rd-panel-role">
          <div class="rd-panel-role-detail">
            <span class="rd-panel-role-name rd-headline-5">nama role </span>
            <span class="rd-panel-role-permissions rd-caption-text">
              permission
            </span>
          </div>
          <div class="rd-panel-role-action-container">
            <rd-input-button-small :icon="'dots'" />
          </div>
        </div>
      </div>
    </div>

    <div class="rd-panel-user-container">
      <div class="rd-panel-user-header">
        <span class="rd-panel-role-header-title rd-headline-3">Users list</span>
        <rd-input-button-small :icon="'plus'" :type="'primary'" />
      </div>
      <div v-if="usersData" class="rd-panel-user-body">
        <div v-for="user in usersData" :key="user._id" class="rd-panel-user">
          <div class="rd-panel-user-image"></div>
          <div class="rd-panel-user-detail">
            <span class="rd-panel-user-name rd-headline-4">{{
              user.name
            }}</span>
            <span class="rd-panel-user-role rd-caption-text">{{
              user.role_id
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";

  const { users, getUsers } = useUser();
  const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

  definePageMeta({
    middleware: ["auth"],
  });

  const usersData = ref<any>(null);

  onMounted(async () => {
    users.value = await getUsers();
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
      width: calc(100% - 20rem);
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
        height: 100%;
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.75rem;

        .rd-panel-user {
          position: relative;
          width: calc((100% - 0.75rem) / 2);
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
