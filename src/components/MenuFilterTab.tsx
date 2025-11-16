interface MenuFilterArgs{
    name: string,
    svgPath: string,
    selectedItem: string | string[],
    setItem: Function
}

export default function MenuFilterTab({ name, svgPath, selectedItem, setItem }: MenuFilterArgs){
    let selectCondition = false;
    if(Array.isArray(selectedItem)){
        selectCondition = selectedItem.includes(name);
    } else{
        selectCondition = selectedItem == name;
    }
    const classString = selectCondition ? 'bg-gradient-to-r from-menu-tab-grad-from to-menu-tab' : 'bg-menu-tab';
    return(
        <div className={classString + ' flex items-center pl-[calc(3*var(--i-vw))] pt-[calc(3*var(--i-vw))] pb-[calc(3*var(--i-vw))] text-base text-text-main font-baloo font-light'} onClick={(e) =>{
            console.log(e.currentTarget.textContent);
            setItem(name);
            if(Array.isArray(selectedItem)){
                if(selectedItem.includes(name)){
                    setItem(selectedItem.toSpliced(selectedItem.indexOf(name), 1))
                }
            } else{
                if(e.currentTarget.textContent == selectedItem){
                    setItem('');
                }
                selectedItem = ''
            }
        }}>
            {svgPath != '' ? <img className='w-[calc(10*var(--i-vw))] h-[calc(10*var(--i-vw))] mr-[calc(4*var(--i-vw))]' src={'https://fragment.com/' + svgPath}/> : <></>}
            <div className=''> 
                {name}
            </div>
        </div>
    )
}