import { copyText, COPY_TOAST, mountCopyToast, showCopyToast } from "./copy-toast";

function siteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
  return fromEnv || window.location.origin.replace(/\/$/, "");
}

function sharePageUrl(): string {
  return `${siteUrl()}/`;
}

export function initShare(): void {
  mountCopyToast();

  document.querySelector("#share-copy-link")?.addEventListener("click", async () => {
    try {
      await copyText(sharePageUrl());
      showCopyToast(COPY_TOAST.address);
    } catch {
      showCopyToast(COPY_TOAST.failed);
    }
  });
}
