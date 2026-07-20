import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRODUCTS = [
  { id: 1088, sku: "SPS39.SM10" },
  { id: 1089, sku: "SPS39.SM20" },
  { id: 1090, sku: "SPS39.SM30" },
  { id: 1091, sku: "SPS39.TR10" },
  { id: 1092, sku: "SPS39.TR20" },
  { id: 1093, sku: "SPS39.TR30" },
  { id: 1094, sku: "SPS39.TR60" },
  { id: 1095, sku: "SPS39.RT10" },
  { id: 1096, sku: "SPS39.RT20" },
  { id: 1097, sku: "SPS39.RT30" },
  { id: 1098, sku: "SPS39.RT60" },
  { id: 1099, sku: "SPS39.RT100" },
  { id: 1100, sku: "SPS39.CGL5" },
  { id: 1101, sku: "SPS39.CGL10" },
  { id: 1102, sku: "SPS39.MDT5" },
  { id: 1103, sku: "SPS39.MDT10" },
  { id: 1104, sku: "SPS39.LIR5" },
  { id: 1105, sku: "SPS39.LIR10" },
  { id: 1106, sku: "SPS39.LIR30" },
  { id: 1107, sku: "SPS39.DUL5" },
  { id: 1108, sku: "SPS39.DUL10" },
  { id: 1109, sku: "SPS39.SUR2" },
  { id: 1110, sku: "SPS39.SUR5" },
  { id: 1111, sku: "SPS39.SUR10" },
  { id: 1112, sku: "SPS39.BC5" },
  { id: 1113, sku: "SPS39.BC10" },
  { id: 1114, sku: "SPS39.TB5-FRAG" },
  { id: 1115, sku: "SPS39.TB10-FRAG" },
  { id: 1116, sku: "SPS39.TB5-FULL" },
  { id: 1117, sku: "SPS39.TB10-FULL" },
  { id: 1118, sku: "SPS39.BB10" },
  { id: 1119, sku: "SPS39.BB20" },
  { id: 1120, sku: "SPS39.GLOW70" },
  { id: 1121, sku: "SPS39.KLOW80" },
  { id: 1122, sku: "SPS39.CU50" },
  { id: 1123, sku: "SPS39.CU100" },
  { id: 1124, sku: "SPS39.ML10" },
  { id: 1125, sku: "SPS39.M210" },
  { id: 1126, sku: "SPS39.KPV5" },
  { id: 1127, sku: "SPS39.KPV10" },
  { id: 1128, sku: "SPS39.ET10" },
  { id: 1129, sku: "SPS39.ET50" },
  { id: 1130, sku: "SPS39.MAT10" },
  { id: 1131, sku: "SPS39.NP810" },
  { id: 1132, sku: "SPS39.NP8100" },
  { id: 1133, sku: "SPS39.F410" },
  { id: 1134, sku: "SPS39.LC216" },
  { id: 1135, sku: "SPS39.MIC10" },
  { id: 1136, sku: "SPS39.5AD" },
  { id: 1137, sku: "SPS39.10AD" },
  { id: 1138, sku: "SPS39.5AM" },
  { id: 1139, sku: "SPS39.10AM" },
  { id: 1140, sku: "SPS39.50AM" },
  { id: 1141, sku: "SPS39.AR50" },
  { id: 1142, sku: "SPS39.AP2" },
  { id: 1143, sku: "SPS39.AP5" },
  { id: 1144, sku: "SPS39.SLU5" },
  { id: 1145, sku: "SPS39.CND5" },
  { id: 1146, sku: "SPS39.CND10" },
  { id: 1147, sku: "SPS39.CD5" },
  { id: 1148, sku: "SPS39.CD10" },
  { id: 1149, sku: "SPS39.IP2" },
  { id: 1150, sku: "SPS39.IP5" },
  { id: 1151, sku: "SPS39.IP10" },
  { id: 1152, sku: "SPS39.CP10" },
  { id: 1153, sku: "SPS39.G25" },
  { id: 1154, sku: "SPS39.G210" },
  { id: 1155, sku: "SPS39.G65" },
  { id: 1156, sku: "SPS39.G610" },
  { id: 1157, sku: "SPS39.HX2" },
  { id: 1158, sku: "SPS39.HX5" },
  { id: 1159, sku: "SPS39.H10" },
  { id: 1160, sku: "SPS39.H36" },
  { id: 1161, sku: "SPS39.SMO5" },
  { id: 1162, sku: "SPS39.SMO10" },
  { id: 1163, sku: "SPS39.TSM5" },
  { id: 1164, sku: "SPS39.TSM10" },
  { id: 1165, sku: "SPS39.TSM20" },
  { id: 1166, sku: "SPS39.AE1" },
  { id: 1167, sku: "SPS39.FM2" },
  { id: 1168, sku: "SPS39.FMP2" },
  { id: 1169, sku: "SPS39.FN1" },
  { id: 1170, sku: "SPS39.IGD" },
  { id: 1171, sku: "SPS39.IG1" },
  { id: 1172, sku: "SPS39.G10K" },
  { id: 1173, sku: "SPS39.G5K" },
  { id: 1174, sku: "SPS39.P41" },
  { id: 1175, sku: "SPS39.GND2" },
  { id: 1176, sku: "SPS39.OT2" },
  { id: 1177, sku: "SPS39.OT5" },
  { id: 1178, sku: "SPS39.OT10" },
  { id: 1179, sku: "SPS39.KS5" },
  { id: 1180, sku: "SPS39.KS10" },
  { id: 1181, sku: "SPS39.EP0" },
  { id: 1182, sku: "SPS39.DS2" },
  { id: 1183, sku: "SPS39.DS5" },
  { id: 1184, sku: "SPS39.DS10" },
  { id: 1185, sku: "SPS39.SK10" },
  { id: 1186, sku: "SPS39.XA10" },
  { id: 1187, sku: "SPS39.PIN5" },
  { id: 1188, sku: "SPS39.PIN10" },
  { id: 1189, sku: "SPS39.ADA5" },
  { id: 1190, sku: "SPS39.ADA10" },
  { id: 1191, sku: "SPS39.2S10" },
  { id: 1192, sku: "SPS39.2S50" },
  { id: 1193, sku: "SPS39.MS10" },
  { id: 1194, sku: "SPS39.MS20" },
  { id: 1195, sku: "SPS39.MS40" },
  { id: 1196, sku: "SPS39.HUM10" },
  { id: 1197, sku: "SPS39.RA10" },
  { id: 1198, sku: "SPS39.RA16" },
  { id: 1199, sku: "SPS39.NJ500" },
  { id: 1200, sku: "SPS39.NJ1000" },
  { id: 1201, sku: "SPS39.GTT1000" },
  { id: 1202, sku: "SPS39.GTT1500" },
  { id: 1203, sku: "SPS39.PN5" },
  { id: 1204, sku: "SPS39.TA5" },
  { id: 1205, sku: "SPS39.TA10" },
  { id: 1206, sku: "SPS39.TY10" },
  { id: 1207, sku: "SPS39.CAR10" },
  { id: 1208, sku: "SPS39.CAR20" },
  { id: 1209, sku: "SPS39.CRY10" },
  { id: 1210, sku: "SPS39.CRY20" },
  { id: 1211, sku: "SPS39.VIP5" },
  { id: 1212, sku: "SPS39.VIP10" },
  { id: 1213, sku: "SPS39.KK37" },
];

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
    const results: { id: number; sku: string; status: string; error?: string }[] = [];

    // Process in batches of 10 to avoid rate limits
    for (let i = 0; i < PRODUCTS.length; i += 10) {
      const batch = PRODUCTS.slice(i, i + 10);
      const promises = batch.map(async (product) => {
        try {
          const res = await fetch(`${BASE_URL}/products/${product.id}`, {
            method: "PUT",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: product.sku }),
          });

          if (!res.ok) {
            const errBody = await res.text();
            results.push({ id: product.id, sku: product.sku, status: "failed", error: `${res.status}: ${errBody}` });
          } else {
            results.push({ id: product.id, sku: product.sku, status: "updated" });
          }
        } catch (err) {
          results.push({ id: product.id, sku: product.sku, status: "failed", error: (err as Error).message });
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
