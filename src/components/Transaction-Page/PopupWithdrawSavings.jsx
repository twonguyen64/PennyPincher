import { createEffect } from 'solid-js';
import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'
 
import AccountDisplay from '../AccountDisplay';

export default function PopupWithdrawSavings() {
  let transactionNameRef, transactionAmountRef, blurRef;
  const { takeMoneyOut, savings} = useMoney();
  const { showPopup, setShowPopup } = useMainWrapperContext();
  
  createEffect(() => {
    if (showPopup() === 'withdrawSavings') {
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
    if (savings() - withdrawlAmount < 0) {
      alert(`Your can't withdraw more than you have. Try again.`)
      return
    }
    if (!isNaN(withdrawlAmount) && withdrawlAmount > 0) {
      const newTransaction = {
        name: transactionNameRef.value,
        amount: NaN,
        savings: withdrawlAmount,
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
    <Show when={showPopup() === 'withdrawSavings'}>
    <div id='background-blur-grid' ref={blurRef}></div>
    <div id='background-grid'>
      <div></div>
      <div class='fullscreen-popup-wrapper'>
        <div id='TransactionInput'>
          <h3>Withdraw money from savings</h3>
          <form onSubmit={handleSubmit} autocomplete="off">
            <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
            <div class='transactionField'>
              <label for="transactionName">Name for withdrawl</label>
              <input
                id="transactionName"
                type="text"
                ref={transactionNameRef}
              />
            </div>
            <div class='transactionField spaced'>
              <label for="transactionAmount">Amount:</label>
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

            <div class='transactionField spaced'>
              <button class='popup-button' onClick={handleCancel}>Cancel</button>
              <button class='popup-button' type="submit">Withdraw</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Show>
  );
}