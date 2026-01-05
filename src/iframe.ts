function main() {
  randomBGColor();

  const iframeContainerElement =
    document.querySelector<HTMLDivElement>("#iframe-container");
  const lastDisplayElement =
    document.querySelector<HTMLParagraphElement>("#last-display");

  window.addEventListener("message", (event) => {
    if (event.data.type === "compute") {
      const n: number = event.data.n;

      if (n <= 1) {
        if (lastDisplayElement) {
          lastDisplayElement.textContent = n.toString();
        }

        // ベースケース: 0以下ならそのまま返す
        window.parent.postMessage({ type: "result", n, result: n }, "*");
        return;
      }

      const u = new URL(location.href);
      u.pathname = "/iframe-poc/recursion";
      u.searchParams.set("n", n.toString());

      const iframeElement1 = document.createElement("iframe");
      iframeElement1.src = u.toString();
      const iframeElement2 = document.createElement("iframe");
      iframeElement2.src = u.toString();

      // iframe をコンテナに追加
      iframeContainerElement?.appendChild(iframeElement1);
      iframeContainerElement?.appendChild(iframeElement2);

      let result1: number | null = null;
      let result2: number | null = null;

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === "result") {
          const resN: number = e.data.n;
          const resResult: number = e.data.result ?? resN;

          if (resN === n - 1) {
            result1 = resResult;
          } else if (resN === n - 2) {
            result2 = resResult;
          }

          // 両方の結果が揃ったら合計を計算して親に送信
          if (result1 !== null && result2 !== null) {
            const total = result1 + result2;
            console.log(`n=${n}: ${result1} + ${result2} = ${total}`);

            window.parent.postMessage(
              { type: "result", n, result: total },
              "*"
            );

            // イベントリスナーを削除
            window.removeEventListener("message", handleMessage);
          }
        }
      };

      // メッセージイベントリスナーを追加
      window.addEventListener("message", handleMessage);

      // 再帰的に計算を依頼
      iframeElement1.onload = () => {
        iframeElement1.contentWindow?.postMessage(
          { type: "compute", n: n - 1 },
          "*"
        );
      };
      iframeElement2.onload = () => {
        iframeElement2.contentWindow?.postMessage(
          { type: "compute", n: n - 2 },
          "*"
        );
      };
    }
  });
}

function randomBGColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  document.body.style.backgroundColor = color;
}

main();
