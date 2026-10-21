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

  initContactModal(root);

  setActiveTab(root, "groom");
}

function initContactModal(root: ParentNode): void {
  const modal = root.querySelector<HTMLElement>("#gift-contact-modal");
  if (!modal) return;

  const close = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
  };

  root.querySelectorAll<HTMLButtonElement>("[data-contact-phone]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const phone = btn.dataset.contactPhone ?? "";
      const setText = (selector: string, text: string) => {
        const el = modal.querySelector<HTMLElement>(selector);
        if (el) el.textContent = text;
      };
      setText("[data-contact-relation]", btn.dataset.contactRelation ?? "");
      setText("[data-contact-name]", btn.dataset.contactName ?? "");
      setText("[data-contact-phone-text]", phone);
      modal
        .querySelector<HTMLAnchorElement>("[data-contact-call]")
        ?.setAttribute("href", `tel:${phone.replace(/[^0-9+]/g, "")}`);

      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");

      try {
        await copyText(phone);
        showCopyToast(COPY_TOAST.phone);
      } catch {
        showCopyToast(COPY_TOAST.failed);
      }
    });
  });

  modal.querySelectorAll("[data-contact-close]").forEach((el) => {
    el.addEventListener("click", close);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
}
