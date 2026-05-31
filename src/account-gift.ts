/** 마음 전하실 곳 — 계좌 정보 (번호는 실제 계좌로 교체) */
export const GIFT_ACCOUNTS = {
  groom: [
    {
      relation: "신랑",
      name: "김정호",
      bank: "신한은행",
      number: "123-45-67890",
    },
    {
      relation: "신랑 아버지",
      name: "김종욱",
      bank: "신한은행",
      number: "123-45-67891",
    },
    {
      relation: "신랑 어머니",
      name: "최은희",
      bank: "신한은행",
      number: "123-45-67892",
    },
  ],
  bride: [
    {
      relation: "신부",
      name: "박채현",
      bank: "신한은행",
      number: "123-45-67893",
    },
    {
      relation: "신부 아버지",
      name: "박중호",
      bank: "신한은행",
      number: "123-45-67894",
    },
    {
      relation: "신부 어머니",
      name: "김혜진",
      bank: "신한은행",
      number: "123-45-67895",
    },
  ],
} as const;

export type GiftSide = keyof typeof GIFT_ACCOUNTS;

type GiftAccount = (typeof GIFT_ACCOUNTS)[GiftSide][number];

function accountCopyLine(account: GiftAccount): string {
  return `${account.bank} ${account.number}`;
}

function renderAccountCard(account: GiftAccount): string {
  const copyLine = accountCopyLine(account);
  return `
        <div class="rounded-lg bg-white px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div
            class="mb-3 flex items-baseline justify-between font-noto text-[0.82rem] tracking-tight text-[#111111]"
          >
            <span class="font-extralight text-[#666666]">${account.relation}</span>
            <span class="font-normal">${account.name}</span>
          </div>
          <div
            class="flex items-center justify-between gap-3 rounded-md bg-[#F5F5F5] px-4 py-3.5"
          >
            <div class="min-w-0 text-left font-noto">
              <p class="m-0 text-[0.78rem] font-extralight text-[#666666]">
                ${account.bank}
              </p>
              <p
                class="m-0 mt-1 text-[0.88rem] font-normal tabular-nums tracking-tight text-[#111111]"
              >
                ${account.number}
              </p>
            </div>
            <button
              type="button"
              data-copy-account="${copyLine}"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-[#888888] active:text-[#111111]"
              aria-label="계좌번호 복사"
            >
              <img
                src="/icons/copy.svg"
                alt=""
                width="17"
                height="17"
                class="block h-[17px] w-[17px]"
                decoding="async"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>`;
}

export function renderGiftAccountsHtml(): string {
  const groomCards = GIFT_ACCOUNTS.groom.map(renderAccountCard).join("");
  const brideCards = GIFT_ACCOUNTS.bride.map(renderAccountCard).join("");
  return `
    <section
      id="gift-accounts"
      class="mt-16 pb-14 text-center font-noto"
      aria-label="마음 전하실 곳"
    >
      <div
        class="mx-auto h-px w-10 bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <h2
        class="mt-8 text-[1rem] font-medium tracking-tight text-[#111111]"
      >
        마음 전하실 곳
      </h2>

      <div
        class="mx-auto mt-4 max-w-[280px] text-[0.72rem] font-extralight leading-[1.85] tracking-tight text-[#888888]"
      >
        <p class="m-0">참석이 어려우신 분들을 위해 기재했습니다.</p>
        <p class="m-0">너그러운 마음으로 양해 부탁드립니다.</p>
      </div>

      <div
        class="mt-8 flex border-b border-[#eeeeee]"
        role="tablist"
        aria-label="계좌 안내 대상"
      >
        <button
          type="button"
          role="tab"
          data-gift-tab="groom"
          aria-selected="true"
          class="flex-1 border-b-2 border-[#111111] py-3 text-[0.82rem] font-medium tracking-tight text-[#111111]"
        >
          신랑측에게
        </button>
        <button
          type="button"
          role="tab"
          data-gift-tab="bride"
          aria-selected="false"
          class="flex-1 border-b-2 border-transparent py-3 text-[0.82rem] font-extralight tracking-tight text-[#999999]"
        >
          신부측에게
        </button>
      </div>

      <div class="mt-6 space-y-3 text-left" data-gift-panel="groom">
        ${groomCards}
      </div>
      <div class="mt-6 space-y-3 text-left" data-gift-panel="bride" hidden>
        ${brideCards}
      </div>

      <div
        id="gift-copy-toast"
        class="pointer-events-none fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 translate-y-6 rounded-full bg-[#333333]/92 px-5 py-2.5 font-noto text-[0.78rem] font-normal tracking-tight text-white opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
        role="status"
        aria-live="polite"
        hidden
      >
        복사했습니다
      </div>
    </section>`;
}

let copyToastTimer: number | undefined;
let copyToastHideTimer: number | undefined;

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* in-app 브라우저 등 fallback */
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("copy failed");
}

function resetToastToEnterStart(toast: HTMLElement): void {
  toast.style.transition = "none";
  toast.classList.remove("opacity-100", "translate-y-0");
  toast.classList.add("opacity-0", "translate-y-6");
  void toast.offsetHeight;
  toast.style.transition = "";
}

function hideCopyToast(toast: HTMLElement): void {
  toast.style.transition = "opacity 220ms ease-out";
  toast.classList.remove("opacity-100");
  toast.classList.add("opacity-0");

  copyToastHideTimer = window.setTimeout(() => {
    toast.hidden = true;
    toast.style.transition = "none";
    toast.classList.add("translate-y-6");
    void toast.offsetHeight;
    toast.style.transition = "";
  }, 220);
}

function showCopyToast(root: ParentNode, ok: boolean): void {
  const toast = root.querySelector<HTMLElement>("#gift-copy-toast");
  if (!toast) return;

  if (copyToastTimer) window.clearTimeout(copyToastTimer);
  if (copyToastHideTimer) window.clearTimeout(copyToastHideTimer);

  toast.textContent = ok ? "복사했습니다" : "복사에 실패했습니다";
  toast.hidden = false;

  resetToastToEnterStart(toast);

  toast.style.transition =
    "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease-out";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove("opacity-0", "translate-y-6");
      toast.classList.add("opacity-100", "translate-y-0");
    });
  });

  copyToastTimer = window.setTimeout(() => {
    hideCopyToast(toast);
  }, 1500);
}

function setActiveTab(root: ParentNode, side: GiftSide): void {
  root.querySelectorAll<HTMLButtonElement>("[data-gift-tab]").forEach((btn) => {
    const active = btn.dataset.giftTab === side;
    btn.setAttribute("aria-selected", String(active));
    btn.classList.toggle("border-[#111111]", active);
    btn.classList.toggle("text-[#111111]", active);
    btn.classList.toggle("font-medium", active);
    btn.classList.toggle("border-transparent", !active);
    btn.classList.toggle("text-[#999999]", !active);
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
          showCopyToast(root, true);
        } catch {
          showCopyToast(root, false);
        }
      });
    },
  );

  setActiveTab(root, "groom");
}
