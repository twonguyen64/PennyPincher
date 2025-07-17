import { createEffect } from 'solid-js';
import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

import AccountDisplay from '../AccountDisplay';

export default function PopupWithdrawExpense() {
  let transactionNameRef, transactionAmountRef, blurRef;
  const { takeMoneyOut, allowance, savings} = useMoney();
  const { showPopup, setShowPopup } = useMainWrapperContext();
  
  createEffect(() => {
    if (showPopup() === 'withdrawExpense') {
      if (transactionAmountRef) transactionAmountRef.focus();
      if (blurRef) blurRef.classList.add('blur');
    } 
    else {
      if (transactionNameRef) transactionNameRef.value = '';
      if (transactionAmountRef) transactionAmountRef.value = '';
    }
  });

  const handleCancel = () => {
    transactionNameRef.value = ''
    transactionAmountRef.value = ''
    setShowPopup('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const withdrawlAmount = parseInt(transactionAmountRef.value);
    const todaysDate = new Date().toISOString().split('T')[0]
    
    //MAKE USER CHOOSE WHETHER THEY WANT TO WITHDRAW FROM SAVINGS TOO, OR NOT. OTHERWISE ALLOWANCE WILL BE NEGATIVE
    const savingsAmount = (allowance() < withdrawlAmount) ? (Math.abs(allowance() - withdrawlAmount)) : 0
    if (savings() - savingsAmount < 0) {
      alert(`Your can't withdraw that much. There's $${savings()} left in your account. Try again.`)
      return
    }
    if (!isNaN(withdrawlAmount) && withdrawlAmount > 0) {
      const newTransaction = {
        type: 'expense',
        name: transactionNameRef.value,
        amount: withdrawlAmount,
        savings: savingsAmount,
        date: todaysDate,
      };
      takeMoneyOut(newTransaction)
      
      //Clear inputs
      handleCancel();
    }
    else {
      alert('Please enter valid amount of $$$.');
    }
  };

  return (
    <Show when={showPopup() === 'withdrawExpense'}>
    <div id='background-blur-grid' ref={blurRef}></div>
    <div id='background-grid'>
      <div></div>
      <div class='fullscreen-popup-wrapper'>
        <div id='TransactionInput'>
          <h3>Expense Entry</h3>
          <form onSubmit={handleSubmit} autocomplete="off">
            <AccountDisplay colorFor="allowance" name="Allowance" balance={allowance()}/>
            <div class='transactionField'>
              <label for="transactionName">Name for expense</label>
              <input
                id="transactionName"
                type="text"
                ref={transactionNameRef}
              />
            </div>
            <div class='transactionField amount'>
              <label for="transactionAmount">Amount to withdrawl</label>
              <div style={'display: flex; justify-content: flex-end; align-items: center;'}>
                <div>$</div>
                <input
                id="transactionAmount"
                type="number"
                placeholder="0"
                ref={transactionAmountRef}
                required
                />
              </div>
            </div>

            <div class='transactionField amount'>
              <button class='popup-button' onClick={handleCancel}>Cancel</button>
              <button class='popup-button' type="submit">Add Deposit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Show>
  );
}