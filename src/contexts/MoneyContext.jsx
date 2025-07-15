import { createSignal, createContext, useContext, createMemo } from "solid-js";

const MoneyContext = createContext();

export function MoneyProvider(props) {
    const [moneyIn, setMoneyIn] = createSignal([]);
    const [moneyOut, setMoneyOut] = createSignal([]);

    const addMoneyIn = (transaction) => {
        setMoneyIn(prev => [...prev, transaction]);
    };
    const takeMoneyOut = (transaction) => {
        setMoneyOut(prev => [...prev, transaction]);
    };

    const totalIncome = createMemo(() => {
        return moneyIn().reduce((sum, transaction) => {
        return sum + (transaction.amount || 0);
        }, 0);
    });
    const totalExpenses = createMemo(() => {
        return moneyOut().reduce((sum, transaction) => {
        return sum + (transaction.amount || 0);
        }, 0);
    });
    const totalSavings = createMemo(() => {
        return moneyIn().reduce((sum, transaction) => {
        return sum + (transaction.savings || 0);
        }, 0);
    });
    const totalSavingsWithdrawn = createMemo(() => {
        return moneyOut().reduce((sum, transaction) => {
        return sum + (transaction.savings || 0);
        }, 0);
    });
    const savings = createMemo(() => {
        return totalSavings() - totalSavingsWithdrawn();
    });
    const allowance = createMemo(() => {
        return totalIncome() - totalExpenses() - savings();
    });

    const store = {
        totalIncome,
        totalExpenses,
        totalSavings,
        totalSavingsWithdrawn,
        allowance,
        savings,
        moneyIn,
        moneyOut,
        setMoneyIn,
        setMoneyOut,
        addMoneyIn,
        takeMoneyOut,
    };

    return (
        <MoneyContext.Provider value={store}>
        {props.children}
        </MoneyContext.Provider>
    );
}

export function useMoney() {return useContext(MoneyContext);}