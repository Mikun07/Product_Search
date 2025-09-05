import { jsPDF } from "jspdf";

// Brand palette
const BRAND = [32, 121, 201];   // #2079c9
const DARK  = [11, 12, 16];     // #0B0C10
const GRAY  = [120, 120, 130];
const LGRAY = [220, 222, 226];
const WHITE = [255, 255, 255];
const GREEN = [34, 197, 94];

// ─── helpers ────────────────────────────────────────────────────────────────
const rgb  = (doc, [r, g, b]) => doc.setTextColor(r, g, b);
const fill = (doc, [r, g, b]) => doc.setFillColor(r, g, b);
const ln   = (doc, [r, g, b]) => doc.setDrawColor(r, g, b);

function receiptId() {
  return "MKN-" + Date.now().toString(36).toUpperCase();
}

// jsPDF's built-in Helvetica only covers Latin-1 (ISO-8859-1).
// NGN naira sign (U+20A6) and the euro sign (U+20AC) fall outside it.
// We use safe ASCII alternatives: "NGN" prefix for naira, plain "E" for euro
// when we can't embed a custom font.
function fmt(usdAmount, currency, rates) {
  const rate = rates[currency] ?? 1;
  const converted = usdAmount * rate;

  if (currency === "NGN") {
    return "NGN " + Math.round(converted).toLocaleString("en-US");
  }
  if (currency === "EUR") {
    return "EUR " + converted.toFixed(2);
  }
  // USD "$" and GBP "£" are both in Latin-1 — safe to use directly
  const symbols = { USD: "$", GBP: "\xa3" }; // \xa3 = £ in Latin-1
  const symbol  = symbols[currency] ?? "$";
  return symbol + converted.toFixed(2);
}

// Draw a thin horizontal rule
function rule(doc, y, color = LGRAY) {
  ln(doc, color);
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);
}

// Rounded rect helper
function rRect(doc, x, y, w, h, r, fillColor) {
  fill(doc, fillColor);
  doc.roundedRect(x, y, w, h, r, r, "F");
}

// Draw a vector checkmark at (cx, cy) with given size and colour
function drawCheck(doc, cx, cy, size, color) {
  ln(doc, color);
  doc.setLineWidth(size * 0.18);
  // Two line segments: down-left then up-right
  const x1 = cx - size * 0.38, y1 = cy;
  const x2 = cx - size * 0.1,  y2 = cy + size * 0.35;
  const x3 = cx + size * 0.42, y3 = cy - size * 0.45;
  doc.line(x1, y1, x2, y2);
  doc.line(x2, y2, x3, y3);
}

// Draw one small logo stamp: shopping bag outline + "MS" label
function drawLogoStamp(doc, cx, cy, size) {
  const bw = size;
  const bh = size * 0.85;
  const bx = cx - bw / 2;
  const by = cy - bh / 2 + size * 0.1;

  // Bag body (filled rounded rect)
  fill(doc, BRAND);
  doc.roundedRect(bx, by, bw, bh, size * 0.12, size * 0.12, "F");

  // Handle (arc drawn as two lines forming a U)
  ln(doc, BRAND);
  doc.setLineWidth(size * 0.09);
  const hx = cx;
  const hTop = by - size * 0.28;
  const hBot = by;
  const hHalf = bw * 0.28;
  doc.line(hx - hHalf, hBot, hx - hHalf, hTop);
  doc.line(hx - hHalf, hTop, hx + hHalf, hTop);
  doc.line(hx + hHalf, hTop, hx + hHalf, hBot);

  // "MS" label inside bag
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size * 0.55);
  rgb(doc, WHITE);
  doc.text("MS", cx, by + bh * 0.65, { align: "center" });
}


