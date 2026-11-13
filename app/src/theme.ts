import {staticFile} from 'remotion';

export const YELLOW = '#FFD60A';
export const DARK = 'rgba(8,12,20,0.72)';
// TikTok / Reels UI-safe area on a 1080x1920 canvas.
export const SAFE = {top: 260, bottom: 440, left: 64, right: 170};
export const SAFE_W = 1080 - SAFE.left - SAFE.right;

export const FONT_CSS = `
@font-face{font-family:'Anton';src:url('${staticFile('fonts/anton-latin-400-normal.woff2')}') format('woff2');font-weight:400;}
@font-face{font-family:'Montserrat';src:url('${staticFile('fonts/montserrat-latin-600-normal.woff2')}') format('woff2');font-weight:600;}
@font-face{font-family:'Montserrat';src:url('${staticFile('fonts/montserrat-latin-800-normal.woff2')}') format('woff2');font-weight:800;}
@font-face{font-family:'Montserrat';src:url('${staticFile('fonts/montserrat-latin-900-normal.woff2')}') format('woff2');font-weight:900;}
`;
