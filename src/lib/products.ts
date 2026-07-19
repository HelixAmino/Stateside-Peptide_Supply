export type PriceTier = {
  min: number;
  max: number | null;
  label: string;
  price: number;
};

export type Product = {
  productId: number;
  sku: string;
  name: string;
  category: string;
  specification: string;
  basePrice: number;
};

export function computeTiers(basePrice: number): PriceTier[] {
  return [
    { min: 5, max: 9, label: "5-9 Kits", price: basePrice },
    { min: 10, max: 24, label: "10-24 Kits", price: Math.ceil(basePrice * 0.9) },
    { min: 25, max: 99, label: "25-99 Kits", price: Math.ceil(basePrice * 0.8) },
    { min: 100, max: null, label: "100+ Kits", price: Math.ceil(basePrice * 0.68) },
  ];
}

export function getPriceForTotalQty(basePrice: number, totalQty: number): number {
  if (totalQty >= 100) return Math.ceil(basePrice * 0.68);
  if (totalQty >= 25) return Math.ceil(basePrice * 0.8);
  if (totalQty >= 10) return Math.ceil(basePrice * 0.9);
  return basePrice;
}

export function getActiveTierIndex(totalQty: number): number {
  if (totalQty >= 100) return 3;
  if (totalQty >= 25) return 2;
  if (totalQty >= 10) return 1;
  return 0;
}

