import { createSignal, createContext, useContext, onMount } from "solid-js";
import { 
    openDatabase, loadData, addData, deleteData, updateData,
    addDataKey, deleteDataKey,
    putData, getData,
    ACCOUNT_STORE,
    TRANSACTIONS_STORE,
    BUDGET_STORE, 
    GOALS_STORE, 
    TAGS_STORE, 
    } 
    from "../utils/db";

const MoneyContext = createContext();

export function MoneyProvider(props) {
    const [allowance, setAllowance] = createSignal(0)
    const [savings, setSavings] = createSignal(0)
    const [totalBudgetCost, _setTotalBudgetCost] = createSignal({freqStr:'Biweekly', amount:0})

    const [transactions, setTransactions] = createSignal([]);
    const [transactionTags, setTransactionTags] = createSignal([]);
    const [budgetExpenses, setBudgetExpenses] = createSignal([]);
    const [goals, setGoals] = createSignal([])
    let db;

    onMount(async () => {
        try {
            db = await openDatabase();
            const storedAllowance = await getData(db, ACCOUNT_STORE, 'allowance');
            const storedSavings = await getData(db, ACCOUNT_STORE, 'savings');
            const storedTotalBudgetCost = await getData(db, ACCOUNT_STORE, 'totalBudgetCost');

            const storedTransactions = await loadData(db, TRANSACTIONS_STORE);
            const storedBudgetExpenses = await loadData(db, BUDGET_STORE);
            const storedGoals = await loadData(db, GOALS_STORE);
            const storedTags = await loadData(db, TAGS_STORE);

            if (storedAllowance) setAllowance(storedAllowance.value || 0);
            if (storedSavings) setSavings(storedSavings.value || 0);
            if (storedTotalBudgetCost) _setTotalBudgetCost(storedTotalBudgetCost.value || 0);

            if (storedTransactions.length > 0) {
                setTransactions(storedTransactions);
            }
            if (storedBudgetExpenses.length > 0) {
                setBudgetExpenses(storedBudgetExpenses);
            }
            if (storedGoals.length > 0) {
                setGoals(storedGoals);
            }
            if (storedTags.length > 0) {
                setTransactionTags(storedTags);
            }
        } catch (error) {
            console.error("Failed to initialize IndexedDB:", error);
        }
    });

    /**
     * Obtains the corresponding store & Setter.
     * @param {*} store The IndexedDB store name. Function will return it again.
     * @returns {Object} A reference to the store + the Setter of the store's signal.
     */
    const getStoreSetter = (store) => {
        let setter;
        switch(store) {
            case TRANSACTIONS_STORE:
                setter = setTransactions;
                break;
            case BUDGET_STORE:
                setter = setBudgetExpenses;
                break;
            case GOALS_STORE:
                setter = setGoals;
                break;
        }
        return setter
    }
    const getSetterFromSignalName = (signalName) => {
        let setter
        switch (signalName) {
            case 'allowance':
                setter = setAllowance;
                break;
             case 'savings':
                setter = setSavings;
                break; 
        }
        return setter
    }

    const saveToAccount = async (signalName, signalValue) => {
        const data = {
            id: signalName, // Unique ID for the allowance record
            value: signalValue     // Get the current value from the signal
        };
        try {
            //Adds/updates data to DB
            await putData(db, ACCOUNT_STORE, data);
        } catch (error) {
            console.error(`Failed to save ${data} to ACCOUNT_STORE:`, error);
        }
    };
    const changeAllowance = (amount) => {
        setAllowance(prev => prev + amount);
        saveToAccount('allowance', allowance());
    }

    const changeSavings = (amount) => {
        setSavings(prev => prev + amount);
        saveToAccount('savings', savings());
    };
    const setTotalBudgetCost = (object) => {
        _setTotalBudgetCost(object);
        saveToAccount('totalBudgetCost', totalBudgetCost());
    };


    /**
     * For id-type IndexedDB stores.
     * @param {Object} transaction The data object to be added to storage.
     * @param {String} store The IndexedDB store's name.
     */
    const addTransaction = async (transaction, store) => {
        if (!db) return;
        const setter = getStoreSetter(store);  
        try {
            //Adds object to corresponding DB store.
            const addedTransaction = await addData(db, store, transaction);
            //Adds object to array (the solid-js signal) using corresponding Setter.
            setter(prev => [...prev, addedTransaction]);
        } 
        catch (error) {console.error("Failed to add transaction:", error)}
    };

    /**
     * For id-type IndexedDB stores.
     * @param {Number} transactionID Unique id required to delete from IndexedDB.
     * @param {String} store The IndexedDB store's name.
     */
    const deleteTransaction = async (transactionID, store) => {
        if (!db) return;
        const setter = getStoreSetter(store);
        try {
            //Deletes object from corresponding DB store.
            await deleteData(db, store, transactionID);
            //Deletes object from array (the solid-js signal) using corresponding Setter.
            setter(prev => prev.filter(item => item.id !== transactionID));
        } 
        catch (error) {console.error(`Failed to delete transaction with ID ${transactionID}:`, error);}
    }

     /**
     * For id-type IndexedDB stores.
     * @param {Object} transaction The data object to be edited.
     * @param {String} store The IndexedDB store's name.
     */
    const editTransaction = async (transaction, store) => {
        if (!db) return;
        if (transaction.id === undefined) {
            console.error("Cannot edit transaction: ID is missing.", transaction);
            return;
        }
       const setter = getStoreSetter(store); 

        try {
            //Updates the corresponding IndexedDB store.
            await updateData(db, store, transaction);
            //Modifies object in array (the solid-js signal) using corresponding Setter.
            setter(prev =>
                prev.map(item => item.id === transaction.id ? transaction : item)
            );
        } catch (error) {
            console.error(`Failed to edit transaction with ID ${transaction.id}:`, error);
        }
    };

    const addTransactionTag = async (tag) => {
        if (!db) return;
        try {
            const newTag = await addDataKey(db, TAGS_STORE, tag);
            setTransactionTags(prev => [...prev, newTag]);
        } 
        catch (error) {console.error("Failed to add transaction:", error)}
    };

    const deleteTransactionTag = async (tag) => {
        if (!db) return;
        try {
            await deleteDataKey(db, TAGS_STORE, tag);
            setTransactionTags(prev => prev.filter(item => item === tag));
        } 
        catch (error) {console.error(`Failed to delete tag '${tag}':`, error);}
        
        //Remove tag from all transactions containing it
        for (const transaction of moneyOut()) {
            if (transaction.tag === tag) {
                const newTransaction = {
                    ...transaction,
                    tag: null
                };
                editTransaction(newTransaction, 'expense')
            }
        }
    }

    const editTransactionTag = async (oldTag, newTag) => {
        if (!db) return;
        //Add the new tag
        addTransactionTag(newTag);
        
        //Make this the new tag of all the transactions containing the old tag
        for (const transaction of moneyOut()) {
            if (transaction.tag === oldTag) {
                const newTransaction = {
                    ...transaction,
                    tag: newTag
                };
                editTransaction(newTransaction, 'expense')
            }
        }
        //Delete the old tag
        deleteTransactionTag(oldTag)
    }


    const store = {
        addTransaction,
        deleteTransaction,
        editTransaction,

        addTransactionTag,
        deleteTransactionTag,
        editTransactionTag,

        allowance, changeAllowance,
        savings, changeSavings,
        totalBudgetCost, setTotalBudgetCost,

        transactions,
        budgetExpenses,
        goals,

        transactionTags,
    };

    return (
        <MoneyContext.Provider value={store}>
            {props.children}
        </MoneyContext.Provider>
    );
}

export function useMoney() {
    return useContext(MoneyContext);
}