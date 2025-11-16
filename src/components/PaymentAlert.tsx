import React from 'react';

interface PaymentAlertProps{
    setIsOpen: ((arg: boolean) => void);
    paymentLink: string;
    isOpen: boolean;
}

export const PaymentAlert: React.FC<PaymentAlertProps> = ({ setIsOpen, paymentLink, isOpen }) => {
    console.log(isOpen)
    return (
        <div className=''>
            <div className=''>
            </div>
            <div className='flex flex-col items-center absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[calc(6*var(--i-vw))] py-[calc(2*var(--i-vh))] rounded-[16px] bg-btn-bg font-baloo font-medium'>
                <div className='flex justify-end w-[100%]' onClick={() => { setIsOpen(!isOpen) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-[calc(5*var(--i-vw))] w-[calc(5*var(--i-vw))]' viewBox="0 0 16 16"><title>Chrome-close SVG Icon</title><path fill="#ffffff" fillRule="evenodd" d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z" clipRule="evenodd"></path></svg>
                </div>
                <div className='text-text-main text-center m-auto'>Your order is submitted!</div>
                <div className='flex flex-col items-center'>
                    <div className='text-text-main'>Now pay the invoice in</div>
                    <div className='flex items-center text-btn-contr'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-[calc(5*var(--i-vw))] w-[calc(5*var(--i-vw))]' viewBox="0 0 16 16"><title>Link SVG Icon</title><path fill="#0098ea" fillRule="evenodd" d="M4.4 3h3.085a3.4 3.4 0 0 1 3.4 3.4v.205A3.4 3.4 0 0 1 7.485 10H7V9h.485A2.4 2.4 0 0 0 9.88 6.61V6.4A2.4 2.4 0 0 0 7.49 4H4.4A2.4 2.4 0 0 0 2 6.4v.205A2.394 2.394 0 0 0 4 8.96v1a3.4 3.4 0 0 1-3-3.35V6.4A3.405 3.405 0 0 1 4.4 3M12 7.04v-1a3.4 3.4 0 0 1 3 3.36v.205A3.405 3.405 0 0 1 11.605 13h-3.09A3.4 3.4 0 0 1 5.12 9.61V9.4A3.4 3.4 0 0 1 8.515 6H9v1h-.485A2.4 2.4 0 0 0 6.12 9.4v.205A2.4 2.4 0 0 0 8.515 12h3.09A2.4 2.4 0 0 0 14 9.61V9.4a2.394 2.394 0 0 0-2-2.36" clipRule="evenodd"></path></svg> 
                        <a className='appearance-none' href={paymentLink}>{`xRocket Bot`}</a>
                    </div>
                    <div className='text-text-main'>to proceed</div>
                </div>
            </div>
        </div>
    )
}