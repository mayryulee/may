import {
  addGuestbookEntry,
  deleteGuestbookEntry,
  formatGuestbookDate,
  listGuestbookEntries,
  type GuestbookEntry,
} from "./guestbook-store";
import type { ThemeId } from "./types";
import { themeIconUrl } from "./types";

const MODALS = ["write", "list", "delete"] as const;
type ModalName = (typeof MODALS)[number];

const SUBMIT_BTN =
  "guestbook-submit mt-2 w-full rounded-md border-0 py-3.5 font-noto text-[0.82rem] font-normal tracking-tight text-white transition-colors duration-200";

let deleteTargetId: string | null = null;

function modalEl(root: ParentNode, name: ModalName): HTMLElement | null {
  return root.querySelector<HTMLElement>(`#guestbook-modal-${name}`);
}

function openModal(root: ParentNode, name: "write" | "list"): void {
  MODALS.forEach((m) => {
    const el = modalEl(root, m);
    if (!el) return;
    const show = m === name;
    el.classList.toggle("hidden", !show);
    el.setAttribute("aria-hidden", String(!show));
  });
  document.body.classList.add("overflow-hidden");
}

function clearDeleteError(root: ParentNode): void {
  const deleteError = root.querySelector<HTMLElement>("#guestbook-delete-error");
  if (!deleteError) return;
  deleteError.textContent = "";
  deleteError.classList.add("hidden");
}

function openDeleteOverlay(root: ParentNode): void {
  const el = modalEl(root, "delete");
  if (!el) return;
  clearDeleteError(root);
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
  document.body.classList.add("overflow-hidden");
  syncDeleteSubmit(root);
}

function closeModals(root: ParentNode): void {
  MODALS.forEach((m) => {
    const el = modalEl(root, m);
    if (!el) return;
    el.classList.add("hidden");
    el.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("overflow-hidden");
  deleteTargetId = null;
}

function closeDeleteModal(root: ParentNode): void {
  const el = modalEl(root, "delete");
  el?.classList.add("hidden");
  el?.setAttribute("aria-hidden", "true");
  deleteTargetId = null;
  const deleteForm = root.querySelector<HTMLFormElement>("#guestbook-delete-form");
  deleteForm?.reset();
  clearDeleteError(root);
  syncDeleteSubmit(root);
  const listEl = modalEl(root, "list");
  if (listEl && !listEl.classList.contains("hidden")) return;
  document.body.classList.remove("overflow-hidden");
}

function setSubmitState(button: HTMLButtonElement | null, enabled: boolean): void {
  if (!button) return;
  button.disabled = !enabled;
}

function fieldValue(form: HTMLFormElement, name: string, trim = true): string {
  const el = form.elements.namedItem(name);
  let raw = "";
  if (el instanceof RadioNodeList) {
    raw = String(el.value ?? "");
  } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    raw = el.value;
  }
  return trim ? raw.trim() : raw;
}

function syncWriteSubmit(root: ParentNode): void {
  const form = root.querySelector<HTMLFormElement>("#guestbook-write-form");
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !button) return;
  const name = fieldValue(form, "name");
  const password = fieldValue(form, "password", false);
  const message = fieldValue(form, "message");
  setSubmitState(button, Boolean(name && password && message));
}

function syncDeleteSubmit(root: ParentNode): void {
  const form = root.querySelector<HTMLFormElement>("#guestbook-delete-form");
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !button) return;
  setSubmitState(button, Boolean(fieldValue(form, "password")));
}

function bindSubmitSync(
  form: HTMLFormElement | null,
  sync: () => void,
): void {
  if (!form) return;
  form.addEventListener("input", sync);
  form.addEventListener("change", sync);
  form.addEventListener("compositionend", sync);
}

