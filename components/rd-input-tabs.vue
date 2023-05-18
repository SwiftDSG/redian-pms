<template>
  <div
    class="rd-input-component"
    ref="rdInputComponent"
    :class="input.disabled ? 'rd-input-component-disabled' : ''"
  >
    <input
      v-for="(option, i) in input.options"
      :key="i"
      type="radio"
      class="rd-input"
      name="rd-input-radio"
      ref="rdInput"
      :id="`rd-input-radio-${i}`"
      :disabled="input.disabled"
      :data-index="i"
      @change="updateModel"
    />
    <label
      v-for="(option, i) in input.options"
      :key="i"
      :for="`rd-input-radio-${i}`"
      :class="props.input.model === option ? 'rd-input-label-active' : ''"
      class="rd-input-label"
      ref="rdInputLabel"
    >
      <span class="rd-input-label-option rd-body-text">{{ option }}</span>
    </label>
    <div ref="rdInputBorder" class="rd-input-border"></div>
  </div>
</template>

<script lang="ts" setup>
  import { InputSwitchOption } from "~~/interfaces/general";
  import gsap from "gsap";

  const props = defineProps<{
    input: InputSwitchOption;
  }>();

  const rdInputLabel = ref<HTMLLabelElement[]>(null);
  const rdInputComponent = ref<HTMLDivElement>(null);
  const rdInputBorder = ref<HTMLDivElement>(null);

  function updateModel(e: InputEvent): InputEvent {
    if (e.target instanceof HTMLInputElement) {
      const index: number = parseInt(e.target.dataset.index);
      const windowLeft: number =
        rdInputComponent.value.getBoundingClientRect().left;
      props.input.model = props.input.options[index];
      const { width, left }: DOMRect =
        rdInputLabel.value[index].getBoundingClientRect();
      gsap.to(rdInputBorder.value, {
        x: left - windowLeft,
        width,
        duration: 0.25,
        ease: "power2.out",
      });
    }
    return e;
  }
</script>

<style lang="scss" scoped>
  .rd-input-component {
    position: relative;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    input.rd-input {
      pointer-events: none;
      position: absolute;
      opacity: 0;
      &:checked + label.rd-input-label {
        .rd-input-label-slider {
          transform: translateX(100%);
          span.rd-input-label-slider-option {
            transform: translateX(-100%);
          }
        }
      }
    }
    label.rd-input-label {
      cursor: pointer;
      position: relative;
      padding-bottom: 0.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      * {
        pointer-events: none;
      }
      span.rd-input-label-option {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s color;
      }
      &.rd-input-label-active {
        span.rd-input-label-option {
          color: var(--primary-color);
        }
      }
      // .rd-input-border {
      //   pointer-events: none;
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%;
      //   border-radius: 0.5rem;
      //   border: 1px solid rgba(0, 0, 0, 0.125);
      //   box-sizing: border-box;
      //   transition: 0.25s border-color, 0.25s border-width;
      //   &::before {
      //     content: "";
      //     position: absolute;
      //     top: -3px;
      //     left: -3px;
      //     width: calc(100% + 6px);
      //     height: calc(100% + 6px);
      //     border-radius: 0.5rem;
      //     border: 3px solid var(--primary-color);
      //     box-sizing: border-box;
      //     opacity: 0;
      //     transition: 0.25s opacity;
      //   }
      // }
      // &:focus {
      //   .rd-input-border {
      //     border-color: var(--primary-color);
      //     &::before {
      //       opacity: 0.25;
      //     }
      //   }
      // }
    }
    .rd-input-border {
      position: absolute;
      bottom: -1.5px;
      width: 10px;
      height: 2px;
      background: var(--primary-color);
    }
    &.rd-input-component-disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
