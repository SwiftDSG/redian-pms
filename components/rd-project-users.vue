<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-role-container">
      <div class="rd-panel-role-header">
        <span class="rd-panel-role-header-title rd-headline-3">Role list</span>
        <rd-input-button-small
          v-if="project.status[0]?.kind === 'pending'"
          :icon="'plus'"
          :type="'primary'"
          @clicked="addRole"
        />
      </div>
      <div v-if="data" class="rd-panel-role-body">
        <div v-for="role in data.role" :key="role._id" class="rd-panel-role">
          <div class="rd-panel-role-detail">
            <span class="rd-panel-role-name rd-headline-5">{{
              role.name
            }}</span>
            <span class="rd-panel-role-permissions rd-caption-text">
              {{
                role.permission[0] === "owner"
                  ? "All permissions"
                  : `${role.permission.length} permissions`
              }}
            </span>
          </div>
          <div
            v-if="role.permission[0] !== 'owner'"
            class="rd-panel-role-action-container"
          >
            <rd-input-button-small :icon="'dots'" @clicked="editRole(role)" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="data" class="rd-panel-user-container">
      <div class="rd-panel-user-header">
        <span class="rd-panel-role-header-title rd-headline-3"
          >Member list</span
        >
        <rd-input-button-small
          v-if="project.status[0]?.kind === 'pending'"
          :icon="'plus'"
          :type="'primary'"
          @clicked="addUser"
        />
      </div>
      <div class="rd-panel-user-body">
        <div
          v-for="user in data.user"
          :key="user._id"
          class="rd-panel-user"
          @click="editUser(user)"
        >
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
            <span class="rd-panel-user-name rd-headline-4">{{
              user.name
            }}</span>
            <span class="rd-panel-user-role rd-caption-text">{{
              user.role.map((a) => a.name).join(", ")
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import {
    ProjectMemberResponse,
    ProjectResponse,
    ProjectUserResponse,
  } from "~~/types/project";
  import { ProjectRoleResponse } from "~~/types/project-role";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: ProjectUserResponse;
  }>();
  const emits = defineEmits([
    "change-menu",
    "changing-done",
    "edit-role",
    "add-role",
    "edit-user",
    "add-user",
  ]);
  const config = useRuntimeConfig();

  const rdPanel = ref<HTMLDivElement | null>(null);

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

  function editRole(role: ProjectRoleResponse): void {
    emits("edit-role", role);
  }
  function addRole(): void {
    emits("add-role");
  }
  function editUser(user: ProjectMemberResponse): void {
    emits("edit-user", user);
  }
  function addUser(): void {
    emits("add-user");
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "changing" && rdPanel.value) {
        animate.exit(rdPanel.value);
      }
    }
  );

  onMounted(() => {
    if (rdPanel.value) {
      animate.init(rdPanel.value, () => {
        emits("changing-done");
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
    height: calc(100vh - 11rem);
    margin-bottom: 2rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;
    opacity: 0;

    .rd-panel-role-container {
      position: relative;
      width: 20rem;
      height: 100%;
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
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
        max-height: calc(100% - 3.5rem);
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        overflow-y: auto;
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
      height: auto;
      border: none;
      background: transparent;
      margin-bottom: 1rem;
      flex-direction: column;
      flex: 0;
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
        height: auto;
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
</style>
