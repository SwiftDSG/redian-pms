<template>
  <div class="rd-container">
    <div class="rd-panel">
      <div class="rd-panel-role-container">
        <div class="rd-panel-role-header">
          <span class="rd-panel-role-header-title rd-headline-3"
            >Role list</span
          >
          <rd-input-button-small
            v-if="validate('create_role')"
            icon="plus"
            type="primary"
            @clicked="openRolePanel"
          />
        </div>
        <div class="rd-panel-role-body">
          <div v-for="role in roles" :key="role._id" class="rd-panel-role">
            <div class="rd-panel-role-detail">
              <span class="rd-panel-role-name rd-headline-5">{{
                role.name
              }}</span>
              <span class="rd-panel-role-permissions rd-caption-text">
                {{
                  `${
                    role.permission.includes("owner")
                      ? "All"
                      : role.permission.length
                  } permissions`
                }}
              </span>
            </div>
            <div
              v-if="!role.permission.includes('owner')"
              class="rd-panel-role-action-container"
            >
              <rd-input-button-small
                v-if="validate('create_role')"
                icon="dots"
                @clicked="openRolePanel(role)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="rd-panel-user-container">
        <div class="rd-panel-user-header">
          <span class="rd-panel-user-header-title rd-headline-3"
            >Users list</span
          >
          <rd-input-button-small
            v-if="validate('create_user')"
            icon="plus"
            type="primary"
            @clicked="openUserPanel"
          />
        </div>
        <div v-if="users?.length" class="rd-panel-user-body">
          <div v-for="user in users" :key="user._id" class="rd-panel-user">
            <div class="rd-panel-user-image-container">
              <img
                :src="
                  user.image
                    ? `${config.public.apiBase}/files?name=${user._id}/${user.image._id}.${user.image.extension}&kind=user_image`
                    : `${config.public.base}/default_user.svg`
                "
                class="rd-panel-user-image"
              />
            </div>
            <div class="rd-panel-user-detail-container">
              <span class="rd-panel-user-name rd-headline-5">{{
                user.name
              }}</span>
              <div class="rd-panel-user-role-container">
                <span
                  v-for="role in user.role"
                  :key="role._id"
                  class="rd-panel-user-role rd-headline-6"
                  >{{ role.name }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { RoleResponse } from "types/role";
  import { UserResponse } from "types/user";

  const { users, getUsers } = useUser();
  const { roles, getRoles, validate } = useRole();
  const { init, state } = useMain();
  const emits = defineEmits(["change-page", "open-panel"]);
  const config = useRuntimeConfig();

  definePageMeta({
    middleware: ["auth"],
  });

  function openUserPanel(user?: UserResponse): void {
    emits("open-panel", {
      state: "show",
      type: "user",
      data: {
        user,
      },
    });
  }
  function openRolePanel(role?: RoleResponse): void {
    emits("open-panel", {
      state: "show",
      type: "role",
      data: {
        role,
      },
    });
  }

  onMounted(async () => {
    await getUsers();
    await getRoles();
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
    .rd-panel {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 1rem;
      border: var(--border);
      background: var(--background-depth-one-color);
      display: flex;
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
            background: var(--background-depth-two-color);
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
          align-content: flex-start;
          flex-wrap: wrap;
          gap: 0.75rem;

          .rd-panel-user {
            position: relative;
            width: calc((100% - 0.75rem) / 2);
            height: 4rem;
            padding: 0.75rem;
            border-radius: 0.75rem;
            background: var(--background-depth-two-color);
            border: var(--border);
            box-sizing: border-box;
            display: flex;
            gap: 0.5rem;
            justify-content: flex-start;
            align-items: center;

            .rd-panel-user-image-container {
              position: relative;
              height: 2.5rem;
              width: 2.5rem;
              border-radius: 0.5rem;
              background: var(--background-depth-one-color);
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

            .rd-panel-user-detail-container {
              position: relative;
              width: calc(100% - 3.75rem);
              height: 100%;
              display: flex;
              gap: 0.25rem;
              flex-direction: column;
              justify-content: center;
              .rd-panel-user-role-container {
                position: relative;
                left: -0.75rem;
                width: calc(100% + 1.5rem);
                height: 1rem;
                padding: 0 0.75rem;
                box-sizing: border-box;
                display: flex;
                gap: 0.375rem;
                .rd-panel-user-role {
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

          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      padding: 0 1rem 1rem 1rem;
      .rd-panel {
        height: auto;
        border: none;
        background: transparent;
        flex-direction: column;
        gap: 0.75rem;
        .rd-panel-role-container {
          width: 100%;
          height: auto;
          border-radius: 1rem;
          border: var(--border);
          background: var(--background-depth-one-color);
          .rd-panel-role-body {
            height: auto;
            flex-direction: row;
            overflow-y: hidden;
            overflow-x: auto;
            .rd-panel-role {
              width: 75%;
              flex-shrink: 0;
            }
          }
        }
        .rd-panel-user-container {
          width: 100%;
          border-radius: 1rem;
          border: var(--border);
          background: var(--background-depth-one-color);
          .rd-panel-user-body {
            flex-direction: column;
            overflow-y: auto;
            .rd-panel-user {
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
