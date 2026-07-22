import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRODUCTS = [
  { id: 1088, name: "Semaglutide", spec: "10mg x 10 vials" },
  { id: 1089, name: "Semaglutide", spec: "20mg x 10 vials" },
  { id: 1090, name: "Semaglutide", spec: "30mg x 10 vials" },
  { id: 1091, name: "Tirzepatide", spec: "10mg x 10 vials" },
  { id: 1092, name: "Tirzepatide", spec: "20mg x 10 vials" },
  { id: 1093, name: "Tirzepatide", spec: "30mg x 10 vials" },
  { id: 1094, name: "Tirzepatide", spec: "60mg x 10 vials" },
  { id: 1095, name: "Retatrutide", spec: "10mg x 10 vials" },
  { id: 1096, name: "Retatrutide", spec: "20mg x 10 vials" },
  { id: 1097, name: "Retatrutide", spec: "30mg x 10 vials" },
  { id: 1098, name: "Retatrutide", spec: "60mg x 10 vials" },
  { id: 1099, name: "Retatrutide", spec: "100mg x 10 vials" },
  { id: 1100, name: "Cagrilintide", spec: "5mg x 10 vials" },
  { id: 1101, name: "Cagrilintide", spec: "10mg x 10 vials" },
  { id: 1102, name: "Mazdutide", spec: "5mg x 10 vials" },
  { id: 1103, name: "Mazdutide", spec: "10mg x 10 vials" },
  { id: 1104, name: "Liraglutide", spec: "5mg x 10 vials" },
  { id: 1105, name: "Liraglutide", spec: "10mg x 10 vials" },
  { id: 1106, name: "Liraglutide", spec: "20mg x 10 vials" },
  { id: 1107, name: "Dulaglutide", spec: "5mg x 10 vials" },
  { id: 1108, name: "Dulaglutide", spec: "10mg x 10 vials" },
  { id: 1109, name: "Survodutide", spec: "2mg x 10 vials" },
  { id: 1110, name: "Survodutide", spec: "5mg x 10 vials" },
  { id: 1111, name: "Survodutide", spec: "10mg x 10 vials" },
  { id: 1112, name: "BPC 157", spec: "5mg x 10 vials" },
  { id: 1113, name: "BPC 157", spec: "10mg x 10 vials" },
  { id: 1114, name: "TB 500 Frag", spec: "5mg x 10 vials" },
  { id: 1115, name: "TB 500 Frag", spec: "10mg x 10 vials" },
  { id: 1116, name: "TB 500 Full", spec: "5mg x 10 vials" },
  { id: 1117, name: "TB 500 Full", spec: "10mg x 10 vials" },
  { id: 1118, name: "Wolverine — BPC 157 5mg + TB 500 5mg", spec: "10mg x 10 vials" },
  { id: 1119, name: "Wolverine — BPC 157 10mg + TB 500 10mg", spec: "20mg x 10 vials" },
  { id: 1120, name: "GLOW — BPC 157 + GHK-Cu + TB 500", spec: "70mg x 10 vials" },
  { id: 1121, name: "KLOW — BPC 157 + TB 500 + GHK-Cu + KPV", spec: "80mg x 10 vials" },
  { id: 1122, name: "GHK-Cu", spec: "50mg x 10 vials" },
  { id: 1123, name: "GHK-Cu", spec: "100mg x 10 vials" },
  { id: 1124, name: "Melanotan 1 (MT-1)", spec: "10mg x 10 vials" },
  { id: 1125, name: "Melanotan 2 (MT-2)", spec: "10mg x 10 vials" },
  { id: 1126, name: "KPV", spec: "5mg x 10 vials" },
  { id: 1127, name: "KPV", spec: "10mg x 10 vials" },
  { id: 1128, name: "Epithalon", spec: "10mg x 10 vials" },
  { id: 1129, name: "Epithalon", spec: "50mg x 10 vials" },
  { id: 1130, name: "Matrixyl", spec: "10mg x 10 vials" },
  { id: 1131, name: "Snap 8", spec: "10mg x 10 vials" },
  { id: 1132, name: "Snap 8", spec: "100mg x 10 vials" },
  { id: 1133, name: "FOXO4-DRI", spec: "10mg x 10 vials" },
  { id: 1134, name: "Lipo-C", spec: "10ml x 10 vials" },
  { id: 1135, name: "MIC (Lipo C with B12)", spec: "10mg x 10 vials" },
  { id: 1136, name: "AOD 9604", spec: "5mg x 10 vials" },
  { id: 1137, name: "AOD 9604", spec: "10mg x 10 vials" },
  { id: 1138, name: "5-Amino 1MQ", spec: "5mg x 10 vials" },
  { id: 1139, name: "5-Amino 1MQ", spec: "10mg x 10 vials" },
  { id: 1140, name: "5-Amino 1MQ", spec: "50mg x 10 vials" },
  { id: 1141, name: "AICAR", spec: "50mg x 10 vials" },
  { id: 1142, name: "Adipotide", spec: "2mg x 10 vials" },
  { id: 1143, name: "Adipotide", spec: "5mg x 10 vials" },
  { id: 1144, name: "SLU-PP-322", spec: "5mg x 10 vials" },
  { id: 1145, name: "CJC-1295 (No DAC)", spec: "5mg x 10 vials" },
  { id: 1146, name: "CJC-1295 (No DAC)", spec: "10mg x 10 vials" },
  { id: 1147, name: "CJC-1295 (w/ DAC)", spec: "5mg x 10 vials" },
  { id: 1148, name: "CJC-1295 (w/ DAC)", spec: "10mg x 10 vials" },
  { id: 1149, name: "Ipamorelin", spec: "2mg x 10 vials" },
  { id: 1150, name: "Ipamorelin", spec: "5mg x 10 vials" },
  { id: 1151, name: "Ipamorelin", spec: "10mg x 10 vials" },
  { id: 1152, name: "CJC-1295 (No DAC) + Ipamorelin", spec: "10mg x 10 vials" },
  { id: 1153, name: "GHRP-2", spec: "5mg x 10 vials" },
  { id: 1154, name: "GHRP-2", spec: "10mg x 10 vials" },
  { id: 1155, name: "GHRP-6", spec: "5mg x 10 vials" },
  { id: 1156, name: "GHRP-6", spec: "10mg x 10 vials" },
  { id: 1157, name: "Hexarelin", spec: "2mg x 10 vials" },
  { id: 1158, name: "Hexarelin", spec: "5mg x 10 vials" },
  { id: 1159, name: "HGH 191AA (Somatropin)", spec: "10iu x 10 vials" },
  { id: 1160, name: "HGH 191AA (Somatropin)", spec: "36iu x 10 vials" },
  { id: 1161, name: "Sermorelin", spec: "5mg x 10 vials" },
  { id: 1162, name: "Sermorelin", spec: "10mg x 10 vials" },
  { id: 1163, name: "Tesamorelin", spec: "5mg x 10 vials" },
  { id: 1164, name: "Tesamorelin", spec: "10mg x 10 vials" },
  { id: 1165, name: "Tesamorelin", spec: "20mg x 10 vials" },
  { id: 1166, name: "ACE-031", spec: "1mg x 10 vials" },
  { id: 1167, name: "MGF", spec: "2mg x 10 vials" },
  { id: 1168, name: "PEG-MGF", spec: "2mg x 10 vials" },
  { id: 1169, name: "Follistatin", spec: "1mg x 10 vials" },
  { id: 1170, name: "IGF-DES", spec: "2mg x 10 vials" },
  { id: 1171, name: "IGF-1 LR3", spec: "1mg x 10 vials" },
  { id: 1172, name: "HCG", spec: "10000IU x 10 vials" },
  { id: 1173, name: "HCG", spec: "5000IU x 10 vials" },
  { id: 1174, name: "PT-141", spec: "10mg x 10 vials" },
  { id: 1175, name: "Gonadorelin Acetate", spec: "2mg x 10 vials" },
  { id: 1176, name: "Oxytocin Acetate", spec: "2mg x 10 vials" },
  { id: 1177, name: "Oxytocin Acetate", spec: "5mg x 10 vials" },
  { id: 1178, name: "Oxytocin Acetate", spec: "10mg x 10 vials" },
  { id: 1179, name: "KissPeptin-10", spec: "5mg x 10 vials" },
  { id: 1180, name: "KissPeptin-10", spec: "10mg x 10 vials" },
  { id: 1181, name: "EPO", spec: "3000iu" },
  { id: 1182, name: "DSIP", spec: "2mg x 10 vials" },
  { id: 1183, name: "DSIP", spec: "5mg x 10 vials" },
  { id: 1184, name: "DSIP", spec: "10mg x 10 vials" },
  { id: 1185, name: "Selank", spec: "10mg x 10 vials" },
  { id: 1186, name: "Semax", spec: "10mg x 10 vials" },
  { id: 1187, name: "Pinealon", spec: "5mg x 10 vials" },
  { id: 1188, name: "Pinealon", spec: "10mg x 10 vials" },
  { id: 1189, name: "Adamax", spec: "5mg x 10 vials" },
  { id: 1190, name: "Adamax", spec: "10mg x 10 vials" },
  { id: 1191, name: "SS-31", spec: "10mg x 10 vials" },
  { id: 1192, name: "SS-31", spec: "50mg x 10 vials" },
  { id: 1193, name: "MOTS-c", spec: "10mg x 10 vials" },
  { id: 1194, name: "MOTS-c", spec: "20mg x 10 vials" },
  { id: 1195, name: "MOTS-c", spec: "40mg x 10 vials" },
  { id: 1196, name: "Humanin", spec: "10mg x 10 vials" },
  { id: 1197, name: "Ara-290", spec: "10mg x 10 vials" },
  { id: 1198, name: "Ara-290", spec: "16mg x 10 vials" },
  { id: 1199, name: "NAD+", spec: "500mg x 10 vials" },
  { id: 1200, name: "NAD+", spec: "1000mg x 10 vials" },
  { id: 1201, name: "Glutathione", spec: "1000mg x 10 vials" },
  { id: 1202, name: "Glutathione", spec: "1500mg x 10 vials" },
  { id: 1203, name: "PNC-27", spec: "5mg x 10 vials" },
  { id: 1204, name: "Thymosin Alpha 1", spec: "5mg x 10 vials" },
  { id: 1205, name: "Thymosin Alpha 1", spec: "10mg x 10 vials" },
  { id: 1206, name: "Thymalin", spec: "10mg x 10 vials" },
  { id: 1207, name: "Cardiogen", spec: "10mg x 10 vials" },
  { id: 1208, name: "Cardiogen", spec: "20mg x 10 vials" },
  { id: 1209, name: "Crystagen", spec: "10mg x 10 vials" },
  { id: 1210, name: "Crystagen", spec: "20mg x 10 vials" },
  { id: 1211, name: "VIP", spec: "5mg x 10 vials" },
  { id: 1212, name: "VIP", spec: "10mg x 10 vials" },
  { id: 1213, name: "KK-375", spec: "5mg x 10 vials" },
];