function renderEntryCard(entry: GuestbookEntry): string {
  return `
    <article
      class="relative rounded-lg bg-white px-5 py-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      data-entry-id="${entry.id}"
    >
      <button
        type="button"
        data-entry-delete="${entry.id}"
        class="absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center border-0 bg-transparent p-0 text-[1.1rem] leading-none text-[#cccccc]"
        aria-label="글 삭제"
      >
        ×
      </button>
      <p
        class="m-0 pr-6 font-noto text-[0.82rem] font-normal leading-[1.85] tracking-tight text-[#333333]"
      >
        ${escapeHtml(entry.message)}
      </p>
      <div
        class="mt-5 flex items-end justify-between gap-3 font-noto text-[0.68rem] font-extralight text-[#999999]"
      >
        <span>From ${escapeHtml(entry.name)}</span>
        <span class="shrink-0 tabular-nums">${formatGuestbookDate(entry.createdAt)}</span>
      </div>
    </article>`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function refreshList(root: ParentNode, clientId: string): Promise<void> {
  const list = root.querySelector<HTMLElement>("#guestbook-list");
  if (!list) return;
  const entries = await listGuestbookEntries(clientId);
  if (entries.length === 0) {
    list.innerHTML = `
      <p class="m-0 py-10 text-center font-noto text-[0.78rem] font-extralight text-[#999999]">
        아직 남겨진 방명록이 없습니다.
      </p>`;
    return;
  }
  list.innerHTML = entries.map(renderEntryCard).join("");
}

export function renderGuestbookHtml(themeId: ThemeId): string {
  return `
    <section
      id="guestbook"
      class="mt-16 pb-14 text-center font-noto"
      aria-label="방명록"
    >
      <div
        class="mx-auto h-px w-10 bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <p
        class="m-0 mt-8 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]"
      >
        Message
      </p>
      <p
        class="m-0 mt-2.5 text-[0.72rem] font-extralight tracking-[0.06em] text-[#666666]"
      >
        저희 둘에게 따뜻한 방명록을 남겨주세요
      </p>

      <img
        class="mx-auto mt-8 block h-auto w-[9.5rem] max-w-[60%]"
        src="${themeIconUrl(themeId, "message.svg")}"
        alt=""
        width="194"
        height="93"
        decoding="async"
        aria-hidden="true"
      />

      <div class="mx-auto mt-10 max-w-full space-y-2.5">
        <button
          type="button"
          id="guestbook-open-write"
          class="block w-full rounded-sm border-0 bg-[#111111] py-3.5 font-noto text-[0.82rem] font-normal tracking-tight text-white"
        >
          메시지 남기기
        </button>
        <button
          type="button"
          id="guestbook-open-list"
          class="block w-full rounded-sm border border-[#111111] bg-white py-3.5 font-noto text-[0.82rem] font-normal tracking-tight text-[#111111]"
        >
          방명록 전체보기
        </button>
      </div>
    </section>

    <div
      id="guestbook-modal-write"
      class="fixed inset-0 z-[100] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-write-title"
    >
      <div
        class="absolute inset-0 bg-black/35"
        data-guestbook-backdrop="write"
      ></div>
      <div
        class="relative mx-auto flex h-full max-w-[430px] items-center px-6 py-10"
      >
        <div class="relative w-full rounded-xl bg-white px-6 py-8 text-center shadow-lg">
          <button
            type="button"
            data-guestbook-close
            class="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0 text-[1.25rem] text-[#999999]"
            aria-label="닫기"
          >
            ×
          </button>
          <h2
            id="guestbook-write-title"
            class="m-0 font-noto text-[1rem] font-medium tracking-tight text-[#111111]"
          >
            축하 메시지 작성하기
          </h2>
          <p
            class="m-0 mt-2 text-[0.72rem] font-extralight tracking-tight text-[#888888]"
          >
            저희 둘의 결혼을 함께 축하해 주세요
          </p>
          <form id="guestbook-write-form" class="mt-6 space-y-2.5 text-left">
            <input
              name="name"
              type="text"
              maxlength="30"
              required
              placeholder="성함을 남겨주세요"
              class="w-full rounded-md border-0 bg-[#F5F5F5] px-4 py-3.5 font-noto text-[0.78rem] font-extralight text-[#111111] outline-none placeholder:text-[#aaaaaa]"
            />
            <input
              name="password"
              type="password"
              maxlength="20"
              required
              placeholder="비밀번호를 입력해 주세요"
              class="w-full rounded-md border-0 bg-[#F5F5F5] px-4 py-3.5 font-noto text-[0.78rem] font-extralight text-[#111111] outline-none placeholder:text-[#aaaaaa]"
            />
            <textarea
              name="message"
              maxlength="200"
              required
              rows="4"
              placeholder="200자 이내로 작성해 주세요"
              class="min-h-[7.5rem] w-full resize-none rounded-md border-0 bg-[#F5F5F5] px-4 py-3.5 font-noto text-[0.78rem] font-extralight leading-[1.75] text-[#111111] outline-none placeholder:text-[#aaaaaa]"
            ></textarea>
            <p
              id="guestbook-write-error"
              class="m-0 hidden text-center text-[0.68rem] text-[#c44]"
            ></p>
            <button
              type="submit"
              disabled
              class="${SUBMIT_BTN}"
            >
              작성 완료
            </button>
          </form>
        </div>
      </div>
    </div>

    <div
      id="guestbook-modal-list"
      class="fixed inset-0 z-[100] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-list-title"
    >
      <div
        class="absolute inset-0 bg-black/35"
        data-guestbook-backdrop="list"
      ></div>
      <div
        class="relative mx-auto flex h-full max-w-[430px] items-center px-6 py-10"
      >
        <div
          class="relative flex max-h-[min(85vh,34rem)] w-full flex-col rounded-xl bg-[#F5F5F5] px-5 py-6 shadow-lg"
        >
          <button
            type="button"
            data-guestbook-close
            class="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0 text-[1.25rem] text-[#999999]"
            aria-label="닫기"
          >
            ×
          </button>
          <h2
            id="guestbook-list-title"
            class="m-0 shrink-0 text-center font-noto text-[1rem] font-medium tracking-tight text-[#111111]"
          >
            방명록 전체보기
          </h2>
          <div
            id="guestbook-list"
            class="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pb-1"
          ></div>
        </div>
      </div>
    </div>

    <div
      id="guestbook-modal-delete"
      class="fixed inset-0 z-[110] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guestbook-delete-title"
    >
      <div
        class="absolute inset-0 bg-black/35"
        data-guestbook-backdrop="delete"
      ></div>
      <div
        class="relative mx-auto flex h-full max-w-[430px] items-center px-6 py-10"
      >
        <div class="relative w-full rounded-xl bg-[#F5F5F5] px-6 py-8 text-center shadow-lg">
          <button
            type="button"
            data-guestbook-close
            class="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0 text-[1.25rem] text-[#999999]"
            aria-label="닫기"
          >
            ×
          </button>
          <h2
            id="guestbook-delete-title"
            class="m-0 font-noto text-[1rem] font-medium tracking-tight text-[#111111]"
          >
            글 삭제
          </h2>
          <p
            class="m-0 mt-2 text-[0.72rem] font-extralight leading-relaxed tracking-tight text-[#888888]"
          >
            관리자 및 작성자만 글을 삭제하실 수 있습니다
          </p>
          <form id="guestbook-delete-form" class="mt-6 space-y-2.5 text-left">
            <input
              name="password"
              type="password"
              required
              placeholder="비밀번호를 입력해 주세요"
              class="w-full rounded-md border-0 bg-white px-4 py-3.5 font-noto text-[0.78rem] font-extralight text-[#111111] outline-none placeholder:text-[#aaaaaa]"
            />
            <p
              id="guestbook-delete-error"
              class="m-0 hidden text-center text-[0.68rem] text-[#c44]"
            ></p>
            <button
              type="submit"
              disabled
              class="${SUBMIT_BTN}"
            >
              삭제하기
            </button>
          </form>
        </div>
      </div>
    </div>`;
}

export function initGuestbook(root: ParentNode, clientId: string): void {
  const section = root.querySelector("#guestbook");
  if (!section) return;

  const writeForm = root.querySelector<HTMLFormElement>("#guestbook-write-form");
  const writeError = root.querySelector<HTMLElement>("#guestbook-write-error");
  const deleteForm = root.querySelector<HTMLFormElement>("#guestbook-delete-form");
  const deleteError = root.querySelector<HTMLElement>("#guestbook-delete-error");

  root
    .querySelector("#guestbook-open-write")
    ?.addEventListener("click", () => {
      openModal(root, "write");
      syncWriteSubmit(root);
    });

  root.querySelector("#guestbook-open-list")?.addEventListener("click", async () => {
    await refreshList(root, clientId);
    openModal(root, "list");
  });

  root.querySelectorAll("[data-guestbook-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inDelete = btn.closest("#guestbook-modal-delete");
      if (inDelete) closeDeleteModal(root);
      else closeModals(root);
    });
  });

  root.querySelectorAll("[data-guestbook-backdrop]").forEach((backdrop) => {
    backdrop.addEventListener("click", () => {
      const name = backdrop.getAttribute("data-guestbook-backdrop");
      if (name === "delete") closeDeleteModal(root);
      else closeModals(root);
    });
  });

  bindSubmitSync(writeForm, () => syncWriteSubmit(root));
  bindSubmitSync(deleteForm, () => syncDeleteSubmit(root));

  writeForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!writeForm || !writeError) return;

    const fd = new FormData(writeForm);
    const name = String(fd.get("name") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const message = String(fd.get("message") ?? "").trim();

    writeError.classList.add("hidden");

    if (!name || !password || !message) {
      writeError.textContent = "모든 항목을 입력해 주세요.";
      writeError.classList.remove("hidden");
      return;
    }
    if (message.length > 200) {
      writeError.textContent = "200자 이내로 작성해 주세요.";
      writeError.classList.remove("hidden");
      return;
    }

    await addGuestbookEntry(clientId, { name, message, password });
    writeForm.reset();
    syncWriteSubmit(root);
    closeModals(root);
  });

  root
    .querySelector("#guestbook-list")
    ?.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "[data-entry-delete]",
      );
      if (!target) return;
      deleteTargetId = target.dataset.entryDelete ?? null;
      openDeleteOverlay(root);
    });

  deleteForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!deleteForm || !deleteError || !deleteTargetId) return;

    const password = String(new FormData(deleteForm).get("password") ?? "");
    deleteError.classList.add("hidden");

    const ok = await deleteGuestbookEntry(clientId, deleteTargetId, password);
    if (!ok) {
      deleteError.textContent = "비밀번호가 일치하지 않습니다.";
      deleteError.classList.remove("hidden");
      return;
    }

    deleteForm.reset();
    syncDeleteSubmit(root);
    closeDeleteModal(root);
    await refreshList(root, clientId);
  });
}
