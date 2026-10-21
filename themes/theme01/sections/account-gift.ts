import { initAccountGift } from "../../../packages/shared/account-gift-init";
import type { GiftAccount, GiftAccounts } from "../../../packages/shared/types";
import { themeIconUrl } from "../../../packages/shared/types";

export { initAccountGift };

function accountCopyLine(account: GiftAccount): string {
  return `${account.bank} ${account.number}`;
}

function renderPhoneButton(account: GiftAccount): string {
  if (!account.phone) return "";
  return /* html */ `
    <button
      type="button"
      data-contact-phone="${account.phone}"
      data-contact-name="${account.name}"
      data-contact-relation="${account.relation}"
      class="inline-flex shrink-0 items-center justify-center border-[0px] bg-transparent p-0"
      aria-label="${account.name} 연락처 보기"
    >
      <img
        src="${themeIconUrl("theme01", "phone.svg")}"
        alt=""
        class="block h-[14px] w-[14px]"
        decoding="async"
        aria-hidden="true"
      />
    </button>`;
}

/** 연락처 팝업 — 방명록 삭제 팝업과 같은 스타일 */
function renderContactModalHtml(): string {
  return /* html */ `
    <div
      id="gift-contact-modal"
      class="fixed inset-0 z-[110] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-contact-title"
    >
      <div class="absolute inset-0 bg-black/35" data-contact-close></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center px-[24px] py-[40px]">
        <div class="relative w-full rounded-[8px] bg-[#F7F7F7] px-[24px] py-[32px] text-center font-pretendard tracking-tight shadow-lg">
          <button
            type="button"
            data-contact-close
            class="absolute top-[16px] right-[16px] inline-flex h-[32px] w-[32px] items-center justify-center border-[0px] bg-transparent p-0 font-pretendard text-[20px] tracking-tight text-[#999999]"
            aria-label="닫기"
          >
            ×
          </button>
          <p data-contact-relation class="m-0 text-[12px] font-extralight tracking-tight text-[#888888]"></p>
          <h2 id="gift-contact-title" data-contact-name class="m-0 mt-[4px] text-[16px] font-medium tracking-tight text-[#111111]"></h2>
          <p data-contact-phone-text class="m-0 mt-[20px] rounded-[8px] bg-white px-[16px] py-[14px] text-[16px] font-normal tabular-nums tracking-tight text-[#111111]"></p>
          <p class="m-0 mt-[8px] text-[12px] font-extralight leading-relaxed tracking-tight text-[#888888]">
            연락처가 복사되었습니다
          </p>
          <a
            data-contact-call
            href="#"
            class="mt-[24px] block w-full rounded-[8px] bg-[#111111] py-[13px] font-pretendard text-[14px] font-normal tracking-tight text-white no-underline"
          >
            전화 걸기
          </a>
        </div>
      </div>
    </div>`;
}

function renderAccountCard(account: GiftAccount): string {
  const copyLine = accountCopyLine(account);
  const copyIconSrc = themeIconUrl("theme01", "btn-copy.svg");

  return /* html */ `
        <div class="rounded-[8px] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div class="mb-[20px] flex items-baseline justify-between text-[14px] tracking-tighter text-[#111111]">
            <span class="font-normal">${account.relation}</span>
            <span class="inline-flex items-center gap-[6px] font-normal">
              ${account.name}
              ${renderPhoneButton(account)}
            </span>
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

const DEFAULT_MESSAGE_LINES = [
  "참석이 어려우신 분들을 위해 기재했습니다.",
  "너그러운 마음으로 양해 부탁드립니다.",
];

export function renderGiftAccountsHtml(accounts: GiftAccounts): string {
  const groomCards = accounts.groom.map((a) => renderAccountCard(a)).join("");
  const brideCards = accounts.bride.map((a) => renderAccountCard(a)).join("");
  const messageLines = accounts.messageLines ?? DEFAULT_MESSAGE_LINES;

  return /* html */ `
    <section id="gift-accounts" class="pt-[80px] pb-[120px] px-[30px] text-center " aria-label="마음 전하실 곳">
      <div class="mx-auto h-px w-[50px] bg-[#000000]" aria-hidden="true"></div>

      <h2 class="mt-[40px] text-[16px] tracking-tighter">
        마음 전하실 곳
      </h2>

      <div class="mx-auto mt-[18px] text-[16px] font-extralight leading-[1.8] tracking-tighter text-[#5D5D5D]">
        ${messageLines.map((line) => `<p class="m-0">${line}</p>`).join("")}
      </div>

      <div
        class="mt-[47px] flex border-b-[1px] border-[#eeeeee]"
        role="tablist"
        aria-label="계좌 안내 대상"
      >
        <button
          type="button"
          role="tab"
          data-gift-tab="groom"
          aria-selected="true"
          class="flex-1 border-b-2 border-[#111111] py-[12px] text-[14px] tracking-tighter text-[#111111]"
        >
          신랑측에게
        </button>
        <button
          type="button"
          role="tab"
          data-gift-tab="bride"
          aria-selected="false"
          class="flex-1 border-b-2 border-transparent py-[12px] text-[14px] tracking-tighter text-[#ABABAB]"
        >
          신부측에게
        </button>
      </div>

      <div class="mt-[54px] space-y-[16px] text-left" data-gift-panel="groom">
        ${groomCards}
      </div>
      <div class="mt-[54px] space-y-[16px] text-left" data-gift-panel="bride" hidden>
        ${brideCards}
      </div>
      ${renderContactModalHtml()}
    </section>`;
}
