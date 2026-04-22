import {cn} from "@/lib/cn";

interface Props {
  text: string
  className?: string
  children: Readonly<React.ReactNode>
}

const RequestSection = ({text, children, className}: Props) => {
  return (
    <section className={cn('flex flex-col gap-10 max-w-150 w-full items-center text-center', className)}>
      <h1 className={'text-2xl'}>{text}</h1>
      {children}
    </section>
  )
}

export default RequestSection