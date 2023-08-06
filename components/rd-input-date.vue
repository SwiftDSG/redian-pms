<template>
  <div
    ref="rdInputComponent"
    class="rd-input-component"
    :class="input.error ? 'rd-input-error-active' : ''"
  >
    <label
      :for="`rd-input-${inputId}`"
      v-if="input.label"
      class="rd-input-label rd-headline-6"
      >{{ input.label }}</label
    >
    <div class="rd-input-container">
      <div v-if="input.icon" class="rd-input-icon-container">
        <rd-svg :name="input.icon" :color="'secondary'" />
      </div>
      <input
        class="rd-input rd-body-text"
        :placeholder="props.input.placeholder"
        ref="rdInput"
        :id="`rd-input-${inputId}`"
        :class="dropDownOpened ? 'rd-input-focused' : ''"
        type="date"
        :model="inputModel"
        :name="props.input.name"
        :min="inputMin"
        :max="inputMax"
        @input="updateModel"
      />
      <div class="rd-input-border"></div>
      <div class="rd-input-calendar-container" @click="dropDownHandler('open')">
        <rd-svg class="rd-input-calendar" name="calendar" />
      </div>
      <div
        v-if="dropDownOpened && selectedMonth"
        ref="rdInputDate"
        class="rd-input-date"
        :data-id="inputId"
        :class="dropDownOpened ? 'rd-input-date-opened' : ''"
      >
        <div :data-id="inputId" class="rd-input-date-controls-container">
          <div
            :data-id="inputId"
            class="rd-input-date-controls-indicator-wrapper"
          >
            <div
              :data-id="inputId"
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                :data-id="inputId"
                class="rd-input-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(
                    selectedMonth.month === 0
                      ? selectedMonth.year - 1
                      : selectedMonth.year,
                    selectedMonth.month === 0 ? 11 : selectedMonth.month - 1
                  )
                }}</span
              >
            </div>
            <div
              :data-id="inputId"
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                :data-id="inputId"
                class="rd-input-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(selectedMonth.year, selectedMonth.month)
                }}</span
              >
            </div>
            <div
              :data-id="inputId"
              class="rd-input-date-controls-indicator rd-input-date-controls-indicator-prev"
            >
              <span
                :data-id="inputId"
                class="rd-input-date-controls-indicator-text rd-headline-5"
                >{{
                  monthHandler(
                    selectedMonth.month === 11
                      ? selectedMonth.year + 1
                      : selectedMonth.year,
                    selectedMonth.month === 11 ? 0 : selectedMonth.month + 1
                  )
                }}</span
              >
            </div>
          </div>
          <div :data-id="inputId" class="rd-input-date-controls">
            <rd-input-button-small
              :data-id="inputId"
              class="rd-panel-button"
              side="left"
              :icon="'chevron-left'"
              style="transform-origin: center right"
              @clicked="changeMonth('left')"
              :disabled="
                props.input.threshold &&
                isYesterday(
                  selectedMonth.month === 0
                    ? selectedMonth.year - 1
                    : selectedMonth.year,
                  selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                  32
                )
              "
            />
            <rd-input-button-small
              :data-id="inputId"
              class="rd-panel-button"
              side="right"
              :icon="'chevron-right'"
              style="transform-origin: center left"
              @clicked="changeMonth('right')"
              :disabled="
                props.input.threshold &&
                isTomorrow(
                  selectedMonth.month === 11
                    ? selectedMonth.year + 1
                    : selectedMonth.year,
                  selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                  1
                )
              "
            />
          </div>
        </div>
        <div :data-id="inputId" class="rd-input-date-days-container">
          <span
            v-for="(day, i) in days"
            :data-id="inputId"
            :key="i"
            class="rd-input-date-day rd-caption-text"
            >{{ day.slice(0, 1) }}</span
          >
        </div>
        <div :data-id="inputId" class="rd-input-date-weeks-wrapper">
          <div
            :data-id="inputId"
            class="rd-input-date-weeks rd-input-date-weeks-prev"
          >
            <div
              v-for="i in 6"
              :data-id="inputId"
              :key="i"
              class="rd-input-date-week"
            >
              <div
                v-for="j in 7"
                :data-id="inputId"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold &&
                  isYesterday(
                    selectedMonth.month === 0
                      ? selectedMonth.year - 1
                      : selectedMonth.year,
                    selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                    prevDays?.[i - 1][j - 1]
                  )
                    ? 'rd-input-date-week-day-disabled'
                    : ''
                "
              >
                <div
                  v-if="
                    isSameDay(
                      selectedMonth.month === 0
                        ? selectedMonth.year - 1
                        : selectedMonth.year,
                      selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                      prevDays?.[i - 1][j - 1]
                    )
                  "
                  :data-id="inputId"
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="prevDays?.[i - 1][j - 1]"
                  :data-id="inputId"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 0
                        ? selectedMonth.year - 1
                        : selectedMonth.year,
                      selectedMonth.month === 0 ? 11 : selectedMonth.month - 1,
                      prevDays[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  >{{ prevDays[i - 1][j - 1] }}</span
                >
                <span
                  v-else
                  :data-id="inputId"
                  class="rd-input-date-week-day-dot"
                ></span>
              </div>
            </div>
          </div>
          <div
            :data-id="inputId"
            class="rd-input-date-weeks rd-input-date-weeks-current"
          >
            <div
              v-for="i in 6"
              :data-id="inputId"
              :key="i"
              class="rd-input-date-week"
            >
              <div
                v-for="j in 7"
                :data-id="inputId"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold &&
                  (isYesterday(
                    selectedMonth.year,
                    selectedMonth.month,
                    currentDays?.[i - 1][j - 1]
                  ) ||
                    isTomorrow(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays?.[i - 1][j - 1]
                    ))
                    ? 'rd-input-date-week-day-disabled'
                    : ''
                "
              >
                <div
                  :data-id="inputId"
                  v-if="
                    isSameDay(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays?.[i - 1][j - 1]
                    )
                  "
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="currentDays?.[i - 1][j - 1]"
                  :data-id="inputId"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.year,
                      selectedMonth.month,
                      currentDays?.[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  @click="selectOption(currentDays?.[i - 1][j - 1])"
                  >{{ currentDays?.[i - 1][j - 1] }}</span
                >
                <span
                  v-else
                  :data-id="inputId"
                  class="rd-input-date-week-day-dot"
                ></span>
              </div>
            </div>
          </div>
          <div
            :data-id="inputId"
            class="rd-input-date-weeks rd-input-date-weeks-next"
          >
            <div
              v-for="i in 6"
              :data-id="inputId"
              :key="i"
              class="rd-input-date-week"
            >
              <div
                v-for="j in 7"
                :data-id="inputId"
                :key="j"
                class="rd-input-date-week-day"
                :class="
                  props.input.threshold &&
                  isTomorrow(
                    selectedMonth.month === 11
                      ? selectedMonth.year + 1
                      : selectedMonth.year,
                    selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                    nextDays?.[i - 1][j - 1]
                  )
                    ? 'rd-input-date-week-day-disabled'
                    : ''
                "
              >
                <div
                  v-if="
                    isSameDay(
                      selectedMonth.month === 11
                        ? selectedMonth.year + 1
                        : selectedMonth.year,
                      selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                      nextDays?.[i - 1][j - 1]
                    )
                  "
                  :data-id="inputId"
                  class="rd-input-date-week-day-overlay"
                ></div>
                <span
                  v-if="nextDays?.[i - 1][j - 1]"
                  :data-id="inputId"
                  class="rd-input-date-week-day-date rd-headline-6"
                  :class="
                    isSelected(
                      selectedMonth.month === 11
                        ? selectedMonth.year + 1
                        : selectedMonth.year,
                      selectedMonth.month === 11 ? 0 : selectedMonth.month + 1,
                      nextDays?.[i - 1][j - 1]
                    )
                      ? 'rd-input-date-week-day-date-selected'
                      : ''
                  "
                  >{{ nextDays?.[i - 1][j - 1] }}</span
                >
                <span
                  v-else
                  :data-id="inputId"
                  class="rd-input-date-week-day-dot"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  import gsap from "gsap";

  import { InputDateOption } from "~~/types/general.js";

  interface DateObject {
    date?: number;
    year: number;
    month: number;
  }

  const props = defineProps<{
    input: InputDateOption;
  }>();

  const rdInputDate = ref<HTMLDivElement | null>(null);
  const rdInput = ref<HTMLInputElement | null>(null);

  const inputId = ref<string>(generateId());
  const inputError = ref<string | undefined>(props.input.error);
  const inputModel = ref<string>("");
  const inputValue = ref<string>("");
  const inputMin = ref<string>("");
  const inputMax = ref<string>("");

  const dropDownOpened = ref<boolean>(false);

  const selectedChanging = ref<boolean>(false);
  const selectedMonth = ref<DateObject | null>(null);
  const selectedDate = ref<DateObject>({
    date: -1,
    month: -1,
    year: -1,
  });
  const todayDate = ref<DateObject>({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const currentDays = computed<number[][] | null>(() => {
    if (!selectedMonth.value) return null;
    return getDays(selectedMonth.value.year, selectedMonth.value.month);
  });
  const nextDays = computed<number[][] | null>(() => {
    if (!selectedMonth.value) return null;
    const { month, year }: DateObject = selectedMonth.value;
    if (month === 11) return getDays(year + 1, 0);
    return getDays(year, month + 1);
  });
  const prevDays = computed<number[][] | null>(() => {
    if (!selectedMonth.value) return null;
    const { month, year }: DateObject = selectedMonth.value;
    if (month === 0) return getDays(year - 1, 11);
    return getDays(year, month - 1);
  });

  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const animate = {
    dropDownOpen(rdInputDate: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      tl.to(rdInputDate, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.inOut",
      });
    },
    dropDownClose(rdInputDate: HTMLElement, cb?: () => void): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          if (cb) cb();
        },
      });

      tl.to(rdInputDate, {
        scale: 1.125,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });
    },
  };

  function generateId(): string {
    let str = "";
    for (var i: number = 0; i < 10; i++) {
      str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
        Math.round(Math.random() * 25)
      ];
    }
    return str;
  }
  function dropDownHandler(state: "open" | "close"): void {
    if (state === "open") {
      dropDownOpened.value = true;
      window.addEventListener("mousedown", closeHandler);
      window.addEventListener("touchstart", closeHandler);
      setTimeout(() => {
        if (rdInputDate.value) {
          rdInputDate.value.focus();
          animate.dropDownOpen(rdInputDate.value);
          const { bottom, right }: DOMRect =
            rdInputDate.value.getBoundingClientRect();
          gsap.to(rdInputDate.value, {
            top: window.innerHeight - bottom < 0 ? "auto" : "100%",
            bottom: window.innerHeight - bottom < 0 ? "100%" : "auto",
            right: window.innerWidth - right < 0 ? "0" : "auto",
            left: window.innerWidth - right < 0 ? "auto" : "0",
            duration: 0,
          });
        }
      }, 100);
    } else {
      window.removeEventListener("mousedown", closeHandler);
      window.removeEventListener("touchstart", closeHandler);
      if (dropDownOpened.value && rdInputDate.value) {
        animate.dropDownClose(rdInputDate.value, () => {
          dropDownOpened.value = false;
        });
      }
    }
  }
  function closeHandler(e: MouseEvent | TouchEvent): void {
    if (
      !e.target ||
      (e.target instanceof HTMLElement && e.target.dataset.id !== inputId.value)
    ) {
      dropDownHandler("close");
    }
  }

  function updateModel(e: Event): void {
    if (e.target instanceof HTMLInputElement) {
      inputModel.value = e.target.value;
      const [y, m, d] = e.target.value.split("-");
      if (y && m && d) {
        const year = parseInt(y);
        const month = parseInt(m) - 1;
        const date = parseInt(d);
        selectedDate.value = {
          year,
          month,
          date,
        };
      }
    }
  }

  function selectOption(date: number): void {
    selectedDate.value = {
      date,
      month: selectedMonth.value?.month || 0,
      year: selectedMonth.value?.year || 0,
    };
    dropDownHandler("close");
  }

  function monthHandler(y: number = 0, m: number = 0): string {
    return `${months[m]} ${y}`;
  }

  function isYesterday(y: number = 0, m: number = 0, d: number = 0): boolean {
    if (props.input.threshold) {
      const date = Array.isArray(props.input.threshold)
        ? props.input.threshold[0]
        : props.input.threshold;
      let day: Date = new Date(y, m, d);
      if (d === 32) {
        day = new Date(new Date(y, m + 1, 1).setHours(0, 0, 0, 0) - 1);
      }
      return day.getTime() < date.getTime();
    }
    return false;
  }
  function isTomorrow(y: number = 0, m: number = 0, d: number = 0): boolean {
    if (Array.isArray(props.input.threshold)) {
      const date = props.input.threshold[1];
      const day: Date = new Date(y, m, d);
      return day.getTime() > date.getTime();
    }
    return false;
  }
  function isSameDay(y: number = 0, m: number = 0, d: number = 0): boolean {
    return (
      y === todayDate.value.year &&
      m === todayDate.value.month &&
      d === todayDate.value.date
    );
  }
  function isSameMonth(y: number = 0, m: number = 0): boolean {
    return y === todayDate.value.year && m === todayDate.value.month;
  }
  function isSelected(y: number = 0, m: number = 0, d: number = 0): boolean {
    return (
      y === selectedDate.value.year &&
      m === selectedDate.value.month &&
      d === selectedDate.value.date
    );
  }

  function changeMonth(dir: "left" | "right"): void {
    if (rdInputDate.value && !selectedChanging.value) {
      selectedChanging.value = true;
      const rdInputDateControlsIndicator: HTMLElement[] = gsap.utils.toArray(
        rdInputDate.value.querySelectorAll(".rd-input-date-controls-indicator")
      );
      const rdInputDateWeeks: HTMLElement[] = gsap.utils.toArray(
        rdInputDate.value.querySelectorAll(".rd-input-date-weeks")
      );

      const tl: GSAPTimeline = gsap.timeline({
        onComplete() {
          selectedChanging.value = false;
          if (dir === "left") {
            selectedMonth.value = {
              month:
                selectedMonth.value?.month === 0
                  ? 11
                  : (selectedMonth.value?.month || 0) - 1,
              year:
                selectedMonth.value?.month === 0
                  ? selectedMonth.value?.year - 1
                  : selectedMonth.value?.year || 0,
            };
          } else {
            selectedMonth.value = {
              month:
                selectedMonth.value?.month === 11
                  ? 0
                  : (selectedMonth.value?.month || 0) + 1,
              year:
                selectedMonth.value?.month === 11
                  ? selectedMonth.value?.year + 1
                  : selectedMonth.value?.year || 0,
            };
          }
          gsap.to(rdInputDateControlsIndicator, {
            y: 0,
            duration: 0,
          });
          gsap.to(rdInputDateWeeks, {
            x: 0,
            duration: 0,
          });
        },
      });

      tl.to(rdInputDateControlsIndicator, {
        y: dir === "left" ? "2rem" : "-2rem",
        duration: 0.25,
      }).to(
        rdInputDateWeeks,
        {
          x: dir === "left" ? "100%" : "-100%",
          duration: 0.25,
        },
        "<0"
      );
    }
  }

  function daysInMonth(y: number, m: number): number {
    return 32 - new Date(y, m, 32).getDate();
  }
  function getDays(y: number, m: number): number[][] {
    let date: number = 1;
    const firstDay: number = new Date(y, m).getDay();
    const month: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const week: number[] = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth(y, m)) week.push(0);
        else {
          week.push(date);
          date++;
        }
      }
      month.push(week);
    }
    return month;
  }

  watch(
    () => props.input.error,
    (val) => {
      if (val) inputError.value = val;
    }
  );
  watch(
    () => props.input.value,
    (val, oldVal) => {
      if (val && val !== oldVal) {
        const date: Date = new Date(val);
        selectedMonth.value = selectedDate.value = {
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        };
      }
    }
  );

  watch(
    () => selectedDate.value,
    ({ date, month, year }) => {
      if (date && rdInput.value && year > 1969) {
        inputValue.value = new Date(
          year,
          month,
          date,
          23,
          59,
          59,
          999
        ).toISOString();
        rdInput.value.value = `${year.toString().padStart(4, "0")}-${(month + 1)
          .toString()
          .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
        inputModel.value = rdInput.value.value;
        props.input.model = inputModel.value;
        props.input.value = inputValue.value;
      }
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    if (props.input.threshold) {
      if (Array.isArray(props.input.threshold)) {
        const min = new Date(props.input.threshold[0]);
        const max = new Date(props.input.threshold[1]);
        inputMin.value = `${min.getFullYear()}-${(min.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${min.getDate().toString().padStart(2, "0")}`;
        inputMax.value = `${max.getFullYear()}-${(max.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${max.getDate().toString().padStart(2, "0")}`;
      } else {
        const min = new Date(props.input.threshold);
        inputMin.value = `${min.getFullYear()}-${(min.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${min.getDate().toString().padStart(2, "0")}`;
      }
      const [y, m, d] = inputMin.value.split("-");
      const year = parseInt(y);
      const month = parseInt(m) - 1;
      const date = parseInt(d);
      selectedMonth.value = {
        date,
        month,
        year,
      };
    } else {
      selectedMonth.value = todayDate.value;
    }
    if (props.input.value) {
      const date: Date = new Date(props.input.value);
      selectedDate.value = {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
  });
  onBeforeUnmount(() => {
    window.removeEventListener("mousedown", closeHandler);
    window.removeEventListener("touchstart", closeHandler);
  });
</script>

<style lang="scss" scoped>
  .rd-input-component {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    label.rd-input-label {
      position: relative;
      width: 100%;
      height: 1rem;
      display: flex;
      color: var(--font-main-color);
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
      .rd-input-icon-container {
        position: relative;
        width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      input.rd-input {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 0.5rem;
        border: none;
        border-radius: 0.5rem;
        box-sizing: border-box;
        color: var(--font-main-color);
        background: rgba(0, 0, 0, 0);
        display: flex;
        transition: background-color 0.25s;
        &::-webkit-calendar-picker-indicator {
          position: absolute;
          opacity: 0;
          display: none;
        }
        &::placeholder {
          color: var(--font-main-color);
          opacity: 0.5;
          transition: opacity 0.25s;
        }
        &:hover {
          outline: none;
          background: rgba(0, 0, 0, 0);
          &::placeholder {
            opacity: 1;
          }
        }
        &:focus,
        &.rd-input-focused {
          outline: none;
          background: var(--background-depth-two-color);
        }
        &:focus + .rd-input-border,
        &.rd-input-focused + .rd-input-border {
          border-color: var(--primary-color);
          &::before {
            opacity: 0.25;
          }
        }
      }
      .rd-input-calendar-container {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        width: 2rem;
        height: 2rem;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        padding: 0 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .rd-input-border {
        z-index: 2;
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
          border-radius: 0.5rem;
          border: 3px solid var(--primary-color);
          box-sizing: border-box;
          opacity: 0;
          transition: 0.25s opacity;
        }
      }
      .rd-input-date {
        z-index: 20000000;
        pointer-events: none;
        position: absolute;
        top: 100%;
        width: 13rem;
        background: var(--background-depth-one-color);
        box-shadow: var(--box-shadow);
        opacity: 0;
        padding: 0.5rem 0;
        border-radius: 0.5rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: scale(1.125);
        .rd-input-date-controls-container {
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-input-date-controls-indicator-wrapper {
            position: relative;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .rd-input-date-controls-indicator {
              position: relative;
              height: 100%;
              flex-shrink: 0;
              display: flex;
              align-items: center;
            }
          }
          .rd-input-date-controls {
            position: relative;
            height: 100%;
            display: flex;
          }
        }
        .rd-input-date-days-container {
          position: relative;
          width: 100%;
          margin: 0.75rem 0;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span.rd-input-date-day {
            position: relative;
            width: 1.5rem;
            height: 1rem;
            margin-right: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .rd-input-date-weeks-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          .rd-input-date-weeks {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: flex-start;
            .rd-input-date-week {
              position: relative;
              width: 100%;
              height: 1.5rem;
              margin-bottom: 0.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-input-date-week-day {
                position: relative;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                .rd-input-date-week-day-overlay {
                  pointer-events: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.5rem;
                  border: 1px solid var(--primary-color);
                  box-sizing: border-box;
                }
                span.rd-input-date-week-day-date {
                  cursor: pointer;
                  position: relative;
                  width: 100%;
                  height: 100%;
                  line-height: 1;
                  opacity: 0.5;
                  background: rgba(0, 0, 0, 0);
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &.rd-input-date-week-day-date-selected {
                    opacity: 1;
                    background: var(--primary-color);
                    color: var(--font-secondary-color);
                  }
                }
                span.rd-input-date-week-day-dot {
                  pointer-events: none;
                  position: relative;
                  width: 0.25rem;
                  height: 0.25rem;
                  border-radius: 50%;
                  background: var(--font-main-color);
                  opacity: 0.05;
                }
                &.rd-input-date-week-day-disabled {
                  pointer-events: none;
                  opacity: 0.5;
                }
              }
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        &.rd-input-date-opened {
          pointer-events: all;
        }
      }
    }
    span.rd-input-error {
      position: relative;
      width: 100%;
      height: 1rem;
      color: var(--error-color);
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      span.rd-text-wrapper {
        overflow: visible;
        justify-content: flex-start;
        span.rd-text-container {
          justify-content: flex-start;
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
  }
</style>
