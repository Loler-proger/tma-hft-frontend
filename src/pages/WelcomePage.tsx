import ProfileInfo from "@/components/ProfileInfo";
import Toolbar from "@/components/Toolbar";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react";
import { ArrowDown } from "lucide-react";

interface WelcomePageProps{

}

export const WelcomePage: React.FC<WelcomePageProps> = ({}) => {
    return (
        <div className='h-[calc(100*var(--i-vh))] w-[calc(100*var(--i-vw))] bg-dark-bg py-[calc(1*var(--i-vh))]'>
            <ProfileInfo />
                <Card className='w-[calc(86*var(--i-vw))] ml-[calc(7*var(--i-vw))] mb-[calc(2*var(--i-vh))] mt-[calc(5*var(--i-vh))] bg-btn-bg text-text-main border-btn-slct'>
                    <CardHeader>
                        <CardTitle>1. Create order 🔥</CardTitle>
                        <CardDescription>
                            Choose NFts you desire
                        </CardDescription>
                        <CardAction>
                        </CardAction>
                    </CardHeader>
                </ Card>
                <ArrowDown className='mx-auto my-[calc(3*var(--i-vh))] text-text-arb'/>
                <Card className='w-[calc(86*var(--i-vw))] ml-[calc(7*var(--i-vw))] my-[calc(2*var(--i-vh))] bg-btn-bg text-text-main border-btn-slct'>
                    <CardHeader>
                        <CardTitle>2. Pay the invoice</CardTitle>
                        <CardDescription>
                            Choose NFts you desire
                        </CardDescription>
                        <CardAction>
                        </CardAction>
                    </CardHeader>
                </ Card>
                <ArrowDown className='mx-auto my-[calc(3*var(--i-vh))] text-text-arb'/>
                <Card className='w-[calc(86*var(--i-vw))] ml-[calc(7*var(--i-vw))] my-[calc(2*var(--i-vh))] bg-btn-bg text-text-main border-btn-slct'>
                    <CardHeader>
                        <CardTitle>3. Check your order status</CardTitle>
                        <CardDescription>
                            Choose NFts you desire
                        </CardDescription>
                        <CardAction>
                        </CardAction>
                    </CardHeader>
                </ Card>
                <ArrowDown className='mx-auto my-[calc(3*var(--i-vh))] text-text-arb'/>
                <Card className='w-[calc(80*var(--i-vw))] mx-auto my-[calc(2*var(--i-vh))] bg-btn-bg text-text-main border-btn-slct'>
                    <CardHeader>
                        <CardTitle>4. Receive your NFT</CardTitle>
                        <CardDescription>
                            Choose NFts you desire
                        </CardDescription>
                        <CardAction>
                        </CardAction>
                    </CardHeader>
                </ Card>
            <Toolbar />
        </div>
    )
} 