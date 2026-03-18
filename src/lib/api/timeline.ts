export async function getTimelineEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timelines`);

  const { timelineEvents } = await res.json();

  return timelineEvents;
}
