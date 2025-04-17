import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./GradientDemo.module.scss";

export default function GradientDemo() {
  const gradientTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (gradientTextRef.current) {
      // Whacky GSAP animation
      gsap.to(gradientTextRef.current, {
        // scale: 1.5,
        translateY: 50,
        translateX: 50,
        duration: 2,
        repeat: 5,
        yoyo: true,
        ease: "elastic.inOut(1, 0.5)",
      });
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      {/* Gradient Background Header */}
      <h1 ref={gradientTextRef} className={styles["gradient-text"]}>
        Gradient Header
      </h1>

      {/* Static Image Background Header */}
      <h1 className={styles["image-text"]}>Image Background Header</h1>
    </div>
  );
}
