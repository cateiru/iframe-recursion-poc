function main() {
  const buttonElement = document.querySelector<HTMLButtonElement>("#button");
  const iframeElement = document.querySelector<HTMLIFrameElement>("#iframe");
  const resultElement = document.querySelector<HTMLParagraphElement>("#result");
  const resetButtonElement =
    document.querySelector<HTMLButtonElement>("#reset-button");

  let start: number;

  window.addEventListener("message", (event) => {
    if (event.data.type === "result") {
      const n: number = event.data.n;
      const result: number = event.data.result;

      const end = performance.now();
      const duration = end - start;

      if (resultElement) {
        resultElement.textContent = `Result for n=${n}: ${result}, computed in ${duration.toFixed(
          2
        )} ms`;
      }
    }
  });

  buttonElement?.addEventListener("click", () => {
    const inputElement = document.querySelector<HTMLInputElement>("#input");
    const n = Number(inputElement?.value) ?? 0;

    start = performance.now();
    iframeElement?.contentWindow?.postMessage({ type: "compute", n }, "*");
  });

  resetButtonElement?.addEventListener("click", () => {
    resultElement!.textContent = "";

    iframeElement!.src = iframeElement!.src;
  });
}

main();
