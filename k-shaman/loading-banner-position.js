(function () {
  "use strict";

  var NATIVE_CONTAINER_ID = "container-12cdf4ce15fbd319a5a65c7f165496a7";
  var observer;
  var banner;
  var originalParent;
  var originalNextSibling;
  var savedStyle;

  function getLoadingSlot() {
    var nativeContainer = document.getElementById(NATIVE_CONTAINER_ID);
    if (!nativeContainer) return null;

    var loadingBlock = nativeContainer.closest(".space-y-4");
    if (!loadingBlock || !loadingBlock.querySelector(".animate-pulse")) {
      return null;
    }

    return nativeContainer.parentElement;
  }

  function getBanner() {
    var candidates = document.querySelectorAll(
      'div[aria-label="Advertisement"]',
    );

    for (var i = 0; i < candidates.length; i += 1) {
      if (candidates[i].querySelector('iframe, script[src*="highperformanceformat"]')) {
        return candidates[i];
      }
    }

    return null;
  }

  function moveIntoLoadingSlot(slot) {
    if (!banner) {
      banner = getBanner();
      if (!banner) return;

      originalParent = banner.parentNode;
      originalNextSibling = banner.nextSibling;
      savedStyle = banner.getAttribute("style");
    }

    var nativeContainer = document.getElementById(NATIVE_CONTAINER_ID);
    if (nativeContainer) nativeContainer.style.display = "none";

    if (banner.parentNode !== slot) {
      slot.appendChild(banner);
    }

    banner.style.position = "relative";
    banner.style.left = "auto";
    banner.style.bottom = "auto";
    banner.style.transform = "none";
    banner.style.zIndex = "10";
    banner.style.margin = "16px auto 0";
    banner.style.width = "320px";
  }

  function restoreBanner() {
    if (!banner || !originalParent) return;

    if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
      originalParent.insertBefore(banner, originalNextSibling);
    } else {
      originalParent.appendChild(banner);
    }

    if (savedStyle === null) {
      banner.removeAttribute("style");
    } else {
      banner.setAttribute("style", savedStyle);
    }
  }

  function syncBannerPosition() {
    var slot = getLoadingSlot();
    if (slot) {
      moveIntoLoadingSlot(slot);
    } else {
      restoreBanner();
    }
  }

  function start() {
    syncBannerPosition();
    observer = new MutationObserver(syncBannerPosition);
    observer.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.addEventListener("pagehide", function () {
    if (observer) observer.disconnect();
    restoreBanner();
  });
})();
