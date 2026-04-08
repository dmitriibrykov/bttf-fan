import Timeline from "./_components/Timeline";

export async function generateMetadata() {
  return { title: "Timeline" };
}

export default async function TimelinePage() {
  return <Timeline />;
}
