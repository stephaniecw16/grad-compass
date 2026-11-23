// Planning records deliberately contain no application submissions or private files.
export const checklist = [
  ['research', 'Read Program Requirements'],
  ['funding', 'Check Funding and Teaching'],
  ['deadline', 'Verify the Current Deadline'],
  ['materials', 'Plan Statements and Transcripts'],
  ['letters', 'Arrange Recommendation Letters'],
  ['external', 'Visit the Official Application Site'],
];
export const stages = ['Researching', 'Shortlisted', 'Preparing', 'Applied Elsewhere'];
export function dateOnly(value) {
  return typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
    ? value
    : '';
}
const text = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');
export function normalizePlan(value, programs) {
  const profile = value?.profile || {};
  const saved = {};
  for (const p of programs) {
    if (!Object.hasOwn(value?.saved || {}, p.id)) continue;
    const entry = value.saved[p.id] || {};
    saved[p.id] = {
      notes: text(entry.notes, 5000),
      stage: stages.includes(entry.stage) ? entry.stage : stages[0],
      // An empty override means use the published catalog date, not an inferred year.
      deadline: dateOnly(entry.deadline),
      tasks: Object.fromEntries(checklist.map(([id]) => [id, entry.tasks?.[id] === true])),
    };
  }
  return {
    profile: {
      name: text(profile.name, 120),
      college: text(profile.college, 200),
      interests: text(profile.interests, 1000),
    },
    saved,
  };
}
export function newSaved() {
  return { notes: '', stage: stages[0], deadline: '', tasks: {} };
}
export function effectiveDeadline(program, entry) {
  return dateOnly(entry?.deadline) || dateOnly(program.deadline);
}
export function daysAway(date, now = new Date()) {
  if (!dateOnly(date)) return null;
  return Math.round(
    (Date.parse(date + 'T12:00:00Z') -
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12)) /
      86400000,
  );
}
// Local calendar dates are all-day events. UTC generation avoids daylight-saving shifts.
export function calendarFile(rows) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GradApp//Student Planner//EN',
    'CALSCALE:GREGORIAN',
  ];
  const escape = (s) =>
    String(s)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  for (const { program, date } of rows) {
    if (!dateOnly(date)) continue;
    const end = new Date(Date.parse(date + 'T12:00:00Z') + 86400000).toISOString().slice(0, 10);
    lines.push(
      'BEGIN:VEVENT',
      'UID:' + program.id + '-' + date + '@gradapp.planner',
      'DTSTAMP:' +
        new Date()
          .toISOString()
          .replace(/[-:]/g, '')
          .replace(/\.\d+Z/, 'Z'),
      'DTSTART;VALUE=DATE:' + date.replaceAll('-', ''),
      'DTEND;VALUE=DATE:' + end.replaceAll('-', ''),
      'SUMMARY:' + escape(program.name + ' — ' + program.title),
      'DESCRIPTION:' +
        escape(
          'Personal planning deadline. Verify the current deadline with the university. GradApp does not submit applications.',
        ),
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  // RFC 5545 folds physical lines at 75 UTF-8 octets without splitting characters.
  return (
    lines
      .flatMap((line) => {
        const result = [];
        let part = '',
          bytes = 0;
        for (const char of line) {
          const length = new TextEncoder().encode(char).length;
          if (bytes + length > 75) {
            result.push(part);
            part = ' ';
            bytes = 1;
          }
          part += char;
          bytes += length;
        }
        result.push(part);
        return result;
      })
      .join('\r\n') + '\r\n'
  );
}
