'use client'
import React from 'react'
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link'
function SideNav() {
  const path = usePathname();
  const menuList = [
    {
      id:1,
      name:'Dashboard',
      icon:LayoutGrid,
      path:'/dashboard'
    },
    {
      id:2,
      name:'Budgets',
      icon:PiggyBank,
      path:'/dashboard/budgets'
    },
    {
      id:3,
      name:'Expenses',
      icon:ReceiptText,
      path:'/dashboard/expenses'
    },
  ]
  return (
    <div className='h-screen p-5'>
      <Image src={'../logo.svg'} 
      alt='logo'
      width={100}
      height={0}
      className='ml-5'
      />
      <div className='mt-5'>
        {menuList.map((menu,index) => (
          <Link href={menu.path} key={menu.id}>
            <h2 className={`flex gap-2 items-center text-gray-700 font-medium p-5 cursor-pointer rounded-md mb-2 hover:text-primary hover:bg-blue-100 ${menu.path == path && 'text-primary bg-blue-100'}`}>
              <menu.icon/>
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <UserButton/>
        Profile
      </div>
    </div>
  )
}

export default SideNav