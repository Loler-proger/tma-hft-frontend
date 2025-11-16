import React from "react";
import Fuse from "fuse.js";

interface SearchTabProps{
    fuse: Fuse<string>,
    initialList: string[],
    setFuseList: Function
}

const MenuSearchTab: React.FC<SearchTabProps> = ({ fuse, initialList, setFuseList }) => {
    return (
        <input type='string' className='overflow-y-hidden focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none active:outline-none active:ring-0 active:border-transparent appearance-none font-baloo text-text-main text-lg' placeholder='Search Collection' onChange={(e: any) => {
            const text = e.currentTarget.value;
            fuse.setCollection(initialList);
            if(text != ''){
                setFuseList(fuse.search(text).filter((elem: any) => {
                    if(elem.score! < 0.2){
                        return true;
                    }
                    return false;
                }).map((elem: any) => elem.item));
            } else{
                setFuseList(initialList);
            }
        }}/>
    )
}

export default MenuSearchTab;