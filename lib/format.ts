export function fmtMoney(n: number): string {
  if (n >= 1e6) {
    return "$" + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + "M";
  }
  if (n >= 1e3) {
    return "$" + Math.round(n / 1e3) + "K";
  }
  return "$" + n;
}

export function fmtRoi(min: number, max: number): string {
  return `${min}–${max}%`;
}

export function fmtNumber(n: number): string {
  return n.toLocaleString();
}

export function flagUrl(code: string): string {
  return `https://flagcdn.com/${code}.svg`;
}
