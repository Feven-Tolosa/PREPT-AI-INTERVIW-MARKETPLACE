import {
  format,
  isToday,
  isTomorrow,
  addDays,
  addMinutes,
  isBefore,
  isAfter,
  set,
  differenceInMinutes,
} from "date-fns";

// "Mon, Mar 24, 2026" — used in appointment cards
export function formatDate(iso) {
  return format(new Date(iso), "EEE, MMM d, yyyy");
}

// "Monday, March 24, 2026" — used in the booking confirm card
export function formatDateFull(date) {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

// "9:30 AM" — used anywhere a time-only string is needed (slot buttons, appointment rows)
export function formatTime(date) {
  return format(new Date(date), "h:mm a");
}

// "2:38 PM" — formats an "HH:mm" time-of-day string (used for the daily
// availability window on cards, profile badges and the dashboard).
export function formatTimeOfDay(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

// "1h 30m" or "45m" — used in appointment cards to show session length
export function formatDuration(start, end) {
  const mins = differenceInMinutes(new Date(end), new Date(start));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

// Returns { top, bottom } label for each date tab in SlotPicker.
// Today/Tomorrow get friendly labels; all other days show short weekday name.
// bottom is always "MMM d" (e.g. "Mar 24") regardless of which branch.
export function formatDateTab(date) {
  const bottom = format(date, "MMM d");
  if (isToday(date)) return { top: "Today", bottom };
  if (isTomorrow(date)) return { top: "Tomorrow", bottom };
  return { top: format(date, "EEE"), bottom };
}

// Produces an array of Date objects starting from today, one per day,
// for the next `daysAhead` days — used to populate the date tab strip.
export function generateDates(daysAhead) {
  return Array.from({ length: daysAhead }, (_, i) => addDays(new Date(), i));
}

// Splits an interviewer's recurring daily availability window into fixed-length
// slots and marks each one as booked or available.
//
// - date:                the calendar day to generate slots for
// - availStartTime:      "HH:mm" start of the daily window (repeats every day)
// - availEndTime:        "HH:mm" end of the daily window
// - bookedSlots:         existing SCHEDULED bookings to check for conflicts
// - slotDurationMinutes: length of each slot (45 min throughout the app)
//
// The window's hours/minutes are applied onto the target day, so it repeats
// automatically every day with no per-date setup. Past slots (cursor <= now)
// are skipped entirely so they never appear in the UI. A slot is marked
// isBooked if it overlaps any existing booking using a standard overlap check:
// slotStart < bookedEnd && slotEnd > bookedStart.
export function generateSlots(
  date,
  availStartTime,
  availEndTime,
  bookedSlots,
  slotDurationMinutes
) {
  const [sh, sm] = (availStartTime ?? "").split(":").map(Number);
  const [eh, em] = (availEndTime ?? "").split(":").map(Number);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return [];

  // Apply the daily window hours/minutes onto the target calendar day
  const start = set(new Date(date), {
    hours: sh,
    minutes: sm,
    seconds: 0,
    milliseconds: 0,
  });

  const end = set(new Date(date), {
    hours: eh,
    minutes: em,
    seconds: 0,
    milliseconds: 0,
  });

  const now = new Date();
  const slots = [];
  let cursor = start;

  while (isBefore(cursor, end)) {
    const slotEnd = addMinutes(cursor, slotDurationMinutes);

    // Drop the last partial slot if it would overflow the window
    if (isAfter(slotEnd, end)) break;

    const isBooked = bookedSlots.some(
      (b) =>
        isBefore(cursor, new Date(b.endTime)) &&
        isAfter(slotEnd, new Date(b.startTime))
    );

    // Only push future slots — past ones are silently skipped
    if (isAfter(cursor, now)) {
      slots.push({
        startTime: cursor,
        endTime: slotEnd,
        isBooked,
        available: !isBooked,
      });
    }

    cursor = slotEnd;
  }

  return slots;
}
