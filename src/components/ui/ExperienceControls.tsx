"use client";

import type { QualityTier } from "@/store/experienceStore";
import { useExperienceStore } from "@/store/experienceStore";

const qualityOptions: Array<{ value: QualityTier; label: string; description: string }> = [
  { value: "high", label: "High", description: "Full visual detail" },
  { value: "medium", label: "Medium", description: "Balanced performance" },
  { value: "low", label: "Low", description: "Lightweight rendering" },
];

export function ExperienceControls() {
  const qualityTier = useExperienceStore((state) => state.qualityTier);
  const setQualityTier = useExperienceStore((state) => state.setQualityTier);
  const soundEnabled = useExperienceStore((state) => state.soundEnabled);
  const setSoundEnabled = useExperienceStore((state) => state.setSoundEnabled);

  return (
    <details className="experience-controls">
      <summary>Preferences</summary>
      <div className="experience-controls-panel">
        <fieldset>
          <legend>Visual quality</legend>
          <div className="quality-options">
            {qualityOptions.map((option) => (
              <label key={option.value}>
                <input type="radio" name="quality-tier" value={option.value} checked={qualityTier === option.value} onChange={() => setQualityTier(option.value)} />
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="sound-option">
          <input type="checkbox" checked={soundEnabled} onChange={(event) => setSoundEnabled(event.target.checked)} />
          <span><strong>Sound</strong><small>Enable rally cues</small></span>
        </label>
      </div>
    </details>
  );
}
