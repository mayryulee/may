import { copyText, COPY_TOAST, showCopyToast } from "./copy-toast";
import type { GiftAccounts } from "./types";

export type GiftSide = keyof GiftAccounts;

function setActiveTab(root: ParentNode, side: GiftSide): void {
  root.querySelectorAll<HTMLButtonElement>("[data-gift-tab]").forEach((btn) => {
    const active = btn.dataset.giftTab === side;
    btn.setAttribute("aria-selected", String(active));
    btn.classList.toggle("border-[#111111]", active);
    btn.classList.toggle("text-[#111111]", active);
    btn.classList.toggle("font-medium", active);
    btn.classList.toggle("border-transparent", !active);
    btn.classList.toggle("text-[#ABABAB]", !active);
    btn.classList.toggle("font-extralight", !active);
  });

  root.querySelectorAll<HTMLElement>("[data-gift-panel]").forEach((panel) => {
    const show = panel.dataset.giftPanel === side;
    panel.hidden = !show;
  });
}

export function initAccountGift(root: ParentNode): void {
  const section = root.querySelector("#gift-accounts");
  if (!section) return;

  root.querySelectorAll<HTMLButtonElement>("[data-gift-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const side = btn.dataset.giftTab as GiftSide | undefined;
      if (side === "groom" || side === "bride") setActiveTab(root, side);
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-copy-account]").forEach(
    (btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copyAccount;
        if (!text) return;
        try {
          await copyText(text);
          showCopyToast(COPY_TOAST.account);
        } catch {
          showCopyToast(COPY_TOAST.failed);
        }
      });
    },
  );

  setActiveTab(root, "groom");
}
