function applyColorLogic(config) {
  const processedDivs = new WeakSet();

  function findAndProcessTargets() {
    const candidateDivs = document.querySelectorAll(`button > div:has(span.${config.spanClass})`);

    for (const div of candidateDivs) {
      if (processedDivs.has(div)) continue;
      if (!div.textContent.includes(config.requiredText)) continue;
      if (div.attributes.length !== 0) continue;

      const span = div.querySelector(`span.${config.spanClass}`);
      if (!span) continue;

      processedDivs.add(div);

      const applyStyles = () => {
        const text = span.textContent.trim();
        const color = config.spanColorMap[text];
        div.style.setProperty("background-color", color || "", "important");
        div.style.setProperty("border-radius", "5px", "important");
        div.style.setProperty("box-sizing", "border-box", "important");
        div.style.setProperty("width", "calc(100% + 20px)", "important");
        div.style.setProperty("padding-left", "10px", "important");
        div.style.setProperty("padding-right", "10px", "important");
      };

      applyStyles();

      const spanObserver = new MutationObserver(applyStyles);
      spanObserver.observe(span, { characterData: true, childList: true, subtree: true });
    }
  }

  window.addEventListener("load", () => {
    findAndProcessTargets();

    const domObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node.nodeType === 1 &&
            (node.tagName === "BUTTON" || node.querySelector?.("button"))
          ) {
            findAndProcessTargets();
            return;
          }
        }
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  });
}

const activeConfig = CONFIG.find(cfg => window.location.hostname.includes(cfg.match));
if (activeConfig) {
  applyColorLogic(activeConfig);
}
