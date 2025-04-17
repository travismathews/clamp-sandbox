import { useEffect, useState } from "react";
import styles from "./ClampPreview.module.scss";

type ElementType = "h1" | "h2" | "p";

interface ClampConfig {
  min: number;
  vw: number;
  remBoost: number;
  max: number;
}

const initialClampConfig: Record<ElementType, ClampConfig> = {
  h1: { min: 0.5, vw: 6, remBoost: 0, max: 4 },
  h2: { min: 0.5, vw: 5, remBoost: 0, max: 3 },
  p: { min: 0.5, vw: 3, remBoost: 0, max: 1.6 },
};

export default function ClampPreview() {
  const [selectedElement, setSelectedElement] = useState<ElementType>("h2");
  const [configs, setConfigs] = useState(initialClampConfig);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedConfig = configs[selectedElement];

  const handleChange = (key: keyof ClampConfig, value: number) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedElement]: { ...prev[selectedElement], [key]: value },
    }));
  };

  const resetAll = () => {
    setConfigs(initialClampConfig);
  };

  const getExplanation = (config: ClampConfig) => {
    const rem = 16;
    const vwPx = (config.vw / 100) * viewportWidth;
    const remBoostPx = config.remBoost * rem;
    const preferred = vwPx + remBoostPx;
    const minPx = config.min * rem;
    const maxPx = config.max * rem;
    const clamped = Math.min(Math.max(preferred, minPx), maxPx);

    return `This element is ${Math.round(
      clamped
    )}px at a viewport width of ${viewportWidth}px. It will scale between ${Math.round(
      minPx
    )}px and ${Math.round(maxPx)}px.`;
  };

  return (
    <section className={styles.container}>
      <div className={styles["element-selector-container"]}>
        <label htmlFor="element-select">Edit Element:</label>
        <select
          id="element-select"
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value as ElementType)}
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      <fieldset>
        <legend>Clamp Controls for {selectedElement.toUpperCase()}</legend>
        <label>
          Min Size (rem): {selectedConfig.min}
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.1"
            value={selectedConfig.min}
            onChange={(e) => handleChange("min", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Preferred VW: {selectedConfig.vw}
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={selectedConfig.vw}
            onChange={(e) => handleChange("vw", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Preferred REM Boost: {selectedConfig.remBoost}
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={selectedConfig.remBoost}
            onChange={(e) =>
              handleChange("remBoost", parseFloat(e.target.value))
            }
          />
        </label>
        <label>
          Max Size (rem): {selectedConfig.max}
          <input
            type="range"
            min="1"
            max="6"
            step="0.1"
            value={selectedConfig.max}
            onChange={(e) => handleChange("max", parseFloat(e.target.value))}
          />
        </label>
      </fieldset>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={resetAll}>Reset All</button>
      </div>
      <h1 className={styles.heading} style={{ fontSize: getClamp(configs.h1) }}>
        This is an H1 heading
      </h1>
      <p className={styles.paragraph} style={{ fontSize: getClamp(configs.p) }}>
        H1: {getExplanation(configs.h1)}
        <br />
        Paragraph: {getExplanation(configs.p)}
      </p>

      <h2 className={styles.heading} style={{ fontSize: getClamp(configs.h2) }}>
        This is an H2 subheading
      </h2>
      <p className={styles.paragraph} style={{ fontSize: getClamp(configs.p) }}>
        H2: {getExplanation(configs.h2)}
        <br />
        Paragraph: {getExplanation(configs.p)}
      </p>
    </section>
  );
}

function getClamp(config: ClampConfig) {
  return `clamp(${config.min}rem, calc(${config.vw}vw + ${config.remBoost}rem), ${config.max}rem)`;
}
