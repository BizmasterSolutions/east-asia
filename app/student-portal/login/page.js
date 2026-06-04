import Layout from "@/component/layout/Layout";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import StudentLoginSection from "@/component/student/StudentLoginSection";

export const metadata = {
  title: "Student Portal – East Asian International School",
};

export default function StudentPortalLogin() {
  return (
    <Layout>
      <BreadcrumbSection title="Student Portal" header="Student Portal" />
      <StudentLoginSection />
    </Layout>
  );
}
