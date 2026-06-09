import AllBlogSection from "@/component/blog/AllBlogSection";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: 'East Asian Blog Page',
  description: 'Developed by Bizmaster Solutions',
}
export default function Blog() {
    return (
        <Layout>
            <BreadcrumbSection header="Blog" title="Blog"/>
            <AllBlogSection/>
        </Layout>
    )
}