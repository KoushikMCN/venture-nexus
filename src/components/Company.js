import { useState } from 'react';
import logo from '../assets/logo.svg';

const Company = () => {

    const [growth, setGrowth] = useState()

    const groww = () => {
        window.localStorage.setItem("growth", growth)
    }

    return (
        <>
            <input type='number' placeholder='Enter growth' value={growth} onChange={(e)=>setGrowth(e.target.value)} />
            <button onClick={groww}>Enter</button>
        </>
    )
}

export default Company;
