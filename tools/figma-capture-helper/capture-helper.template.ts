declare global {
  interface Window {
    figma?: {
      captureForDesign?: (options: {
        delayMs?: number;
        selector?: string;
      }) => Promise<{ error?: string; success?: boolean } | void>;
    };
  }
}

const FIGMA_CAPTURE_SCRIPT_ID = 'figma-script';
const FIGMA_CAPTURE_SCRIPT_SRC = 'https://mcp.figma.com/mcp/html-to-design/capture.js';

export function enableFigmaCapture() {
  if (document.getElementById(FIGMA_CAPTURE_SCRIPT_ID)) {
    window.figma?.captureForDesign?.({ selector: 'body', delayMs: 300 });
    return;
  }
  const script = document.createElement('script');
  script.id = FIGMA_CAPTURE_SCRIPT_ID;
  script.src = FIGMA_CAPTURE_SCRIPT_SRC;
  script.onload = () => {
    window.figma?.captureForDesign?.({ selector: 'body', delayMs: 300 });
  };
  document.head.appendChild(script);
}
