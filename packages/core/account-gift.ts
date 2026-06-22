import { copyText, COPY_TOAST, showCopyToast } from "./copy-toast";
import { themeBodyFontClass } from "./section-heading";
import type { GiftAccount, GiftAccounts, ThemeId } from "./types";
import { themeIconUrl } from "./types";

export type GiftSide = keyof GiftAccounts;

function accountCopyLine(account: GiftAccount): string {
  return `${account.bank} ${account.number}`;
}

function renderAccountCard(account: GiftAccount, themeId: ThemeId): string {
  const copyLine = accountCopyLine(account);
  const headerClass = `mb-5 flex items-baseline justify-between ${themeBodyFontClass(themeId)} text-[13px] tracking-tight text-[#111111]`;

  return `
        <div class="rounded-lg bg-white px-5 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div
            class="${headerClass}"
          >
            <span class="font-normal">${account.relation}</span>
            <span class="font-normal">${account.name}</span>
          </div>
          <div
            class="flex items-center justify-between gap-2 rounded-md bg-[#F7F7F7] pl-4 pr-4 py-3.5"
          >
            <div class="min-w-0 text-left font-pretendard text-[#5D5D5D]">
              <p class="m-0 text-[12px]">
                ${account.bank}
              </p>
              <p
                class="m-0 mt-1 text-[14px] font-normal tabular-nums tracking-tight"
              >
                ${account.number}
              </p>
            </div>
            <button
              type="button"
              data-copy-account="${copyLine}"
              class="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0"
              aria-label="계좌번호 복사"
            >
              <img
                src="${themeIconUrl(themeId, "copy.svg")}"
                alt=""
                class="block h-[17px] w-[17px] opacity-80"
                decoding="async"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>`;
}

export function renderGiftAccountsHtml(
  accounts: GiftAccounts,
  themeId: ThemeId,
): string {
  const groomCards = accounts.groom.map((a) => renderAccountCard(a, themeId)).join("");
  const brideCards = accounts.bride.map((a) => renderAccountCard(a, themeId)).join("");

  if (themeId === "theme02") {
    return `
    <section
      id="gift-accounts"
      class="mt-24 mb-24 text-center ${themeBodyFontClass(themeId)}"
      aria-label="마음 전하실 곳"
    >
      <h2
        class="m-0 text-[16px] font-medium tracking-tight text-[#111111]"
      >
        마음 전하실 곳
      </h2>

      <div
        class="mx-auto mt-4 max-w-[280px] text-[14px] font-extralight leading-[1.85] tracking-tight text-[#5D5D5D]"
      >
        <p class="m-0">축하의 마음을 전해주시는 모든 분들께</p>
        <p class="m-0">깊은 감사의 마음을 전합니다.</p>
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
          class="flex-1 border-b-2 border-[#111111] py-3 text-[14px] font-medium tracking-tight text-[#111111]"
        >
          신랑측에게
        </button>
        <button
          type="button"
          role="tab"
          data-gift-tab="bride"
          aria-selected="false"
          class="flex-1 border-b-2 border-transparent py-3 text-[14px] font-extralight tracking-tight text-[#ABABAB]"
        >
          신부측에게
        </button>
      </div>

      <div class="mt-10 space-y-3 text-left" data-gift-panel="groom">
        ${groomCards}
      </div>
      <div class="mt-10 space-y-3 text-left" data-gift-panel="bride" hidden>
        ${brideCards}
      </div>
    </section>`;
  }

  return `
    <section
      id="gift-accounts"
      class="mt-32 pb-14 text-center ${themeBodyFontClass(themeId)}"
      aria-label="마음 전하실 곳"
    >
      <div
        class="mx-auto h-px w-10 bg-[#000000]"
        aria-hidden="true"
      ></div>

      <h2
        class="mt-8 text-[16px] font-medium tracking-tight text-[#111111]"
      >
        마음 전하실 곳
      </h2>

      <div
        class="mx-auto mt-4 max-w-[280px] text-[14px] font-extralight leading-[1.85] tracking-tight text-[#5D5D5D]"
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
          class="flex-1 border-b-2 border-[#111111] py-3 text-[14px] font-medium tracking-tight text-[#111111]"
        >
          신랑측에게
        </button>
        <button
          type="button"
          role="tab"
          data-gift-tab="bride"
          aria-selected="false"
          class="flex-1 border-b-2 border-transparent py-3 text-[14px] font-extralight tracking-tight text-[#ABABAB]"
        >
          신부측에게
        </button>
      </div>

      <div class="mt-10 space-y-3 text-left" data-gift-panel="groom">
        ${groomCards}
      </div>
      <div class="mt-10 space-y-3 text-left" data-gift-panel="bride" hidden>
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
