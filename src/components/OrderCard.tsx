import { useNavigate } from "react-router";
import IOrderDto from "../dto/orderDto.ts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface OrderCardProps{
    order_info: IOrderDto
}

const OrderCard: React.FC<OrderCardProps> = ({ order_info }) => {
    const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
        'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'payment processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    

    const orderInfo: IOrderDto = order_info as IOrderDto;
    orderInfo.nft_models = orderInfo.nft_models ? orderInfo.nft_models : {};
    // const navigate = useNavigate();
    const orderId = orderInfo._id.toString().slice(0,9) + '...';
    return (
        <div className='flex flex-col items-center justify-center w-[100%] bg-btn-slct rounded-[16px] border-[1vw] border-btn-slct font-baloo'>
            <div className='position-relative'>
            </div>
            <div className='w-[100%] rounded-[16px] p-[calc(2*var(--i-vw))] mb-0 bg-[url("https://xgift.tg/assets/light-collection-background-CF8W2HWx.svg")] bg-blend-difference'>
                <div className='flex flex-col items-start'>
                    <div className='font-baloo text-xl text-text-main font-semibold'>
                        {`${orderInfo.nft_collection}`}
                    </div>
                    <div className='flex items-center w-[100%] font-baloo text-xs text-text-arb'>
                        <div className='font-light mr-auto'>
                            {`#${orderId}`}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    {/* { Object.keys(orderInfo.nft_models).length >= 2 ? 
                        <div className='grid grid-cols-2 items-center h-[calc(15*var(--i-vh))] overflow-y-scroll scroll-hidden fade-overflow-both px-[calc(0*var(--i-vh))] my-[calc(2*var(--i-vh))]'>
                            {
                                Object.keys(orderInfo.nft_models).map((key) => {
                                    const model_svg = orderInfo.nft_models[key];
                                    return(
                                        <div className='shrink-0'>
                                            <img alt='' className='w-[calc(15*var(--i-vw))] h-[calc(15*var(--i-vw))]' src={'https://fragment.com/' + model_svg}/>
                                        </div>
                                    )
                                })
                            }
                        </div> : 
                        <div className='h-[calc(15*var(--i-vh))] overflow-y-scroll scroll-hidden fade-overflow-both px-[calc(0*var(--i-vh))] my-[calc(2*var(--i-vh))]'>
                            <div className='my-auto shrink-0'>
                                <img alt='' className='w-[calc(25*var(--i-vw))] h-[calc(25*var(--i-vw))]' src={'https://fragment.com/' + orderInfo.nft_models[Object.keys(orderInfo.nft_models)[0]]}/>
                            </div>  
                        </div> 
                    } */}
                    <Carousel className='h-[calc(15*var(--i-vh))] w-[calc(15*var(--i-vh))]'>
                        <CarouselContent className="mx-auto">
                            {
                                Object.keys(orderInfo.nft_models).map((key) => {
                                        const model_svg = orderInfo.nft_models[key];
                                        return(
                                            <CarouselItem className="">
                                                <div className=''>
                                                    <img alt='' className='w-[calc(25*var(--i-vw))] h-[calc(25*var(--i-vw))]' src={'https://fragment.com/' + model_svg}/>
                                                </div>
                                            </CarouselItem>
                                        )
                                    })
                            }
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
            
            <div className='p-[calc(1*var(--i-vw))] grid gap-1 w-[100%] bg-btn-slct rounded-b-[16px] font-baloo text-sm font-normal text-text-main'>
                <div className='flex items-center justify-between w-[100%]'>
                    <div className='text-text-arb'>
                        Status
                    </div>
                    <div>
                        <Badge className={`${getStatusColor(orderInfo.order_status)} text-text-main border`}>
                            {orderInfo.order_status}
                        </Badge>
                    </div>
                </div>
                <div className='flex items-center justify-between w-[100%]'>
                    <div className='text-text-arb'>
                        Your price
                    </div>
                    <div className='flex justify-center'>
                        {`${orderInfo.price}`}
                        <svg className='w-[calc(4*var(--i-vw))] h-[calc(4*var(--i-vw))] ml-[calc(1*var(--i-vw))]' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
                            <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                <div className='flex items-center justify-between w-[100%]'>
                    <div className='text-text-arb'>
                        Floor
                    </div>
                    <div className='flex justify-center'>
                        {`${orderInfo.floor?.toFixed(2)}`}
                        <svg className='w-[calc(4*var(--i-vw))] h-[calc(4*var(--i-vw))] ml-[calc(1*var(--i-vw))]' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
                            <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                {/* <button onClick={() => navigate(`/my-orders/${orderInfo._id.toString()}`)} className='px-[calc(2*var(--i-vw))] py-[calc(0.5*var(--i-vh))] mt-[calc(2*var(--i-vh))] rounded-[16px] bg-btn-contr text-xl text-text-main font-baloo font-medium' type='submit'>Inspect</button> */}
            </div>
        </div>
    )
}

export default OrderCard;