import { copyText, COPY_TOAST, showCopyToast } from "./copy-toast";
import type { GiftAccount, GiftAccounts } from "./types";

export type GiftSide = keyof GiftAccounts;

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

export function renderGiftAccountsHtml(accounts: GiftAccounts): string {
  const groomCards = accounts.groom.map(renderAccountCard).join("");
  const brideCards = accounts.bride.map(renderAccountCard).join("");
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
    </section>`;
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
          showCopyToast(COPY_TOAST.account);
        } catch {
          showCopyToast(COPY_TOAST.failed);
        }
      });
    },
  );

  setActiveTab(root, "groom");
}
