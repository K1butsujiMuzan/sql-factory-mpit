'use client'

import {useState} from "react";
import {cn} from "@/lib/cn";
import Logo from "@/components/Logo/Logo";

const Aside = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const onToggleIsOpen = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <aside className={'w-42 bg-gray-200 rounded-tr-20 rounded-br-20 py-5'}>
      <div className={'flex items-center justify-between pr-3 pl-5'}>
        <Logo />
        <button
          onClick={onToggleIsOpen}
          className={'text-purple-400 bg-gray-100 p-0.75 rounded-full'}
          type={'button'}
        >
          <svg
            className={cn('transition duration-300', {
              'rotate-180': !isOpen
            })}
            aria-hidden={true}
            role={'img'}
            width="18" height="18" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.9146 15.77L6.75288 10.6083C6.1433 9.99872 6.1433 9.00122 6.75288 8.39163L11.9146 3.22997" stroke="#5659E9" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default Aside