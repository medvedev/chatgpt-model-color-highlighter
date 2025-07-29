function applyColorLogic(config) {
  function findTarget() {
    const candidateDivs = document.querySelectorAll("div");
    for (const div of candidateDivs) {
      const textMatches = div.textContent.includes(config.requiredText);
      const span = div.querySelector(`span.${config.spanClass}`);
      const hasNoAttributes = div.attributes.length === 0;
      if (textMatches && span && hasNoAttributes) {
        return { div, span };
      }
    }
    return null;
  }

  function processTarget(target) {
    if (!target) return;

    const { div, span } = target;

    const updateColor = () => {
      const text = span.textContent.trim();
      const color = config.spanColorMap[text];
      div.style.setProperty("background-color", color || "", "important");
      div.style.setProperty("border-radius", "5px", "important");
      div.style.setProperty("box-sizing", "border-box", "important");
      div.style.setProperty("width", "calc(100% + 20px)", "important");
      div.style.setProperty("padding-left", "10px", "important");
      div.style.setProperty("padding-right", "10px", "important");
    };

    updateColor();
    const observer = new MutationObserver(updateColor);
    observer.observe(span, { characterData: true, childList: true, subtree: true });
  }

  const run = () => {
    const initialTarget = findTarget();
    processTarget(initialTarget);
    setTimeout(() => {
      const delayedTarget = findTarget();
      processTarget(delayedTarget);
    }, 1000);
  };

  window.addEventListener("load", () => {
    setTimeout(run, 500);
  });
}

const activeConfig = CONFIG.find(cfg => window.location.hostname.includes(cfg.match));
if (activeConfig) {
  applyColorLogic(activeConfig);
}
