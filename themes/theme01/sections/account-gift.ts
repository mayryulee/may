import { initAccountGift } from "../../../packages/shared/account-gift-init";
import type { GiftAccount, GiftAccounts } from "../../../packages/shared/types";
import { themeIconUrl } from "../../../packages/shared/types";
import { bodyFontClass } from "../tokens";

export { initAccountGift };

function accountCopyLine(account: GiftAccount): string {
  return `${account.bank} ${account.number}`;
}

function renderAccountCard(account: GiftAccount): string {
  const copyLine = accountCopyLine(account);

  return `
        <div class="rounded-lg bg-white px-5 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div class="mb-5 flex items-baseline justify-between ${bodyFontClass} text-[13px] tracking-tight text-[#111111]">
            <span class="font-normal">${account.relation}</span>
            <span class="font-normal">${account.name}</span>
          </div>
          <div class="flex items-center justify-between gap-2 rounded-md bg-[#F7F7F7] pl-4 pr-4 py-3.5">
            <div class="min-w-0 text-left font-pretendard text-[#5D5D5D]">
              <p class="m-0 text-[12px]">${account.bank}</p>
              <p class="m-0 mt-1 text-[14px] font-normal tabular-nums tracking-tight">
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
                src="${themeIconUrl("theme01", "copy.svg")}"
                alt=""
                class="block h-[17px] w-[17px] opacity-80"
                decoding="async"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>`;
}

export function renderGiftAccountsHtml(accounts: GiftAccounts): string {
  const groomCards = accounts.groom.map((a) => renderAccountCard(a)).join("");
  const brideCards = accounts.bride.map((a) => renderAccountCard(a)).join("");

  return `
    <section
      id="gift-accounts"
      class="mt-32 pb-14 text-center ${bodyFontClass}"
      aria-label="마음 전하실 곳"
    >
      <div class="mx-auto h-px w-10 bg-[#000000]" aria-hidden="true"></div>

      <h2 class="mt-8 text-[16px] font-medium tracking-tight text-[#111111]">
        마음 전하실 곳
      </h2>

      <div class="mx-auto mt-4 max-w-[280px] text-[14px] font-extralight leading-[1.85] tracking-tight text-[#5D5D5D]">
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
