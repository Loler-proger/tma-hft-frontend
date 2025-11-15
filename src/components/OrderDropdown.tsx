// components/OrderDropdown.tsx
import React, { useState, useRef, useMemo, ReactElement } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import IOrderDto from '../dto/orderDto';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import { PaymentAlert } from './PaymentAlert';

interface OrderDropdownProps {
  order: IOrderDto;
  children: ReactElement;
}

export const OrderDropdown: React.FC<OrderDropdownProps> = ({ order, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPayment, setIsOpenPayment] = useState(false);

  // Проверка возможности открытия
  const canOpen = useMemo(() => {
    return order.payment_status !== 'cancelled';
  }, [order.payment_status]);

  const [{ y, opacity }, api] = useSpring(() => ({ 
    y: 0, 
    opacity: 1 
  }))

  const isDragging = useRef(false)
  const startY = useRef(0)
  const threshold = 30;

  const handleStart = (clientY: number) => {
    isDragging.current = true
    startY.current = clientY
  }

  const handleMove = (clientY: number) => {
    if (!isDragging.current) return
    
    const diff = clientY - startY.current
    
    // Разрешаем только положительные значения (движение вниз)
    if (diff > 0) {
      // Добавляем сопротивление для более естественного ощущения
      const resistance = 1 - Math.min(diff / 500, 0.3)
      api.start({ 
        y: diff * resistance,
        opacity: 1 - Math.min(diff / 200, 0.5)
      })
    }
  }

  const handleEnd = () => {
    if (!isDragging.current) return
    
    const currentY = y.get();

    if (currentY > threshold) {
      // Анимация успешного свайпа
      api.start({
        y: 300,
        opacity: 0,
        onRest: () => {setIsOpen(false)}
      })
    } else {
      // Возврат на место
      api.start({
        y: 0,
        opacity: 1
      })
    }
    
    isDragging.current = false
  }

  const bind = {
    onTouchStart: (e: React.TouchEvent) => handleStart(e.touches[0].clientY),
    onTouchMove: (e: React.TouchEvent) => handleMove(e.touches[0].clientY),
    onTouchEnd: handleEnd,
  }


  // Подготовка данных для графика
  // const chartData = useMemo(() => {
  //   return Object.entries(order.floor_history)
  //     .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
  //     .map(([date, price]) => ({
  //       date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  //       fullDate: date,
  //       price: price,
  //     }));
  // }, [order.floor_history]);
  const chartData = useMemo(() => {
    return order.floor_history.sort((elemA,elemB) => {
      if(elemA.date > elemB.date){
        return 1;
      } else{
        return -1;
      }
    }).map((date_floor) => {
      return {
        date: new Date(date_floor.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: date_floor.floor,
        threshold: order.price
      }
    })
  }, [order.floor_history])

  // Расчет минимальной цены и процентных изменений
  const analytics = useMemo(() => {
    const prices = order.floor_history.map((elem) => { return elem.floor });
    const minPrice = Math.min(...prices);
    const latestPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    
    const priceChange = previousPrice 
      ? ((latestPrice - previousPrice) / previousPrice) * 100 
      : 0;

    return {
      minPrice: minPrice || 0,
      currentPrice: latestPrice || 0,
      priceChange: priceChange || 0,
      isPriceDown: priceChange < 0,
    };
  }, [order.floor_history]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'payment processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const handleOpenChange = () => {
    console.log(order.order_status);
    if(order.order_status == 'processing payment'){
      axios.post('http://localhost:8000/payment-link', {
        "amount": Number(order.price),
        "numPayments": 1,
        "currency": "TONCOIN",
        "description": `Ордер номер: ${order._id.toString()}`,
        "commentsEnabled": false,
        "callbackUrl": 'http://localhost:8000/payment-webhook',
        "payload": `id: ${order._id.toString()}, user_id: ${order.user_id}`,
        "expiredIn": 3600
      }).then((res: any) => {
        console.log(res.data);
        setPaymentLink(res.data);
      });
      setIsOpenPayment(!isOpenPayment)
    } else{
      setIsOpen(!isOpen);
    }
  }

  const [ paymentLink, setPaymentLink ] = useState('');

  return (
    
      <Card className={`py-0 px-0 items-center bg-transparent border-0 shadow-none ${!canOpen ? 'opacity-50 cursor-not-allowed' : ''}`}>

        <Collapsible open={isOpenPayment} className='absolute z-50 left-1/2 -translate-x-1/2 translate-y-1/2 bottom-1/2'>
          <CollapsibleContent className='w-[calc(100*var(--i-vw))] h-[calc(80*var(--i-vh))] rounded-t-[16px] bg-transparent'>
            <PaymentAlert setIsOpen={setIsOpenPayment} isOpen={isOpenPayment} paymentLink={paymentLink} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className='w-[100%]' open={isOpen} onOpenChange={canOpen ? handleOpenChange : undefined}>
          <CollapsibleTrigger className='flex flex-col items-center justify-center w-[100%] border-0 bg-transparent block'>
            {children}
          </CollapsibleTrigger>
          <animated.div style={{
            y,
            opacity,
            touchAction: 'pan-y' // Разрешаем горизонтальную прокрутку, но не вертикальную
          }}
          className="touch-pan-y absolute z-50 left-1/2 -translate-x-1/2 bottom-0">
            <CollapsibleContent className='w-[calc(100*var(--i-vw))] rounded-t-[16px] bg-btn-bg'>
              <div {...bind} className='flex flex-col items-center w-[100%] text-text-main py-[calc(2*var(--i-vh))]'>
                <div className='w-[calc(15*var(--i-vw))] h-[calc(0.8*var(--i-vh))] bg-btn-slct rounded-xl'>

                </div>
              </div>
              <div className='overflow-y-scroll h-min'>
                <div className="p-4 pb-0 pt-0 space-y-6">
                  <div className='text-xl font-medium text-text-main'>
                    {`Order #${order._id.toString().slice(0,16) + '...'}`}
                  </div>
                  {/*Model images*/}
                  { Object.keys(order?.nft_models).length > 0 ? <Carousel className='w-min'>
                    <CarouselContent>
                      {
                        Object.keys(order.nft_models).map((key, index) => {
                          const model_svg = order.nft_models[key];
                          return (
                            <CarouselItem key={index}>
                              <Card className='bg-menu-tab'>
                                <CardContent className='px-0 flex flex-col items-center'>
                                  <img className=' pb-[calc(1*var(--i-vw))] w-[calc(15*var(--i-vw))] h-[calc(15*var(--i-vw))]' src={'https://fragment.com/' + model_svg}/>
                                  <div className='text-base font-base text-text-main'>
                                    {key}
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          )
                        })
                      }
                    </CarouselContent>
                  </Carousel> : <></> }
                  {/*Backdrop images*/}
                  { Object.keys(order?.nft_backdrops).length > 0 ? <Carousel className='w-min'>
                    <CarouselContent>
                      {
                        Object.keys(order.nft_backdrops).map((key, index) => {
                          const backdrop_svg = order.nft_backdrops[key];
                          return (
                            <CarouselItem key={index}>
                              <Card className='bg-menu-tab'>
                                <CardContent className='px-0 flex flex-col items-center'>
                                  <img className=' pb-[calc(1*var(--i-vw))] w-[calc(15*var(--i-vw))] h-[calc(15*var(--i-vw))]' src={'https://fragment.com/' + backdrop_svg}/>
                                  <div className='text-base font-base text-text-main'>
                                    {key}
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          )
                        })
                      }
                    </CarouselContent>
                  </Carousel> : <></> }
                  {/* Price Chart */}
                  <div className="bg-[#13151f] rounded-lg pt-4">
                    <div className="h-48 w-[calc(85*var(--i-vw))]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1d29',
                              border: '1px solid #2a2d3a',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#6366f1" 
                            strokeWidth={2}
                            fill="url(#colorPrice)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="threshold" 
                            stroke="#ff9393ff"
                            strokeWidth={2}
                            fill="url(#colorPrice)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Analytics Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Analytics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#13151f] rounded-lg">
                        <span className="text-sm text-gray-400">Min. price</span>
                        <span className="text-base font-semibold text-white">
                          {analytics.minPrice.toFixed(2)} TON
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#13151f] rounded-lg">
                        <span className="text-sm text-gray-400">Your price</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-white">
                            {order.price.toFixed(2)} TON
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#13151f] rounded-lg">
                        <span className="text-sm text-gray-400">24h Change</span>
                        <div className="flex items-center gap-2">
                          {analytics.isPriceDown ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-green-500" />
                              <span className="text-base font-semibold text-green-500">
                                {Math.abs(analytics.priceChange).toFixed(2)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-4 h-4 text-red-500" />
                              <span className="text-base font-semibold text-red-500">
                                +{analytics.priceChange.toFixed(2)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#13151f] rounded-lg">
                        <span className="text-sm text-gray-400">Order Status</span>
                        <Badge className={`${getStatusColor(order.order_status)} border`}>
                          {order.order_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </animated.div>
        </Collapsible>
      </Card>
  );
};
