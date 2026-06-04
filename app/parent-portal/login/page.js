import Layout from "@/component/layout/Layout";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import ParentLoginSection from "@/component/parent/ParentLoginSection";

export const metadata = { title: "Parent Portal – East Asian International School" };

export default function ParentPortalLogin() {
  return (
    <Layout>
      <BreadcrumbSection title="Parent Portal" header="Parent Portal" />
      <ParentLoginSection />
    </Layout>
  );
}
