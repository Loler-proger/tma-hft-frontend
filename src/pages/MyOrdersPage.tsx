import axios from "axios";
import ProfileInfo from "../components/ProfileInfo.tsx";
import Toolbar from "../components/Toolbar.tsx";
import { useEffect, useState } from "react";
import IOrderDto from "../dto/orderDto.ts";
import OrderCard from "../components/OrderCard.tsx";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { OrderDropdown } from "../components/OrderDropdown.tsx";

export default function MyOrdersPage() {
	const { tgWebAppData } = useLaunchParams();
	const userInfo = tgWebAppData?.user;
	const [ orders, setOrders ] = useState([] as IOrderDto[]);
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/my-orders/${userInfo?.id}`).then((res) => {
			const res_orders = res.data;
			if(Object.keys(res_orders).length > 0){
				setOrders(res_orders);
			}
		});
	}, []);
  return (
    <div className='overflow-x-hidden h-[calc(100*var(--i-vh))] w-[calc(100*var(--i-vw))] bg-dark-bg py-[calc(1*var(--i-vh))]'>
        <ProfileInfo />
        <div>
			<div className='my-[calc(2*var(--i-vh))] ml-[calc(4*var(--i-vw))] font-baloo font-bold text-text-main text-3xl'>
				Your orders
			</div>
			<div className='grid grid-cols-2 gap-[calc(3.5*var(--i-vw))] px-[calc(4*var(--i-vw))]'>
				{
					orders.map((elem) => {
						return (
							<>
								<OrderDropdown order={elem}>
									<OrderCard order_info={elem} />
								</OrderDropdown>
							</>
						)
					})
				}
			</div>
        </div>
		<div className='h-[calc(22*var(--i-vh))]'>

		</div>	
        <Toolbar />
    </div>
  );
}
