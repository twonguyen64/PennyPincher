import { createMemo } from "solid-js"
import { useMoney } from "../../contexts/MoneyContext"
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { usePageColumnScrolling } from "../../utils/PageColumnScrolling"

import { generatePaymentPlan } from "../../utils/util-functions";

import paymentPlanIcon from '../../assets/payment-plan.svg'

export default function PaymentPlan(props) {

    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToRight } = usePageColumnScrolling(
        () => document.getElementById('Savingspage'), 
        () => pageIndex().savings, 
        pageIndexSetter.savings
    );
    const { payFreq } = useMoney();
    
    const plan = createMemo(() => {
        const plan = generatePaymentPlan(props.goal, payFreq())
        return plan
    });
    const percentage = (props.goal.balance / props.goal.target) * 100
    const chainNodes = Array.from({ length: plan().numberOfPayments}, () => (
        <div class='PaymentPlan-chain-node-wrapper'>
            <div class='PaymentPlan-chain-node'></div>
        </div>
    ));

    return (
        <>
        <div class="PaymentPlan-viewSummary-wrapper">
            <div class='borderless-button' onClick={slideToRight}>
                <img src={paymentPlanIcon}/>
                View timeline ▶
            </div>
        </div>
        <div class="PaymentPlan">
            <div class="PaymentPlan-payment">
                <span>{plan().freqStr} installments of</span>
                <span class="PaymentPlan-payment-value">${plan().paymentAmount}</span>
                </div>
            <div class="PaymentPlan-chain">
                <span 
                    class="PaymentPlan-chain-startingBalance" 
                    style={`width: ${percentage}%`}>
                </span>
                <span 
                    class="PaymentPlan-chain-currentBalance" 
                    style={`width: ${percentage}%`}>
                </span>
                <span class="PaymentPlan-chain-remainder">
                    <div class='PaymentPlan-chain-node-wrapper'>
                        <div class='PaymentPlan-chain-node paid'></div>
                    </div>
                    {chainNodes}
                </span>
            </div>
            <div class="PaymentPlan-numberOfPayments">
                {plan().numberOfPayments} payments left
            </div>
        </div>
        </>
    )
}