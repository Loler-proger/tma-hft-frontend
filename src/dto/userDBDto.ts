export default interface IUserDB{
    _id: string
    balance: {
        currency: string,
        amount: number
    }
} 