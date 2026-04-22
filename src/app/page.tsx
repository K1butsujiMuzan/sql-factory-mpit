import LinkForm from "@/components/LinkForm/LinkForm";
import RequestSection from "@/components/RequestSection/RequestSection";

export default function Home() {
  return (
    <main>
      <RequestSection text={'SQLFactory'} >
        <LinkForm />
      </RequestSection>
    </main>
  )
}
