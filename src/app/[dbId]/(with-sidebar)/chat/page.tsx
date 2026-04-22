import RequestSection from "@/components/RequestSection/RequestSection";
import ChatForm from "@/components/ChatForm/ChatForm";

const NewChatPage = () => {
  return (
    <RequestSection text={'Добрый день, что хотите узнать?'} className={'max-w-121'}>
      <ChatForm />
    </RequestSection>
  )
}

export default NewChatPage