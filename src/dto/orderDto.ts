type IOrderDto = {
    _id: string,
    user: Object,
    user_id: string,
    price: number,
    nft_collection: string,
    nft_models: { [key: string]: string },
    nft_backdrops: { [key: string]: string },
    nft_symbols: { [key: string]: string },
    order_status: 'processing payment' | 'cancelled' | 'completed' | 'in progress',
    payment_status: 'processing' | 'cancelled' | 'completed' ,
    est_price: number,
    floor: number,
    mp_name: string,
    floor_history: [{
        date: Date,
        floor: number
    }],
}

// string[] | 
// string[] | 
// string[] | 

export default IOrderDto;