import { initAccountGift } from "../../../packages/shared/account-gift-init";
import type { GiftAccount, GiftAccounts } from "../../../packages/shared/types";
import { themeIconUrl } from "../../../packages/shared/types";

export { initAccountGift };

function accountCopyLine(account: GiftAccount): string {
  return `${account.bank} ${account.number}`;
}

function renderAccountCard(account: GiftAccount): string {
  const copyLine = accountCopyLine(account);
  const copyIconSrc = themeIconUrl("theme03", "btn-copy.svg");

  return /* html */ `
        <div class="rounded-[8px] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div class="mb-[20px] flex items-baseline justify-between text-[14px] tracking-tighter text-[#111111]">
            <span class="font-normal">${account.relation}</span>
            <span class="font-normal">${account.name}</span>
          </div>
          <div class="flex items-center justify-between gap-[8px] rounded-[6px] bg-[#F7F7F7] pl-[16px] pr-[22px] py-[14px]">
            <div class="min-w-[0px] text-left font-pretendard text-[#5D5D5D]">
              <p class="m-0 text-[12px]">${account.bank}</p>
              <p class="m-0 mt-[4px] text-[12px] font-normal tabular-nums tracking-tight">
                ${account.number}
              </p>
            </div>
            <button
              type="button"
              data-copy-account="${copyLine}"
              class="inline-flex shrink-0 items-center justify-center border-[0px] bg-transparent p-0"
              aria-label="계좌번호 복사"
            >
              <img
                src="${copyIconSrc}"
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

  return /* html */ `
    <section
      id="gift-accounts"
      class="pt-[86px] pb-[84px] px-[30px] text-center"
      aria-label="마음 전하실 곳"
    >
      <h2 class="m-0 text-[16px] font-medium tracking-tight text-[#111111]">
        마음 전하실 곳
      </h2>

      <div class="mx-auto mt-[14px] max-w-[280px] text-[14px] leading-[1.7] tracking-tight text-[#5D5D5D]">
        <p class="m-0">축하의 마음을 전해주시는 모든 분들께</p>
        <p class="m-0">깊은 감사의 마음을 전합니다.</p>
      </div>

      <div
        class="mt-[32px] flex border-b-[1px] border-[#eeeeee]"
        role="tablist"
        aria-label="계좌 안내 대상"
      >
        <button
          type="button"
          role="tab"
          data-gift-tab="groom"
          aria-selected="true"
          class="flex-1 border-b-2 border-[#111111] py-[12px] text-[14px] font-medium tracking-tight text-[#111111]"
        >
          신랑측에게
        </button>
        <button
          type="button"
          role="tab"
          data-gift-tab="bride"
          aria-selected="false"
          class="flex-1 border-b-2 border-transparent py-[12px] text-[14px] font-extralight tracking-tight text-[#ABABAB]"
        >
          신부측에게
        </button>
      </div>

      <div class="mt-[40px] space-y-[12px] text-left" data-gift-panel="groom">
        ${groomCards}
      </div>
      <div class="mt-[40px] space-y-[12px] text-left" data-gift-panel="bride" hidden>
        ${brideCards}
      </div>
    </section>`;
}
