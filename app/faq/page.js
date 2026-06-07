import AllFaqSection from "@/component/faq/AllFaqSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: 'East Asian FAQ Page',
  description: 'Developed by Azizur Rahman',
}
export default function Faq() {
    return (
        <Layout>
            <AllFaqSection/>
        </Layout>
    )
}