const PREFIX = "Custom Compound:";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const WC_KEY = Deno.env.get("WC_CONSUMER_KEY");
    const WC_SECRET = Deno.env.get("WC_CONSUMER_SECRET");
    const BASE_URL = "https://floorabovebrands.com/wp-json/wc/v3";

    if (!WC_KEY || !WC_SECRET) {
      return new Response(
        JSON.stringify({ error: "WC credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const auth = btoa(`${WC_KEY}:${WC_SECRET}`);
    const results: { id: number; newName: string; status: string; error?: string }[] = [];

    for (let i = 0; i < PRODUCTS.length; i += 10) {
      const batch = PRODUCTS.slice(i, i + 10);
      const promises = batch.map(async (product) => {
        const newName = `${PREFIX} ${product.name} ${product.spec}`;
        try {
          const res = await fetch(`${BASE_URL}/products/${product.id}`, {
            method: "PUT",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newName }),
          });

          if (!res.ok) {
            const errBody = await res.text();
            results.push({ id: product.id, newName, status: "failed", error: `${res.status}: ${errBody}` });
          } else {
            results.push({ id: product.id, newName, status: "updated" });
          }
        } catch (err) {
          results.push({ id: product.id, newName, status: "failed", error: (err as Error).message });
        }
      });
      await Promise.all(promises);
    }

    const succeeded = results.filter(r => r.status === "updated").length;
    const failed = results.filter(r => r.status === "failed").length;

    return new Response(
      JSON.stringify({ summary: { total: PRODUCTS.length, succeeded, failed }, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
