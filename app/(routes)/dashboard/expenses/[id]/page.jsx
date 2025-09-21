"use client"
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import React, { useEffect , use, useState} from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from '../_components/AddExpense'
import ExpenseListTable from '../_components/ExpenseListTable'
import { Button } from '@/components/ui/button'
import { PenBox, Trash } from 'lucide-react'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import EditBudget from '../_components/EditBudget'


function ExpensesScreen({params}) {
    const { id } = use(params);
    const {user}=useUser();
    const [budgetInfo,setbudgetInfo]=useState();
    const [expensesList,setExpensesList]=useState();
    const route=useRouter();
    
    useEffect(() => {
        user&&getBudgetInfo();
    },[user]);

    const getBudgetInfo=async()=>{
        const result = await db.select({
              ...getTableColumns(Budgets),
              totalSpend:sql `sum(${Expenses.amount})`.mapWith(Number),
              totalItem:sql `count(${Expenses.id})`.mapWith(Number)
            }).from(Budgets)
            .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
            .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id,id))
            .groupBy(Budgets.id);
        setbudgetInfo(result[0]);
        getExpensesList();
    }
    const getExpensesList=async()=>{
        const result = await db.select().from(Expenses).where(eq(Expenses.budgetId,id)).orderBy(desc(Expenses.id));
        setExpensesList(result);
        console.log(result);    
    }
    const deleteBudget=async()=>{
        const deleteExpenseResult=await db.delete(Expenses).where(eq(Expenses.budgetId,id)).returning();
        if(deleteExpenseResult){
            const result = await db.delete(Budgets).where(eq(Budgets.id,id)).returning();
        }
        toast('Budget Deleted!');
        route.replace('/dashboard/budgets');
    }
  return (
    <div className='p-10'>
        <h2 className='text-2xl font-bold '>
            <div className='flex items-center'>
                <button onClick={() => route.back()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                >
                    <path d="M7 18l-6-6 6-6" />
                    <line x1="3" y1="12" x2="15" y2="12" />
                </svg>
                </button>
                
                <h2 className='font-bold text-'>My Expenses</h2>
            </div>
            <div className='flex mt-4 gap-2 justify-end items-center'>
                {budgetInfo ? <EditBudget budgetInfo={budgetInfo} refreshData={()=>getBudgetInfo()} /> :
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                }
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='flex gap-2' variant='destructive'> <Trash/>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your current budget along with expenses
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
            {budgetInfo?<BudgetItem
                budget={budgetInfo}
                /> :
                <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
            }
            <AddExpense budgetId={id} user={user} refreshData={()=>getBudgetInfo()}/>
        </div>
        <div className='mt-4'>
            {expensesList? <ExpenseListTable expensesList={expensesList} refreshData={()=>getBudgetInfo()} /> :
                <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
            }
            
        </div>
    </div>
  )
}

export default ExpensesScreen