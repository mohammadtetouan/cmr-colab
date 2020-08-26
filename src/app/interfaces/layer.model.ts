
export class Style {
  id: 73;
  nom: string;
  fillcolor: string;
  strokecolor: string;
  strokewidth: string;
  strokelinecap: any;
  strokelinejoin: any;
  strokelinedash: any;
  strokelinedashoffset: any;
  strokemiterlimit: any;
  textfont: any;
  textfillcolor: any;
  textoffsetx: any;
  textoffsety: any;
  textoverflow: any;
  textplacement: any;
  textscale: any;
  textrotatewithview: any;
  textrotation: any;
  texttext: any;
  texttextalign: any;
  texttextbaseline: any;
  textstroke: any;
  textpadding: any;
  textstrokecolor: any;
  textstrokewidth: any;
  textstrokelinecap: any;
  textstrokelinejoin: any;
  textstrokelinedash: any;
  textstrokelinedashoffset: any;
  textstrokemiterlimit: any;
  created_at: string;
  updated_at: string;
  classified_column: any;
  classes: any;
  label: any;
  opacity: 10;
  option: 1;
  hatch_pattern: string;
  hatch_color: string;
  hatch_offset: any;
  hatch_scale: any;
  hatch_fill: string;
  hatch_size: any;
  hatch_spacing: any;
  hatch_angle: any;
  points: 1;
  radius: any;
  radius2: any;
  radius1: any;
  angle: any;
  rotation: any;
  constructor() {}
}

export class Champ {
  id: number;
  name: string;
  alias: string;
  type: number;
  position: any;
  required: boolean;
  layer_id: number;
  created_at: string;
  updated_at: string;
  parent_id: any;
  is_parent: boolean;
  constructor() {}
}
export class Enregistrement {
  id?: number;
  prj?: number;
  layer_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
  shapeastext?: string;
  shape?: string;
  donnees?: any;
  modified?: boolean;
  local?: boolean;
  constructor() {}
}





export class Layer {
  id: number;
  name: string;
  text_id: string;
  type: number;
  x_min: any;
  y_min: any;
  x_max: any;
  y_max: any;
  z_min: any;
  z_max: any;
  m_min: any;
  m_max: any;
  style_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  description: any;
  group: string;
  visible: boolean;
  style: Style;
  champs: Champ[];
  enregistrements: Enregistrement[];
  constructor() {}
}
export class LayerData {
  id: number;
  champ_id: number;
  enregistrement_id: number;
  value: any;
  created_at: string;
  updated_at: string;
  constructor() {}
}
export class DataBase {
  name: number;
  layers: Layer[];
  layersData: LayerData[];
  recordsToUpload: Enregistrement[];
  constructor() {}
}
export class BaseMap {
  id?: number ;
  nom?: string ;
  url?: string ;
  visible?: boolean ;
  maps_id?: number ;
  created_at?: string ;
  updated_at?: string ;
  layer?: any ;
  constructor() {}
}