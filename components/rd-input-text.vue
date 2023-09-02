<template>
  <div
    ref="rdInputComponent"
    class="rd-input-component"
    :class="`${input.error ? 'rd-input-error-active' : ''} ${
      input.disabled ? 'rd-input-disabled' : ''
    }`"
  >
    <label v-if="input.label" class="rd-input-label rd-headline-6">{{
      input.label
    }}</label>
    <div class="rd-input-container">
      <div
        v-if="input.icon || input.prefix || input.color"
        class="rd-input-icon-container"
      >
        <rd-svg v-if="input.icon" :name="input.icon" />
        <span
          v-else-if="input.prefix"
          class="rd-input-icon-prefix rd-headline-5"
          >{{ input.prefix }}</span
        >
        <span
          v-else
          class="rd-input-icon-color"
          :style="`background: ${input.color}`"
        ></span>
      </div>
      <input
        class="rd-input rd-body-text"
        :placeholder="input.placeholder"
        :name="input.name"
        :type="
          input.type === 'number' ||
          input.type === 'hour' ||
          input.type === 'minute'
            ? 'text'
            : input.type
        "
        :disabled="input.disabled"
        ref="rdInput"
        @input="updateModel"
      />
      <div class="rd-input-border"></div>
    </div>
    <span
      v-if="typeof input.error === 'string'"
      class="rd-input-error rd-headline-6"
    >
      <span class="rd-text-wrapper">
        <span class="rd-text-container rd-text-container-up">
          <span class="rd-text">{{ inputError }}</span>
        </span>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general.js";

  const props = defineProps<{
    input: InputOption;
  }>();

  const rdInput = ref<HTMLInputElement | null>(null);

  const inputError = ref<string | undefined>(props.input.error);
  const inputModel = ref<string>("");

  function updateModel(e: Event): Event {
    if (e.target instanceof HTMLInputElement) {
      if (props.input.type === "number" && e instanceof InputEvent) {
        if ((e.data && "1234567890".includes(e.data)) || !e.data) {
          const rawValue: number = parseInt(e.target.value.split(".").join(""));
          const value: string = rawValue
            ? rawValue.toLocaleString("de-DE")
            : "";
          e.target.value = value;
          inputModel.value = value;
          props.input.model = value;
        } else {
          e.target.value = inputModel.value;
        }
      } else if (props.input.type === "hour") {
        let num: number = Math.abs(parseInt(e.target.value));
        if (isNaN(num)) e.target.value = "00";
        else if (num > 23) {
          e.target.value = "23";
        } else e.target.value = num.toString().padStart(2, "0");
        props.input.model = e.target.value;
      } else if (props.input.type === "minute") {
        let num: number = Math.abs(parseInt(e.target.value));
        if (isNaN(num)) e.target.value = "00";
        else if (num > 59) e.target.value = "59";
        else e.target.value = num.toString().padStart(2, "0");
        props.input.model = e.target.value;
      } else {
        inputModel.value = e.target.value;
        props.input.model = e.target.value;
      }
    }
    return e;
  }

  watch(
    () => props.input.model,
    (val) => {
      if (inputModel.value !== val && rdInput.value) {
        rdInput.value.value = val;
        inputModel.value = val;
      }
    }
  );
  watch(
    () => props.input.error,
    (val) => {
      if (val) inputError.value = val;
    }
  );

  onMounted(() => {
    if (props.input.model && rdInput.value) {
      rdInput.value.value = props.input.model;
      inputModel.value = props.input.model;
    }
  });
</script>

<style lang="scss" scoped>
  .rd-input-component {
    position: relative;
    display: flex;
    flex-direction: column;
    label.rd-input-label {
      position: relative;
      width: 100%;
      height: 1rem;
      display: flex;
      color: var(--font-primary-color);
      opacity: 0.5;
      align-items: center;
    }
    .rd-input-container {
      position: relative;
      width: 100%;
      height: 2rem;
      background: var(--background-depth-one-color);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      .rd-input-icon-container {
        pointer-events: none;
        z-index: 2;
        position: absolute;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        .rd-input-icon-prefix {
          position: relative;
          line-height: 1;
        }
        .rd-input-icon-color {
          position: relative;
          width: 100%;
          height: 1rem;
          border-radius: 0.25rem;
        }
        & + input.rd-input {
          padding: 0 0.5rem 0 2rem;
        }
      }
      input.rd-input {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 0.5rem;
        border: none;
        border-radius: 0.5rem;
        box-sizing: border-box;
        color: var(--font-primary-color);
        background: rgba(0, 0, 0, 0);
        display: flex;
        transition: background-color 0.25s;
        &::placeholder {
          color: var(--font-primary-color);
          opacity: 0.5;
          transition: opacity 0.25s;
        }
        &:hover {
          outline: none;
          background: rgba(0, 0, 0, 0);
          &::placeholder {
            opacity: 0.75;
          }
        }
        &:focus {
          outline: none;
          background: var(--background-depth-two-color);
          &::placeholder {
            opacity: 1;
          }
        }
        &:focus + .rd-input-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
      .rd-input-border {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        border: var(--border);
        box-sizing: border-box;
        transition: 0.25s border-color, 0.25s border-width;
        &::before {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          border-radius: calc(0.5rem + 1px);
          border: 3px solid var(--primary-color);
          box-sizing: border-box;
          opacity: 0;
          transition: 0.25s opacity;
        }
      }
    }
    span.rd-input-error {
      position: relative;
      width: 100%;
      height: 1rem;
      display: flex;
      color: var(--error-color);
      align-items: center;
      span.rd-text-wrapper {
        span.rd-text-container {
          transition: 0.25s transform;
          span.rd-text {
            transition: 0.25s transform;
          }
        }
      }
    }
    &.rd-input-error-active {
      span.rd-input-error {
        span.rd-text-wrapper {
          span.rd-text-container {
            transform: translateY(0);
            span.rd-text {
              transform: translateY(0);
            }
          }
        }
      }
    }
    &.rd-input-disabled {
      pointer-events: none;
      filter: grayscale(0.75);
      opacity: 0.5;
    }
  }
</style>
