'use client'
import React, { useEffect, useState } from 'react'
import {UserButton, useUser } from '@clerk/nextjs'

import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import ExpenseListTable from './_components/ExpenseListTable';

function Dashboard() {
    const {user} = useUser();
    const [budgetList,setBudgetList] = useState([]);
    const [expensesList,setExpensesList] = useState([]); 
      useEffect(() => {
        user&&getBudgetList();
      },[user])
    const getBudgetList=async()=>{
        const result = await db.select({
          ...getTableColumns(Budgets),
          totalSpend:sql `sum(${Expenses.amount})`.mapWith(Number),
          totalItem:sql `count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
        .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));
        setBudgetList(result);
        getAllExpenses();
        console.log(result);
    }
    const getAllExpenses=async()=>{
        const result = await db.select({
          id:Expenses.id,
          name:Expenses.name,
          amount:Expenses.amount,
          createdAt:Expenses.createdAt
        }).from(Budgets).rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId)).where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress)).orderBy(desc(Expenses.id)) ;
        setExpensesList(result);
    }

    return (
        <div className='p-8'>
            <div className='mt-2'>
                <h2 className='font-bold text-3xl'>My Expenses</h2>
                <div className="md:col-span-2">
                    <ExpenseListTable expensesList={expensesList} refreshData={()=>getBudgetList()}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

