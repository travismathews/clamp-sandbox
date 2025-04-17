import { useEffect, useState } from "react";
import styles from "./ClampCalculator.module.scss";

export default function ClampCalculator() {
  const [fontMinPx, setFontMinPx] = useState(16);
  const [fontMaxPx, setFontMaxPx] = useState(44);
  const [viewportMin, setViewportMin] = useState(600);
  const [viewportMax, setViewportMax] = useState(1440);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const baseRem = 16;

  const fontMinRem = fontMinPx / baseRem;
  const fontMaxRem = fontMaxPx / baseRem;

  const slope = ((fontMaxPx - fontMinPx) / (viewportMax - viewportMin)) * 100;
  const yAxisIntersection = fontMinPx - (slope / 100) * viewportMin;

  const slopeRem = slope / baseRem;
  const yAxisRem = yAxisIntersection / baseRem;

  const minClamp = `${fontMinRem.toFixed(2)}rem`;
  const maxClamp = `${fontMaxRem.toFixed(2)}rem`;
  const preferred = `calc(${yAxisRem.toFixed(2)}rem + ${slopeRem.toFixed(3)}vw)`;
  const clampExpression = `clamp(${minClamp}, ${preferred}, ${maxClamp})`;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCurrentFontSizePx = () => {
    const raw = yAxisIntersection + (slope * viewportWidth / 100);
    return Math.min(Math.max(raw, fontMinPx), fontMaxPx);
  };

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h2>Target Values</h2>
          <label>
            Min Font Size (px):
            <input
              type="number"
              value={fontMinPx}
              onChange={(e) => setFontMinPx(+e.target.value)}
            />
          </label>
          <label>
            Max Font Size (px):
            <input
              type="number"
              value={fontMaxPx}
              onChange={(e) => setFontMaxPx(+e.target.value)}
            />
          </label>
        </div>

        <div className={styles.section}>
          <h2>Viewport Range</h2>
          <label>
            Min Viewport (px):
            <input
              type="number"
              value={viewportMin}
              onChange={(e) => setViewportMin(+e.target.value)}
            />
          </label>
          <label>
            Max Viewport (px):
            <input
              type="number"
              value={viewportMax}
              onChange={(e) => setViewportMax(+e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className={styles.output}>
        <h3>Clamp Output</h3>
        <code>{clampExpression}</code>

        <h3>Font Size Example</h3>
        <code>font-size: {clampExpression};</code>
      </div>

      <div className={styles.preview} style={{ fontSize: clampExpression }}>
        This text is currently <strong>{Math.round(getCurrentFontSizePx())}px</strong> at a viewport width of <strong>{viewportWidth}px</strong>.
        <br />
        It will scale between {fontMinPx}px at {viewportMin}px and {fontMaxPx}px at {viewportMax}px.
      </div>
    </section>
  );
}