// ─── MAIN ───────────────────────────────────────────────────────────────────
export function generateReceipt({ items, subtotal, currency, rates }) {
  const doc   = new jsPDF({ unit: "mm", format: "a4" });
  const PW    = doc.internal.pageSize.getWidth();   // 210
  const PH    = doc.internal.pageSize.getHeight();  // 297
  const LEFT  = 14;
  const RIGHT = PW - 14;
  const CX    = PW / 2;

  const id      = receiptId();
  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  // ── header band ──
  fill(doc, DARK);
  doc.rect(0, 0, PW, 52, "F");

  // Logo stamp in header — larger, white bag with blue fill
  drawLogoStamp(doc, CX, 14, 16);

  // "MikunStore" wordmark
  doc.setFontSize(19);
  doc.setFont("helvetica", "bold");
  rgb(doc, WHITE);
  doc.text("Mikun", CX, 30, { align: "right" });
  rgb(doc, BRAND);
  doc.text("Store", CX + 0.5, 30);

  // Tagline
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  rgb(doc, [160, 165, 180]);
  doc.text("Your trusted shopping destination", CX, 37, { align: "center" });

  // "PURCHASE RECEIPT" label
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  rgb(doc, BRAND);
  doc.text("PURCHASE RECEIPT", CX, 45, { align: "center" });

  // ── meta card ──
  let y = 60;
  rRect(doc, LEFT, y, PW - 28, 30, 3, [245, 246, 250]);

  // Labels (gray)
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  rgb(doc, GRAY);
  doc.text("Receipt No.",   LEFT + 4,  y + 6);
  doc.text("Purchased by",  LEFT + 4,  y + 14);
  doc.text("Date",          LEFT + 90, y + 6);
  doc.text("Time",          LEFT + 90, y + 18);
  doc.text("Status",        LEFT + 148, y + 6);

  // Values (dark)
  doc.setFont("helvetica", "bold");
  rgb(doc, DARK);
  doc.setFontSize(8.5);
  doc.text(id,                         LEFT + 4,  y + 11);
  doc.text("Festus-Olaleye Ayomikun",  LEFT + 4,  y + 20);
  doc.text(dateStr,                    LEFT + 90, y + 11);
  doc.text(timeStr,                    LEFT + 90, y + 24);

  // PAID badge — drawn with shapes only, no special chars
  fill(doc, [220, 252, 231]);
  doc.roundedRect(LEFT + 146, y + 10, 28, 9, 2, 2, "F");
  // Vector checkmark
  drawCheck(doc, LEFT + 152, y + 16, 5, GREEN);
  // "PAID" text
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  rgb(doc, GREEN);
  doc.text("PAID", LEFT + 168, y + 16.5, { align: "center" });

  // ── items table header ──
  y += 38;
  rRect(doc, LEFT, y, PW - 28, 9, 2, BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  rgb(doc, WHITE);
  doc.text("ITEM",       LEFT + 4, y + 6);
  doc.text("QTY",        132, y + 6, { align: "center" });
  doc.text("UNIT PRICE", 160, y + 6, { align: "center" });
  doc.text("TOTAL",      RIGHT - 2, y + 6, { align: "right" });

  // ── items rows ──
  y += 13;

  items.forEach((item, idx) => {
    const effectiveUsd =
      item.discountPercentage > 0
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
    const lineTotal = effectiveUsd * item.quantity;

    // Zebra stripe
    if (idx % 2 === 0) {
      fill(doc, [248, 249, 252]);
      doc.rect(LEFT, y - 4, PW - 28, 13, "F");
    }

    // Category pill
    rRect(doc, LEFT + 3, y - 2.5, 20, 5, 1.5, [232, 240, 252]);
    doc.setFontSize(5.5);
    rgb(doc, BRAND);
    doc.setFont("helvetica", "bold");
    const catLabel = item.category.length > 10
      ? item.category.slice(0, 9).toUpperCase()
      : item.category.toUpperCase();
    doc.text(catLabel, LEFT + 13, y + 0.7, { align: "center" });

    // Product name — ASCII ellipsis safe
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    rgb(doc, DARK);
    const name = item.name.length > 40
      ? item.name.slice(0, 38) + "..."
      : item.name;
    doc.text(name, LEFT + 26, y + 1);

    // Brand
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    rgb(doc, GRAY);
    doc.text(item.brand, LEFT + 26, y + 6.5);

    // Discount badge (if any)
    if (item.discountPercentage > 0) {
      const brandW = doc.getTextWidth(item.brand);
      rRect(doc, LEFT + 26 + brandW + 3, y + 2.5, 17, 5, 1.5, BRAND);
      doc.setFontSize(5.5);
      rgb(doc, WHITE);
      doc.setFont("helvetica", "bold");
      doc.text(
        `-${item.discountPercentage}% OFF`,
        LEFT + 26 + brandW + 3 + 8.5,
        y + 6,
        { align: "center" }
      );
    }

    // Qty
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    rgb(doc, DARK);
    doc.text(String(item.quantity), 132, y + 1, { align: "center" });

    // Unit price
    doc.setFont("helvetica", "normal");
    rgb(doc, GRAY);
    doc.text(fmt(effectiveUsd, currency, rates), 160, y + 1, { align: "center" });

    // Line total
    doc.setFont("helvetica", "bold");
    rgb(doc, DARK);
    doc.text(fmt(lineTotal, currency, rates), RIGHT - 2, y + 1, { align: "right" });

    y += 14;

    // Page break guard
    if (y > PH - 65) {
      doc.addPage();
      y = 20;
    }
  });

  // ── divider ──
  y += 4;
  rule(doc, y, BRAND);
  y += 10;

  // ── totals block ──
  const totalsX = 118;

  // Subtotal
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  rgb(doc, GRAY);
  doc.text("Subtotal", totalsX, y);
  doc.setFont("helvetica", "bold");
  rgb(doc, DARK);
  doc.text(fmt(subtotal, currency, rates), RIGHT - 2, y, { align: "right" });
  y += 9;

  // Shipping
  doc.setFont("helvetica", "normal");
  rgb(doc, GRAY);
  doc.text("Shipping", totalsX, y);
  doc.setFont("helvetica", "bold");
  rgb(doc, GREEN);
  doc.text("FREE", RIGHT - 2, y, { align: "right" });
  y += 9;

  rule(doc, y);
  y += 9;

  // Grand total box
  rRect(doc, totalsX - 4, y - 6, RIGHT - totalsX + 6, 13, 2.5, [232, 240, 252]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  rgb(doc, DARK);
  doc.text("TOTAL", totalsX, y + 3.5);
  rgb(doc, BRAND);
  doc.setFontSize(12);
  doc.text(fmt(subtotal, currency, rates), RIGHT - 2, y + 3.5, { align: "right" });

  y += 22;

  // ── items count pill ──
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  rRect(doc, LEFT, y, 72, 10, 2.5, [245, 246, 250]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  rgb(doc, GRAY);
  doc.text(
    `${totalQty} item${totalQty === 1 ? "" : "s"} purchased`,
    LEFT + 6, y + 6.5
  );

  // ── thank-you section ──
  y += 22;
  rule(doc, y);
  y += 9;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  rgb(doc, DARK);
  doc.text("Thank you for shopping with us!", CX, y, { align: "center" });
  y += 8;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  rgb(doc, GRAY);
  doc.text("Questions? Contact us at support@mikunstore.com", CX, y, { align: "center" });
  y += 5;
  doc.text(
    "mikunstore.com  -  All transactions are secure and encrypted",
    CX, y, { align: "center" }
  );

  // ── bottom strip ──
  const stripY = PH - 12;
  fill(doc, DARK);
  doc.rect(0, stripY, PW, 12, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  rgb(doc, [80, 85, 100]);
  doc.text(
    "(c) 2024 MikunStore  -  All Rights Reserved",
    CX, stripY + 7.5, { align: "center" }
  );

  // ── save ──
  doc.save(`MikunStore_Receipt_${id}.pdf`);
}
