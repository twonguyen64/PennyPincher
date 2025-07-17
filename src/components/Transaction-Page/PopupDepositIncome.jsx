import { createEffect } from 'solid-js';
import { useMoney } from '../../contexts/MoneyContext';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

export default function PopupDepositIncome() {
  let transactionNameRef, transactionAmountRef, savingsPercentageRef, savingsContributionRef, blurRef;
  const { addMoneyIn } = useMoney();
  const { showPopup, setShowPopup } = useMainWrapperContext();
  
  createEffect(() => {
    if (showPopup() === 'depositIncome') {
      if (transactionAmountRef) transactionAmountRef.focus();
      if (blurRef) blurRef.classList.add('blur');
    } 
    else {
      if (transactionNameRef) transactionNameRef.value = '';
      if (transactionAmountRef) transactionAmountRef.value = '';
    }
  });
  const radioButtHandler = () => {
    console.log('sdsd')
    for (const radio of document.querySelectorAll('input[name="savingsMethod"]')) {
      if (radio.checked) radio.nextSibling.classList.remove('no-pointer-events')
      else radio.nextSibling.classList.add('no-pointer-events')
    }
  }
  const handleCancel = () => {
    transactionNameRef.value = ''
    transactionAmountRef.value = ''
    savingsContributionRef.value = ''
    setShowPopup('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const depositValue = parseInt(transactionAmountRef.value);
    const todaysDate = new Date().toISOString().split('T')[0]
    
    let savingsValue;
    const radio = document.querySelector('input[name="savingsMethod"]:checked')
    if (radio.nextSibling.contains(savingsContributionRef)) 
      savingsValue = savingsContributionRef.value
    else savingsValue = (savingsPercentageRef.value*100 / 10000) * depositValue

    const savingsAmount = parseInt(savingsValue);
    if (savingsAmount > depositValue) {alert('Please enter valid amount of $$$.'); return}

    if (!isNaN(depositValue) && depositValue > 0) {
      const newTransaction = {
        type: 'income',
        name: transactionNameRef.value,
        amount: depositValue,
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
    <Show when={showPopup() === 'depositIncome'}>
    <div id='background-blur-grid' ref={blurRef}></div>
    <div id='background-grid'>
      <div></div>
      <div class='fullscreen-popup-wrapper'>
        <div id='TransactionInput'>
          <h3>Income Entry</h3>
          <form onSubmit={handleSubmit} autocomplete="off">
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
              <div>
                <span>$</span>
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
              <label>Amount to deposit for savings:</label>
              <div class='transactionInput' id='savingsOptions'>
                  <div>
                    <input type="radio" name="savingsMethod" onClick={radioButtHandler}/>
                    <span>
                      <input id="savingsPercentage" type="number" ref={savingsPercentageRef}/>
                      <span>%</span>
                    </span>
                  </div>
                  <div>
                    <input type="radio" name="savingsMethod" onClick={radioButtHandler}/>
                    <span>
                      <span>$</span>
                      <input id="savingsContribution" type="number" ref={savingsContributionRef}/>
                    </span>
                  </div>
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