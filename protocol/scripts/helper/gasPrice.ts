import {utils} from "ethers";


export const gas50gwei = {
    //  gwei 
    gasPrice:  utils.parseUnits("50", "gwei"),
}

export const gas10gwei = {
    // 100 gwei 
    gasPrice:  utils.parseUnits("10", "gwei"),
}



export const gas100gwei = {
    //  gwei 
    gasPrice:  utils.parseUnits("100", "gwei"),
}

export const gas200gwei = {
    //  gwei 
    gasPrice:  utils.parseUnits("100", "gwei"),
}


export const fastestGas = gas200gwei;

