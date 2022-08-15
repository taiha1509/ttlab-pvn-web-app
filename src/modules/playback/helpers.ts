// 120 (s) => 00:02:00
export function parseSecondsToHMS(seconds: number): string {
    if (!seconds) return '';
    let h: string | number = Math.floor(seconds / 3600);
    let m: string | number = Math.floor((seconds - h * 3600) / 60);
    let s: string | number = seconds - h * 3600 - m * 60;
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    return h + ':' + m + ':' + s;
}
