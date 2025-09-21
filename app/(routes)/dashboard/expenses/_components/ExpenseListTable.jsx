import React from 'react'
import { Trash } from 'lucide-react'
import { Expenses } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/components/ui/alert-dialog"

function ExpenseListTable({expensesList,refreshData}) {
    const deleteExpense = async(expense) => {
        const result = await db.delete(Expenses).where(eq(Expenses.id,expense.id)).returning();
        if(result){
            toast('Expense Deleted!');
            refreshData();
        }
    }
    return (
        <div className='mt-3'>
            <h2 className='font-bold text-lg'>Latest Expenses</h2>
            <div className='grid grid-cols-4 bg-slate-200 p-2 mt-3'>
                <h2 className='font-bold text-center'>Name</h2>
                <h2 className='font-bold text-center'>Amount</h2>
                <h2 className='font-bold text-center'>Date</h2>
                <h2 className='font-bold text-center'>Action</h2> 
                
            </div>
            {expensesList.map((expenses,index)=>(
                <div key={expenses.id} className='grid grid-cols-4 bg-slate-100 p-2'>
                <h2 className="text-center break-words whitespace-normal max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{expenses.name}</h2>
                <h2 className="text-center break-words whitespace-normal max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{expenses.amount}</h2>
                <h2 className="text-center break-words whitespace-normal max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{expenses.createdAt}</h2>
                <h2 className='flex justify-center'>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash className='text-red-600 cursor-pointer'/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your current expense
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>deleteExpense(expenses)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </h2> 
            </div>
            ))}
        </div>
    )
}

export default ExpenseListTable