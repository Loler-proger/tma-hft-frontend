export default interface collectionMetadata extends Object{
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