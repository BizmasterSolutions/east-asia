import ErrorSection from "@/component/error/ErrorSection";
import EventDetailSection from "@/component/event/EventDetailSection";
import Layout from "@/component/layout/Layout";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event Not Found" };
  return { title: event.title, description: event.description || "" };
}

export default async function EventDetails({ params }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  return (
    <Layout>
      {event ? <EventDetailSection event={event} /> : <ErrorSection type="Event" />}
    </Layout>
  );
}
