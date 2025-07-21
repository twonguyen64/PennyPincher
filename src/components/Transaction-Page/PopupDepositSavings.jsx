import { createEffect } from 'solid-js';
import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

import AccountDisplay from '../AccountDisplay';

export default function PopupDepositSavings() {
  let transactionNameRef, savingsContributionRef, blurRef;
  const { addMoneyIn, allowance, savings } = useMoney();
  const { showPopup, setShowPopup } = useMainWrapperContext();
  
  createEffect(() => {
    if (showPopup() === 'depositSavings') {
      if (savingsContributionRef) savingsContributionRef.focus();
      if (blurRef) blurRef.classList.add('blur');
    } 
    else {
      if (transactionNameRef) transactionNameRef.value = '';
      if (savingsContributionRef) savingsContributionRef.value = '';
    }
  });

  const handleCancel = () => {
    transactionNameRef.value = ''
    savingsContributionRef.value = ''
    setShowPopup('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const todaysDate = new Date().toISOString().split('T')[0]
    const savingsAmount = parseInt(savingsContributionRef.value);
    if (savingsAmount > allowance()) 
        {alert(`You don't have enough allowance to deposit that much`); return}

    if (!isNaN(savingsAmount) && savingsAmount > 0) {
      const newTransaction = {
        name: transactionNameRef.value,
        amount: NaN,
        savings: savingsAmount,
        date: todaysDate,
      };
      addMoneyIn(newTransaction)
      
      //Clear inputs
      handleCancel();
    }
    else {
      alert('Please enter valid amount of $$$.');
    }
  };

  return (
    <Show when={showPopup() === 'depositSavings'}>
    <div id='background-blur-grid' ref={blurRef}></div>
    <div id='background-grid'>
      <div></div>
      <div class='fullscreen-popup-wrapper'>
        <div id='TransactionInput'>
          <h3>Transfer allowance into savings</h3>
          <form onSubmit={handleSubmit} autocomplete="off">
            <div>
              <AccountDisplay colorFor='allowance' name="Allowance" balance={allowance()}/>
              <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
            </div>
            <div class='transactionField'>
              <label for="transactionName">Name / tag</label>
              <input
                id="transactionName"
                type="text"
                ref={transactionNameRef}
              />
            </div>

            <div class='transactionField'>
              <label>Amount to deposit into savings:</label>
              <div id='savingsOptions'>
                  <div>
                    <span>$</span>
                    <input id="savingsContribution" 
                    type="number"
                    placeholder="0"
                    ref={savingsContributionRef}
                    required
                    />
                  </div>
              </div>
            </div>

            <div class='transactionField spaced'>
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