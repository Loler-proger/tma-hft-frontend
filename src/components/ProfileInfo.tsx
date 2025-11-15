import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function ProfileInfo(){
    interface IUserDB{
        _id: string,
        balance: {
            currency: string,
            amount: number
        },
        tg_id: string
    } 

    const { tgWebAppData } = useLaunchParams();
    const userInfo = tgWebAppData?.user;
    const [ userDBInfo, setUserDBInfo ] = useState({} as IUserDB);
    useEffect(() => {
        axios.get(`http://localhost:8000/users/${userInfo?.id}`).then((res) => {
            const data = res.data;
            if(data != null){
                setUserDBInfo(data);
            }
        });
    }, []);
    return(
        <div className='flex items-center mt-[calc(2*var(--i-vh))] mb-[calc(2*var(--i-vh))] ml-[calc(4*var(--i-vw))] w-max'>
            <img className='w-[calc(11*var(--i-vw))] h-[calc(11*var(--i-vw))] rounded-full overflow-hidden' src={userInfo?.photo_url} />
            <div className='ml-[calc(5*var(--i-vw))] font-baloo font-semibold text-xl text-text-main'>
                {userInfo?.username}
            </div>
            {/* { Object.keys(userDBInfo).length > 0 ? <div>
                {userDBInfo.balance.amount}
            </div> : <></> } */}
        </div>
    )
}