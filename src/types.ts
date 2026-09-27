export interface MaterialScienceExtraction {
  material_name: string;
  synthesis_defect: string;
  microscopic_consequence: string;
  graphic_novel_scene: string;
  panel_text: string;
  // Extra metadata for enriched simulation
  growth_method?: string;
  carrier_type?: string;
  conductance_quantum?: string;
  formula_latex?: string;
}

export interface GraphicNovelPanel {
  id: string;
  chapter: number;
  chapterTitle: string;
  panelNumber: number;
  badge: string;
  headline: string;
  narration: string;
  dialogue?: {
    speaker: string;
    avatar: string;
    text: string;
    type: 'speech' | 'thought' | 'hud';
  };
  sfx?: string;
  scientificContext: {
    phenomenon: string;
    equation: string;
    metric: string;
    metricValue: string;
  };
  visualTheme: 'pristine' | 'hazard' | 'furnace' | 'quantum-triumph';
  interactiveActionLabel?: string;
  actionTarget?: '3d-lattice' | 'ballistic-run' | 'furnace-puzzle' | 'extractor' | 'furnace-timeline';
}

export interface FurnaceParams {
  temperature: number; // Celsius (600 - 1200)
  rampRate: number; // C/min (5 - 60)
  ch4Ratio: number; // sccm CH4:H2 (0.1 - 2.0)
  growthTime: number; // minutes (5 - 60)
  pressure: number; // Torr (0.01 - 760)
  defectDensity: number; // vacancies / um^2
  id_ig_ratio: number; // Raman defect metric (0.02 - 1.2)
  mobility: number; // cm^2 / V s (1,000 - 200,000)
  conductancePercent: number; // 0 - 100%
}
