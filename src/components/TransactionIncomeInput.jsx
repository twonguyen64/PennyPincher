import { createEffect } from 'solid-js';
import { useMoney } from '../contexts/MoneyContext';
import { useMainWrapperContext } from '../contexts/MainWrapperContext'
import { dateToStr } from '../helperFunctions';

export default function TransactionIncomeInput() {
  let transactionNameRef, transactionAmountRef, savingsPercentageRef, savingsContributionRef, blurRef;
  const { addMoneyIn } = useMoney();
  const { showPopup, setShowPopup } = useMainWrapperContext();
  
  createEffect(() => {
    if (showPopup()) {
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
    savingsContributionRef = ''
    setShowPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const depositValue = parseInt(transactionAmountRef.value);
    const todaysDate = new Date().toISOString().split('T')[0]
    const savingsAmount = parseInt(savingsContributionRef.value);
    if (savingsAmount > depositValue) {alert('Please enter valid amount of $$$.'); return}

    if (!isNaN(depositValue) && depositValue > 0) {
      const newTransaction = {
        type: 'income',
        name: transactionNameRef.value,
        amount: depositValue,
        savings: savingsAmount,
        date: dateToStr(todaysDate),
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
    <Show when={showPopup()}>
    <div id='background-blur-grid' ref={blurRef}></div>
    <div id='background-grid'>
      <div></div>
      <div class='fullscreen-popup-wrapper'>
        <div id='TransactionInput'>
          <h4>Income Entry</h4>
          <form onSubmit={handleSubmit}>
            <div class='transactionField'>
              <label for="transactionName">Name for deposit</label>
              <input
                id="transactionName"
                type="text"
                ref={transactionNameRef}
              />
            </div>
            <div class='transactionField amount'>
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

            <div class='transactionField'>
              <label>Amount to set aside for savings:</label>
              <div id='savingsOptions'>
                  <span>
                    <input id="savingsPercentage" type="number" value ref={savingsPercentageRef}/>
                    <span>%</span>
                  </span>
                  <span>OR</span>
                  <span>
                    <span>$</span>
                    <input id="savingsContribution" type="number" ref={savingsContributionRef}/>
                  </span>
              </div>
            </div>

            <div class='transactionField amount'>
              <button onClick={handleCancel}>Cancel</button>
              <button type="submit">Add Deposit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Show>
  );
}