export const PRODUCTS: Product[] = [
  // Semaglutide
  { productId: 1088, sku: "SPS39.SM10", name: "Semaglutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 47 },
  { productId: 1089, sku: "SPS39.SM20", name: "Semaglutide", category: "GLP-1 Agonists", specification: "20mg x 10 vials", basePrice: 63 },
  { productId: 1090, sku: "SPS39.SM30", name: "Semaglutide", category: "GLP-1 Agonists", specification: "30mg x 10 vials", basePrice: 81 },

  // Tirzepatide
  { productId: 1091, sku: "SPS39.TR10", name: "Tirzepatide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 47 },
  { productId: 1092, sku: "SPS39.TR20", name: "Tirzepatide", category: "GLP-1 Agonists", specification: "20mg x 10 vials", basePrice: 63 },
  { productId: 1093, sku: "SPS39.TR30", name: "Tirzepatide", category: "GLP-1 Agonists", specification: "30mg x 10 vials", basePrice: 81 },
  { productId: 1094, sku: "SPS39.TR60", name: "Tirzepatide", category: "GLP-1 Agonists", specification: "60mg x 10 vials", basePrice: 132 },

  // Retatrutide
  { productId: 1095, sku: "SPS39.RT10", name: "Retatrutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 58 },
  { productId: 1096, sku: "SPS39.RT20", name: "Retatrutide", category: "GLP-1 Agonists", specification: "20mg x 10 vials", basePrice: 85 },
  { productId: 1097, sku: "SPS39.RT30", name: "Retatrutide", category: "GLP-1 Agonists", specification: "30mg x 10 vials", basePrice: 113 },
  { productId: 1098, sku: "SPS39.RT60", name: "Retatrutide", category: "GLP-1 Agonists", specification: "60mg x 10 vials", basePrice: 196 },
  { productId: 1099, sku: "SPS39.RT100", name: "Retatrutide", category: "GLP-1 Agonists", specification: "100mg x 10 vials", basePrice: 308 },

  // Cagrilintide
  { productId: 1100, sku: "SPS39.CGL5", name: "Cagrilintide", category: "GLP-1 Agonists", specification: "5mg x 10 vials", basePrice: 106 },
  { productId: 1101, sku: "SPS39.CGL10", name: "Cagrilintide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 169 },

  // Mazdutide
  { productId: 1102, sku: "SPS39.MDT5", name: "Mazdutide", category: "GLP-1 Agonists", specification: "5mg x 10 vials", basePrice: 83 },
  { productId: 1103, sku: "SPS39.MDT10", name: "Mazdutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 137 },

  // Liraglutide
  { productId: 1104, sku: "SPS39.LIR5", name: "Liraglutide", category: "GLP-1 Agonists", specification: "5mg x 10 vials", basePrice: 111 },
  { productId: 1105, sku: "SPS39.LIR10", name: "Liraglutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 195 },
  { productId: 1106, sku: "SPS39.LIR30", name: "Liraglutide", category: "GLP-1 Agonists", specification: "20mg x 10 vials", basePrice: 361 },

  // Dulaglutide
  { productId: 1107, sku: "SPS39.DUL5", name: "Dulaglutide", category: "GLP-1 Agonists", specification: "5mg x 10 vials", basePrice: 154 },
  { productId: 1108, sku: "SPS39.DUL10", name: "Dulaglutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 251 },

  // Survodutide
  { productId: 1109, sku: "SPS39.SUR2", name: "Survodutide", category: "GLP-1 Agonists", specification: "2mg x 10 vials", basePrice: 130 },
  { productId: 1110, sku: "SPS39.SUR5", name: "Survodutide", category: "GLP-1 Agonists", specification: "5mg x 10 vials", basePrice: 236 },
  { productId: 1111, sku: "SPS39.SUR10", name: "Survodutide", category: "GLP-1 Agonists", specification: "10mg x 10 vials", basePrice: 401 },

  // BPC 157
  { productId: 1112, sku: "SPS39.BC5", name: "BPC 157", category: "Repair & Recovery", specification: "5mg x 10 vials", basePrice: 44 },
  { productId: 1113, sku: "SPS39.BC10", name: "BPC 157", category: "Repair & Recovery", specification: "10mg x 10 vials", basePrice: 60 },

  // TB 500 Frag
  { productId: 1114, sku: "SPS39.TB5-FRAG", name: "TB 500 Frag", category: "Repair & Recovery", specification: "5mg x 10 vials", basePrice: 44 },
  { productId: 1115, sku: "SPS39.TB10-FRAG", name: "TB 500 Frag", category: "Repair & Recovery", specification: "10mg x 10 vials", basePrice: 60 },

  // TB 500 Full
  { productId: 1116, sku: "SPS39.TB5-FULL", name: "TB 500 Full", category: "Repair & Recovery", specification: "5mg x 10 vials", basePrice: 88 },
  { productId: 1117, sku: "SPS39.TB10-FULL", name: "TB 500 Full", category: "Repair & Recovery", specification: "10mg x 10 vials", basePrice: 137 },

  // BPC + TB Combos
  { productId: 1118, sku: "SPS39.BB10", name: "Wolverine — BPC 157 5mg + TB 500 5mg", category: "Repair & Recovery", specification: "10mg x 10 vials", basePrice: 53 },
  { productId: 1119, sku: "SPS39.BB20", name: "Wolverine — BPC 157 10mg + TB 500 10mg", category: "Repair & Recovery", specification: "20mg x 10 vials", basePrice: 82 },

  // GLOW combo
  { productId: 1120, sku: "SPS39.GLOW70", name: "GLOW — BPC 157 + GHK-Cu + TB 500", category: "Repair & Recovery", specification: "70mg x 10 vials", basePrice: 130 },
  { productId: 1121, sku: "SPS39.KLOW80", name: "KLOW — BPC 157 + TB 500 + GHK-Cu + KPV", category: "Repair & Recovery", specification: "80mg x 10 vials", basePrice: 167 },

  // GHK-Cu
  { productId: 1122, sku: "SPS39.CU50", name: "GHK-Cu", category: "Skin & Anti-Aging", specification: "50mg x 10 vials", basePrice: 24 },
  { productId: 1123, sku: "SPS39.CU100", name: "GHK-Cu", category: "Skin & Anti-Aging", specification: "100mg x 10 vials", basePrice: 29 },

  // Melanotan
  { productId: 1124, sku: "SPS39.ML10", name: "Melanotan 1 (MT-1)", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 65 },
  { productId: 1125, sku: "SPS39.M210", name: "Melanotan 2 (MT-2)", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 72 },

  // KPV
  { productId: 1126, sku: "SPS39.KPV5", name: "KPV", category: "Skin & Anti-Aging", specification: "5mg x 10 vials", basePrice: 43 },
  { productId: 1127, sku: "SPS39.KPV10", name: "KPV", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 58 },

  // Epithalon
  { productId: 1128, sku: "SPS39.ET10", name: "Epithalon", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 68 },
  { productId: 1129, sku: "SPS39.ET50", name: "Epithalon", category: "Skin & Anti-Aging", specification: "50mg x 10 vials", basePrice: 219 },

  // Matrixyl
  { productId: 1130, sku: "SPS39.MAT10", name: "Matrixyl", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 46 },

  // Snap8
  { productId: 1131, sku: "SPS39.NP810", name: "Snap 8", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 74 },
  { productId: 1132, sku: "SPS39.NP8100", name: "Snap 8", category: "Skin & Anti-Aging", specification: "100mg x 10 vials", basePrice: 324 },

  // FOXO4-DRI
  { productId: 1133, sku: "SPS39.F410", name: "FOXO4-DRI", category: "Skin & Anti-Aging", specification: "10mg x 10 vials", basePrice: 328 },

  // Lipo-C
  { productId: 1134, sku: "SPS39.LC216", name: "Lipo-C", category: "Weight Management", specification: "10ml x 10 vials", basePrice: 53 },

  // MIC
  { productId: 1135, sku: "SPS39.MIC10", name: "MIC (Lipo C with B12)", category: "Weight Management", specification: "10mg x 10 vials", basePrice: 147 },

  // AOD9604
  { productId: 1136, sku: "SPS39.5AD", name: "AOD 9604", category: "Weight Management", specification: "5mg x 10 vials", basePrice: 88 },
  { productId: 1137, sku: "SPS39.10AD", name: "AOD 9604", category: "Weight Management", specification: "10mg x 10 vials", basePrice: 147 },

  // 5-Amino 1MQ
  { productId: 1138, sku: "SPS39.5AM", name: "5-Amino 1MQ", category: "Weight Management", specification: "5mg x 10 vials", basePrice: 31 },
  { productId: 1139, sku: "SPS39.10AM", name: "5-Amino 1MQ", category: "Weight Management", specification: "10mg x 10 vials", basePrice: 41 },
  { productId: 1140, sku: "SPS39.50AM", name: "5-Amino 1MQ", category: "Weight Management", specification: "50mg x 10 vials", basePrice: 62 },

  // AICAR
  { productId: 1141, sku: "SPS39.AR50", name: "AICAR", category: "Weight Management", specification: "50mg x 10 vials", basePrice: 40 },

  // Adipotide
  { productId: 1142, sku: "SPS39.AP2", name: "Adipotide", category: "Weight Management", specification: "2mg x 10 vials", basePrice: 42 },
  { productId: 1143, sku: "SPS39.AP5", name: "Adipotide", category: "Weight Management", specification: "5mg x 10 vials", basePrice: 82 },

  // SLU-PP-322
  { productId: 1144, sku: "SPS39.SLU5", name: "SLU-PP-322", category: "Weight Management", specification: "5mg x 10 vials", basePrice: 31 },

  // CJC-1295 NO DAC
  { productId: 1145, sku: "SPS39.CND5", name: "CJC-1295 (No DAC)", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 74 },
  { productId: 1146, sku: "SPS39.CND10", name: "CJC-1295 (No DAC)", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 118 },

  // CJC-1295 W/DAC
  { productId: 1147, sku: "SPS39.CD5", name: "CJC-1295 (w/ DAC)", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 142 },
  { productId: 1148, sku: "SPS39.CD10", name: "CJC-1295 (w/ DAC)", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 256 },

  // Ipamorelin
  { productId: 1149, sku: "SPS39.IP2", name: "Ipamorelin", category: "Growth Hormone", specification: "2mg x 10 vials", basePrice: 24 },
  { productId: 1150, sku: "SPS39.IP5", name: "Ipamorelin", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 29 },
  { productId: 1151, sku: "SPS39.IP10", name: "Ipamorelin", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 53 },

  // CJC + Ipamorelin Combo
  { productId: 1152, sku: "SPS39.CP10", name: "CJC-1295 (No DAC) + Ipamorelin", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 147 },

  // GHRP-2
  { productId: 1153, sku: "SPS39.G25", name: "GHRP-2", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 47 },
  { productId: 1154, sku: "SPS39.G210", name: "GHRP-2", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 63 },

  // GHRP-6
  { productId: 1155, sku: "SPS39.G65", name: "GHRP-6", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 47 },
  { productId: 1156, sku: "SPS39.G610", name: "GHRP-6", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 63 },

  // Hexarelin
  { productId: 1157, sku: "SPS39.HX2", name: "Hexarelin", category: "Growth Hormone", specification: "2mg x 10 vials", basePrice: 28 },
  { productId: 1158, sku: "SPS39.HX5", name: "Hexarelin", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 51 },

  // HGH 191AA
  { productId: 1159, sku: "SPS39.H10", name: "HGH 191AA (Somatropin)", category: "Growth Hormone", specification: "10iu x 10 vials", basePrice: 40 },
  { productId: 1160, sku: "SPS39.H36", name: "HGH 191AA (Somatropin)", category: "Growth Hormone", specification: "36iu x 10 vials", basePrice: 114 },

  // Sermorelin
  { productId: 1161, sku: "SPS39.SMO5", name: "Sermorelin", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 84 },
  { productId: 1162, sku: "SPS39.SMO10", name: "Sermorelin", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 137 },

  // Tesamorelin
  { productId: 1163, sku: "SPS39.TSM5", name: "Tesamorelin", category: "Growth Hormone", specification: "5mg x 10 vials", basePrice: 96 },
  { productId: 1164, sku: "SPS39.TSM10", name: "Tesamorelin", category: "Growth Hormone", specification: "10mg x 10 vials", basePrice: 162 },
  { productId: 1165, sku: "SPS39.TSM20", name: "Tesamorelin", category: "Growth Hormone", specification: "20mg x 10 vials", basePrice: 312 },

  // ACE-031
  { productId: 1166, sku: "SPS39.AE1", name: "ACE-031", category: "Growth Hormone", specification: "1mg x 10 vials", basePrice: 119 },

  // MGF
  { productId: 1167, sku: "SPS39.FM2", name: "MGF", category: "Growth Hormone", specification: "2mg x 10 vials", basePrice: 29 },
  { productId: 1168, sku: "SPS39.FMP2", name: "PEG-MGF", category: "Growth Hormone", specification: "2mg x 10 vials", basePrice: 50 },

  // Follistatin
  { productId: 1169, sku: "SPS39.FN1", name: "Follistatin", category: "Growth Hormone", specification: "1mg x 10 vials", basePrice: 142 },

  // IGF
  { productId: 1170, sku: "SPS39.IGD", name: "IGF-DES", category: "Growth Hormone", specification: "2mg x 10 vials", basePrice: 38 },
  { productId: 1171, sku: "SPS39.IG1", name: "IGF-1 LR3", category: "Growth Hormone", specification: "1mg x 10 vials", basePrice: 150 },

  // HCG
  { productId: 1172, sku: "SPS39.G10K", name: "HCG", category: "Hormonal", specification: "10000IU x 10 vials", basePrice: 86 },
  { productId: 1173, sku: "SPS39.G5K", name: "HCG", category: "Hormonal", specification: "5000IU x 10 vials", basePrice: 58 },

  // PT-141
  { productId: 1174, sku: "SPS39.P41", name: "PT-141", category: "Hormonal", specification: "10mg x 10 vials", basePrice: 70 },

  // Gonadorelin
  { productId: 1175, sku: "SPS39.GND2", name: "Gonadorelin Acetate", category: "Hormonal", specification: "2mg x 10 vials", basePrice: 38 },

  // Oxytocin
  { productId: 1176, sku: "SPS39.OT2", name: "Oxytocin Acetate", category: "Hormonal", specification: "2mg x 10 vials", basePrice: 44 },
  { productId: 1177, sku: "SPS39.OT5", name: "Oxytocin Acetate", category: "Hormonal", specification: "5mg x 10 vials", basePrice: 68 },
  { productId: 1178, sku: "SPS39.OT10", name: "Oxytocin Acetate", category: "Hormonal", specification: "10mg x 10 vials", basePrice: 104 },

  // KissPeptin
  { productId: 1179, sku: "SPS39.KS5", name: "KissPeptin-10", category: "Hormonal", specification: "5mg x 10 vials", basePrice: 51 },
  { productId: 1180, sku: "SPS39.KS10", name: "KissPeptin-10", category: "Hormonal", specification: "10mg x 10 vials", basePrice: 72 },

  // EPO
  { productId: 1181, sku: "SPS39.EP0", name: "EPO", category: "Hormonal", specification: "3000iu", basePrice: 74 },

  // DSIP
  { productId: 1182, sku: "SPS39.DS2", name: "DSIP", category: "Cognitive & Sleep", specification: "2mg x 10 vials", basePrice: 37 },
  { productId: 1183, sku: "SPS39.DS5", name: "DSIP", category: "Cognitive & Sleep", specification: "5mg x 10 vials", basePrice: 48 },
  { productId: 1184, sku: "SPS39.DS10", name: "DSIP", category: "Cognitive & Sleep", specification: "10mg x 10 vials", basePrice: 63 },

  // Selank
  { productId: 1185, sku: "SPS39.SK10", name: "Selank", category: "Cognitive & Sleep", specification: "10mg x 10 vials", basePrice: 62 },

  // Semax
  { productId: 1186, sku: "SPS39.XA10", name: "Semax", category: "Cognitive & Sleep", specification: "10mg x 10 vials", basePrice: 60 },

  // Pinealon
  { productId: 1187, sku: "SPS39.PIN5", name: "Pinealon", category: "Cognitive & Sleep", specification: "5mg x 10 vials", basePrice: 38 },
  { productId: 1188, sku: "SPS39.PIN10", name: "Pinealon", category: "Cognitive & Sleep", specification: "10mg x 10 vials", basePrice: 62 },

  // Adamax
  { productId: 1189, sku: "SPS39.ADA5", name: "Adamax", category: "Cognitive & Sleep", specification: "5mg x 10 vials", basePrice: 130 },
  { productId: 1190, sku: "SPS39.ADA10", name: "Adamax", category: "Cognitive & Sleep", specification: "10mg x 10 vials", basePrice: 229 },

  // SS-31
  { productId: 1191, sku: "SPS39.2S10", name: "SS-31", category: "Longevity & Cellular", specification: "10mg x 10 vials", basePrice: 68 },
  { productId: 1192, sku: "SPS39.2S50", name: "SS-31", category: "Longevity & Cellular", specification: "50mg x 10 vials", basePrice: 227 },

  // MOTS-c
  { productId: 1193, sku: "SPS39.MS10", name: "MOTS-c", category: "Longevity & Cellular", specification: "10mg x 10 vials", basePrice: 70 },
  { productId: 1194, sku: "SPS39.MS20", name: "MOTS-c", category: "Longevity & Cellular", specification: "20mg x 10 vials", basePrice: 108 },
  { productId: 1195, sku: "SPS39.MS40", name: "MOTS-c", category: "Longevity & Cellular", specification: "40mg x 10 vials", basePrice: 191 },

  // Humanin
  { productId: 1196, sku: "SPS39.HUM10", name: "Humanin", category: "Longevity & Cellular", specification: "10mg x 10 vials", basePrice: 361 },

  // Ara-290
  { productId: 1197, sku: "SPS39.RA10", name: "Ara-290", category: "Longevity & Cellular", specification: "10mg x 10 vials", basePrice: 114 },
  { productId: 1198, sku: "SPS39.RA16", name: "Ara-290", category: "Longevity & Cellular", specification: "16mg x 10 vials", basePrice: 145 },

  // NAD+
  { productId: 1199, sku: "SPS39.NJ500", name: "NAD+", category: "Longevity & Cellular", specification: "500mg x 10 vials", basePrice: 75 },
  { productId: 1200, sku: "SPS39.NJ1000", name: "NAD+", category: "Longevity & Cellular", specification: "1000mg x 10 vials", basePrice: 123 },

  // Glutathione
  { productId: 1201, sku: "SPS39.GTT1000", name: "Glutathione", category: "Longevity & Cellular", specification: "1000mg x 10 vials", basePrice: 75 },
  { productId: 1202, sku: "SPS39.GTT1500", name: "Glutathione", category: "Longevity & Cellular", specification: "1500mg x 10 vials", basePrice: 101 },

  // PNC-27
  { productId: 1203, sku: "SPS39.PN5", name: "PNC-27", category: "Longevity & Cellular", specification: "5mg x 10 vials", basePrice: 142 },

  // Thymosin Alpha 1
  { productId: 1204, sku: "SPS39.TA5", name: "Thymosin Alpha 1", category: "Immune & Organ", specification: "5mg x 10 vials", basePrice: 75 },
  { productId: 1205, sku: "SPS39.TA10", name: "Thymosin Alpha 1", category: "Immune & Organ", specification: "10mg x 10 vials", basePrice: 123 },

  // Thymalin
  { productId: 1206, sku: "SPS39.TY10", name: "Thymalin", category: "Immune & Organ", specification: "10mg x 10 vials", basePrice: 114 },

  // Cardiogen
  { productId: 1207, sku: "SPS39.CAR10", name: "Cardiogen", category: "Immune & Organ", specification: "10mg x 10 vials", basePrice: 86 },
  { productId: 1208, sku: "SPS39.CAR20", name: "Cardiogen", category: "Immune & Organ", specification: "20mg x 10 vials", basePrice: 171 },

  // Crystagen
  { productId: 1209, sku: "SPS39.CRY10", name: "Crystagen", category: "Immune & Organ", specification: "10mg x 10 vials", basePrice: 77 },
  { productId: 1210, sku: "SPS39.CRY20", name: "Crystagen", category: "Immune & Organ", specification: "20mg x 10 vials", basePrice: 142 },

  // VIP
  { productId: 1211, sku: "SPS39.VIP5", name: "VIP", category: "Immune & Organ", specification: "5mg x 10 vials", basePrice: 84 },
  { productId: 1212, sku: "SPS39.VIP10", name: "VIP", category: "Immune & Organ", specification: "10mg x 10 vials", basePrice: 137 },

  // KK375
  { productId: 1213, sku: "SPS39.KK37", name: "KK-375", category: "Immune & Organ", specification: "5mg x 10 vials", basePrice: 90 },
];

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].sort();
