import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Toolbar from '../components/Toolbar.tsx';
import MenuFilterTab from '../components/MenuFilterTab.tsx';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import ProfileInfo from '../components/ProfileInfo.tsx';
import Fuse from 'fuse.js';
import MenuSearchTab from '../components/MenuSearchTab.tsx';

export default function NewOrderPage(){
    const user_info = useLaunchParams().tgWebAppData?.user;
    const handleNFTSubmit = (e: any) => {
        e.preventDefault();
        setIsSubmitted(true);
        // fetch to server
        axios.post(`${process.env.API_URL}/new-order`, {
            user: user_info,
            user_id: user_info?.id,
            price: selectedPrice,
            nft_collection: selectedCollection,
            nft_models: selectedModel,
            nft_backdrops: selectedBackdrop,
            nft_symbols: selectedSymbol,
            payment_status: 'processing',
            order_status: 'processing payment'
        }).then((res: any) => {
            // здесь делаем редирект на invoice
            axios.post(`${process.env.API_URL}/payment-link`, {
                "amount": Number(selectedPrice),
                "numPayments": 1,
                "currency": "TONCOIN",
                "description": `Ордер номер: ${res.data._id.toString()}`,
                "commentsEnabled": false,
                "callbackUrl": `${process.env.API_URL}/payment-webhook`,
                "payload": `id: ${res.data._id.toString()}, tg_id: ${user_info?.id}`,
                "expiredIn": 3600
            }).then((res: any) => {
                setPaymentLink(res.data);
            });
        }).catch((err) => {
            // выводим ошибку
            console.log(err);
        });
    }
    const [ paymentLink, setPaymentLink ] = useState('');
    const [ isValidPrice, setIsValidPrice ] = useState(true);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const handlePriceChange = (e: any) => {
        const { name, value } = e.target;
        if(value.match(/^\d{1,8}(\.\d{1,3})?$/)){
            console.log(value)
            setPrice(Number(value));
            setIsValidPrice(true);
        } else{
            setIsValidPrice(false);
        }
    }

    interface collectionMetadata extends Object{
        nft_models: {
            [key: string]: string
        },
        nft_backdrops: {
            [key: string]: string
        },
        nft_symbols: {
            [key: string]: string
        }
    }

    // interface IFormInput {
    //     selectedCollection: string,
    //     selectedModel?: string,
    //     nft_backdselectedBackdroprops?: string,
    //     selectedSymbol?: string,
    //     selectedPrice: number
    // }

    // const { register, handleSubmit } = useForm<IFormInput>();

    const [ nft_collections, setCollections ] = useState([]);
    const [ selectedCollectionMetadata, setMetadata ] = useState({} as collectionMetadata);

    const [ fuseCollections, setFuseCollections ] = useState(nft_collections);
    const [ fuseModels, setFuseModels ] = useState(Object.keys(selectedCollectionMetadata?.nft_models || {}));
    const [ fuseBackdrops, setFuseBackdrops ] = useState(Object.keys(selectedCollectionMetadata?.nft_backdrops || {}));
    const [ fuseSymbols, setFuseSymbols ] = useState(Object.keys(selectedCollectionMetadata?.nft_symbols || {}));
    useEffect(() => {
        setFuseCollections(nft_collections);
        setFuseModels(Object.keys(selectedCollectionMetadata?.nft_models || {}));
        setFuseBackdrops(Object.keys(selectedCollectionMetadata?.nft_backdrops || {}));
        setFuseSymbols(Object.keys(selectedCollectionMetadata?.nft_symbols || {}));
    }, [nft_collections, selectedCollectionMetadata])
    const [ selectedCollection, setCollection ] = useState('' as string);
    const [ selectedModel, setModel ] = useState([] as string[]);
    const [ selectedBackdrop, setBackdrop ] = useState([] as string[]);
    const [ selectedSymbol, setSymbol ] = useState([] as string[]);
    const [ selectedPrice, setPrice ] = useState(0);

    const fuse = new Fuse(nft_collections, {
        includeScore: true
    });

    useEffect(() => {
        if(selectedCollection !== ''){
            axios.get(`http://localhost:8000/collections/${selectedCollection}`).then((req) => {
                setMetadata(req.data as collectionMetadata);
            })
        }
    }, [selectedCollection]);
    useEffect(() => {
        axios.get(`http://localhost:8000/collections`).then((res) => {
            console.log(res.data);
            setCollections(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    useEffect(() => {

    }, [isSubmitted]);
    return (
        <form onSubmit={handleNFTSubmit}>
            { paymentLink != '' ? 
            <div className=''>
                
                <div className='absolute overflow-x-hidden h-[calc(100*var(--i-vh))] w-[calc(100*var(--i-vw))] bg-dark-bg'>
                </div>
                <div className='flex flex-col items-center absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[calc(6*var(--i-vw))] py-[calc(2*var(--i-vh))] rounded-[16px] bg-btn-bg font-baloo font-medium'>
                    <div className='flex justify-end w-[100%]' onClick={() => { setPaymentLink('') }}>
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
            </div> : <></> }

            
            <div className='overflow-x-hidden h-[calc(100*var(--i-vh))] bg-dark-bg'>
                <ProfileInfo />
                <div className='w-[calc(100*var(--i-vw))] flex justify-between pl-[calc(7*var(--i-vw))] pr-[calc(7*var(--i-vw))] pt-[calc(2*var(--i-vh))]'>
                    <div className='text-3xl text-text-main font-baloo font-bold'>New order</div>
                    <button className='pr-[calc(3*var(--i-vw))] pl-[calc(3*var(--i-vw))] rounded-[16px] bg-btn-contr text-lg text-text-main font-baloo font-medium' type='submit'>Submit</button>
                </div>

                <div className='mt-[calc(2*var(--i-vh))] ml-[calc(7*var(--i-vw))] font-baloo font-medium text-text-main text-2xl'>
                    Price
                </div>

                <div className='flex items-center mt-[calc(2*var(--i-vh))] ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))] pl-[calc(2*var(--i-vw))] pt-[calc(1*var(--i-vh))] pb-[calc(1*var(--i-vh))] rounded-[16px] bg-btn-bg'>
                    <svg className='w-[calc(7*var(--i-vw))] h-[calc(7*var(--i-vw))] mr-[calc(4*var(--i-vw))]' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
                        <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
                    </svg>
                    <div className='flex flex-col justify-items-end'>
                        <input type='nubmer' className='focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none active:outline-none active:ring-0 active:border-transparent appearance-none font-baloo text-text-main text-lg' placeholder='Price in TON' onChange={handlePriceChange}/>
                        { isValidPrice ? <></> : 
                            <div className='pl-[calc(7*var(--i-vw))] font-baloo text-[#7A7F84] text-base'>
                                {`Enter number 0 - 99'999'999 TONs`}
                            </div>
                        }
                    </div>
                </div>

                <div className='flex justify-between mt-[calc(2*var(--i-vh))] ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))] font-baloo font-medium'>
                    <div className='text-text-main text-2xl'>
                        NFT Filter
                    </div>
                    { !selectedCollection ? <div className='flex items-center text-btn-contr text-sm'>
                        <svg className='w-[calc(5*var(--i-vw))] h-[calc(5*var(--i-vw))]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fill="#0098EA" fill-rule="evenodd" d="M11.326 10.222a4 4 0 1 0-6.653-4.444a4 4 0 0 0 6.653 4.444M8.65 10H7.4v1h1.25zM7.4 9V5h1.25v4z" clip-rule="evenodd"/>
                        </svg>
                        Collection not selected
                    </div> : <></> }
                </div>
                

                <div className='ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))] mt-[calc(2*var(--i-vh))]'>
                    <div onClick={(e) => {  
                        if(e.currentTarget.classList.contains('border-b-[2px]')){
                            e.currentTarget.classList.remove('border-b-[2px]')
                        } else{
                            e.currentTarget.classList.add('border-b-[2px]')
                        }

                        const siblingDiv = e.currentTarget.nextElementSibling;
                        siblingDiv?.classList.contains('hidden') ? siblingDiv?.classList.remove('hidden') : siblingDiv?.classList.add('hidden')
                    }} className='pl-[calc(7*var(--i-vw))] pt-[calc(1.5*var(--i-vw))] pb-[calc(1.5*var(--i-vw))] bg-btn-bg rounded-t-[16px] border-b-stroke text-lg text-text-main font-baloo font-medium'>Collections</div>
                    <div key='collection-tab' className='max-h-[calc(50*var(--i-vh))] overflow-y-scroll overflow-x-hidden'>
                        <div className='flex items-center pl-[calc(2*var(--i-vw))] pt-[calc(1*var(--i-vh))] pb-[calc(1*var(--i-vh))] bg-btn-slct'>
                            <div className='flex flex-col justify-items-end'>
                                <MenuSearchTab fuse={fuse} initialList={nft_collections as string[]} setFuseList={setFuseCollections} />
                            </div>
                        </div>
                        {fuseCollections.map((collection: any) => {
                            return(
                                <MenuFilterTab name={collection} svgPath='' selectedItem={selectedCollection} setItem={(name: string) => {
                                    setCollection(name);
                                    setModel([]);
                                    setBackdrop([]);
                                    setSymbol([]);
                                }} />
                            )
                        })}
                    </div>
                </div>


                
                <>
                    <div className='ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))]'>
                        <div onClick={(e) => {
                            if(e.currentTarget.classList.contains('border-b-[2px]')){
                                e.currentTarget.classList.remove('border-b-[2px]')
                            } else{
                                e.currentTarget.classList.add('border-b-[2px]')
                            }

                            const siblingDiv = e.currentTarget.nextElementSibling;
                            siblingDiv?.classList.contains('hidden') ? siblingDiv?.classList.remove('hidden') : siblingDiv?.classList.add('hidden')
                        }} className='pl-[calc(7*var(--i-vw))] pt-[calc(1.5*var(--i-vw))] pb-[calc(1.5*var(--i-vw))] bg-btn-bg border-b-stroke border-b-[2px] text-lg text-text-main font-baloo font-medium'>Models</div>

                        { Object.keys(selectedCollectionMetadata).length > 0 ?  <div key='model-tab' className='hidden max-h-[calc(50*var(--i-vh))] overflow-y-scroll overflow-x-hidden'>
                            {Object.keys(selectedCollectionMetadata.nft_models!).map((model: string) => {
                                const svgPath: string = selectedCollectionMetadata.nft_models[model as keyof Object] || '';
                                return(
                                    <MenuFilterTab name={model} svgPath={svgPath} selectedItem={selectedModel} setItem={() => {
                                        if(selectedModel.includes(model)){
                                            setModel(selectedModel.toSpliced(selectedModel.indexOf(model), 1));
                                        } else{
                                            setModel([...selectedModel, model]);
                                        }
                                    }}/> 
                                )
                            })}
                        </div> : <></> }
                    </div>


                    <div className='ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))]'>
                        <div onClick={(e) => {
                            if(e.currentTarget.classList.contains('border-b-[2px]')){
                                e.currentTarget.classList.remove('border-b-[2px]')
                            } else{
                                e.currentTarget.classList.add('border-b-[2px]')
                            }

                            const siblingDiv = e.currentTarget.nextElementSibling;
                            siblingDiv?.classList.contains('hidden') ? siblingDiv?.classList.remove('hidden') : siblingDiv?.classList.add('hidden')
                        }} className='pl-[calc(7*var(--i-vw))] pt-[calc(1.5*var(--i-vw))] pb-[calc(1.5*var(--i-vw))] bg-btn-bg border-b-stroke border-b-[2px] text-lg text-text-main font-baloo font-medium'>Backdrops</div>

                        { Object.keys(selectedCollectionMetadata).length > 0 ? <div key='backdrop-tab' className='hidden max-h-[calc(50*var(--i-vh))] overflow-y-scroll overflow-x-hidden'>
                            {Object.keys(selectedCollectionMetadata.nft_backdrops!).map((model: string) => {
                                const svgPath: string = selectedCollectionMetadata.nft_backdrops[model as keyof Object] || '';
                                return(
                                    <MenuFilterTab name={model} svgPath={svgPath} selectedItem={selectedBackdrop} setItem={() => {
                                        if(selectedBackdrop.includes(model)){
                                            setBackdrop(selectedBackdrop.toSpliced(selectedBackdrop.indexOf(model), 1));
                                        } else{
                                            setBackdrop([...selectedBackdrop, model]);
                                        }
                                    }}/> 
                                )
                            })}
                        </div> : <></> }
                    </div>

                            
                    <div className='ml-[calc(7*var(--i-vw))] mr-[calc(7*var(--i-vw))] mb-[calc(2*var(--i-vh))]'>
                        <div onClick={(e) => {
                            if(e.currentTarget.classList.contains('rounded-b-[16px]')){
                                e.currentTarget.classList.remove('rounded-b-[16px]')
                                // e.currentTarget.classList.remove('border-b-[2px]')
                            } else{
                                // e.currentTarget.classList.add('border-b-[2px]')
                                e.currentTarget.classList.add('rounded-b-[16px]')
                            }

                            const siblingDiv = e.currentTarget.nextElementSibling;
                            siblingDiv?.classList.contains('hidden') ? siblingDiv?.classList.remove('hidden') : siblingDiv?.classList.add('hidden')
                        }} className='pl-[calc(7*var(--i-vw))] pt-[calc(1.5*var(--i-vw))] pb-[calc(1.5*var(--i-vw))] bg-btn-bg rounded-b-[16px] text-lg text-text-main font-baloo font-medium'>Symbols</div>

                        { Object.keys(selectedCollectionMetadata).length > 0 ? <div key='model-tab' className='hidden max-h-[calc(50*var(--i-vh))] rounded-b-[16px] overflow-y-scroll overflow-x-hidden'>
                            {Object.keys(selectedCollectionMetadata.nft_symbols!).map((model: string) => {
                                const svgPath: string = selectedCollectionMetadata.nft_symbols[model as keyof Object] || '';
                                return(
                                    <MenuFilterTab name={model} svgPath={svgPath} selectedItem={selectedSymbol} setItem={() => {
                                        if(selectedSymbol.includes(model)){
                                            setSymbol(selectedSymbol.toSpliced(selectedSymbol.indexOf(model), 1));
                                        } else{
                                            setSymbol([...selectedSymbol, model]);
                                        }
                                    }}/> 
                                )
                            })}
                        </div> : <></> }
                    </div>
                </>
                <div className='h-[calc(22*var(--i-vh))]'>

                </div>
                <Toolbar />
            </div>
        </form>
    )
}