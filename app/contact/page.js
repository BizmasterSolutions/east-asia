import ContactPageSection from "@/component/contact/ContactPageSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: 'East Asian Contact Page',
  description: 'Developed by Bizmaster Solutions',
}
export default function Contact() {
    return (
        <Layout>
            <ContactPageSection/>
        </Layout>
    )
}
