// Source summaries and student notes are text, never executable markup.
export const html = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export function sourceLink(url, label = 'Official Source') {
  return /^https?:\/\//.test(url || '')
    ? `<a href="${html(url)}" target="_blank" rel="noopener noreferrer">${html(label)} ↗</a>`
    : '';
}
