const CONFIG = {
  requiredText: "ChatGPT",
  spanClass: "text-token-text-tertiary",
  spanColorMap: {
    "5": "#297433ff",
    "5 Thinking": "#882e2eff",
  },
};

function applyColorLogic() {
  const processedDivs = new WeakSet();

  const getMatchingDivs = () =>
    document.querySelectorAll(`button > div:has(span.${CONFIG.spanClass})`);

  const styleDiv = (div, span) => {
    const color = CONFIG.spanColorMap[span.textContent.trim()];
    div.style.cssText = `
      background-color: ${color || ""} !important;
      border-radius: 5px !important;
      box-sizing: border-box !important;
      width: calc(100% + 20px) !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    `;
  };

  const observeSpanChanges = (span, div) => {
    const observer = new MutationObserver(() => styleDiv(div, span));
    observer.observe(span, { characterData: true, childList: true, subtree: true });
  };

  const processDiv = (div) => {
    if (processedDivs.has(div)) return;
    if (div.attributes.length !== 0 || !div.textContent.includes(CONFIG.requiredText)) return;

    const span = div.querySelector(`span.${CONFIG.spanClass}`);
    if (!span) return;

    processedDivs.add(div);
    styleDiv(div, span);
    observeSpanChanges(span, div);
  };

  const scanDOM = () => getMatchingDivs().forEach(processDiv);

  window.addEventListener("load", () => {
    scanDOM();

    const domObserver = new MutationObserver((mutations) => {
      if (mutations.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && (n.tagName === "BUTTON" || n.querySelector?.("button"))))) {
        scanDOM();
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  });
}

applyColorLogic();
