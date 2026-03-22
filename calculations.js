/**
 * Excel-aligned formulas:
 * TT:  ((hours + minutes/60) / 4) * 100
 * CC:  (calls / criteria) * 100
 * KRA: (TT + CC) / 2
 */
function parseNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function computeTT(hours, minutes) {
  const h = parseNum(hours);
  const m = parseNum(minutes);
  return ((h + m / 60) / 4) * 100;
}

function computeCC(calls, criteria) {
  const c = parseNum(calls);
  const crit = parseNum(criteria, 1);
  if (crit <= 0) return 0;
  return (c / crit) * 100;
}

function computeKRA(tt, cc) {
  return (tt + cc) / 2;
}

function groupFromKRA(kra) {
  if (kra > 150) return 'Group Alpha';
  if (kra > 135) return 'Group A';
  if (kra > 120) return 'Group B';
  if (kra > 100) return 'Group C';
  if (kra > 80) return 'Group D';
  if (kra > 60) return 'Group E';
  return 'Group F';
}

function payFromKRA(kra) {
  if (kra > 150) return 1100;
  if (kra > 135) return 1000;
  if (kra > 120) return 900;
  if (kra > 100) return 750;
  if (kra > 80) return 500;
  if (kra > 60) return 300;
  return 0;
}

function computeAll(hours, minutes, calls, criteria) {
  const tt = computeTT(hours, minutes);
  const cc = computeCC(calls, criteria);
  const kra = computeKRA(tt, cc);
  const group = groupFromKRA(kra);
  const pay = payFromKRA(kra);
  return { tt, cc, kra, group, pay };
}

/** "Group A" -> "A"; "Group Alpha" -> "Alpha" */
function formatGroupShort(group) {
  if (group == null || group === '') return '—';
  return String(group)
    .replace(/^Group\s+/i, '')
    .trim();
}

/** ISO date -> "21 Mar 2026" */
function formatDatePretty(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPctOneDec(n) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  return Number(n).toFixed(1);
}

/** Older saved rows may miss tt/cc/kra — recompute if needed */
function getEntryMetrics(e) {
  if (
    e.tt != null &&
    e.cc != null &&
    e.kra != null &&
    e.group != null &&
    String(e.group).length > 0
  ) {
    return {
      tt: Number(e.tt),
      cc: Number(e.cc),
      kra: Number(e.kra),
      group: e.group,
    };
  }
  return computeAll(e.hours, e.minutes, e.calls, e.criteria);
}
