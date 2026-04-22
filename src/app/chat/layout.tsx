import Aside from "@/components/Aside/Aside";

export default function ChatLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Aside />
      <main>
        {children}
      </main>
    </>
  )
}