import { defineStore } from "pinia";
import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning" | "loading";
  exiting?: boolean;
}

let nextId = 0;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  function show(message: string, type: Toast["type"] = "info", persistent = false): number {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    if (!persistent) setTimeout(() => dismiss(id), 4000);
    return id;
  }

  function update(id: number, message: string, type: Toast["type"]) {
    const t = toasts.value.find((t) => t.id === id);
    if (!t) return;
    t.message = message;
    t.type = type;
    setTimeout(() => dismiss(id), 4000);
  }

  function dismiss(id: number) {
    const t = toasts.value.find((t) => t.id === id);
    if (!t) return;
    t.exiting = true;
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 300);
  }

  return { toasts, show, update, dismiss };
});

export function playNotification() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch { }
}
