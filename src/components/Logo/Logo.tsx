import Link from "next/link";
import {PAGES} from "@/configs/pages.config";

const Logo = () => {
  return (
    <Link href={PAGES.CHAT()}>
      SQLFactory
    </Link>
  )
}

export default Logo