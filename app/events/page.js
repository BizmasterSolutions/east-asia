import AllEventSection from "@/component/event/AllEventSection";
import Layout from "@/component/layout/Layout";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "East Asian Events Page",
  description: "Developed by Bizmaster Solutions",
};

export default async function Event() {
  const events = await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
  return (
    <Layout>
      <AllEventSection events={events} />
    </Layout>
  );
}
