import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import dotenv from "dotenv";

dotenv.config();

async function main() {

    const provider = getProviders();
    const signer = getSigners();


    // deploy facets 



    const entrypoint = await (await ethers.getContractFactory("Pool", signer.l2)).deploy();
    await entrypoint.deployed();
    // print out 
    console.log(`entrypoint deployed to: ${entrypoint.address}`);


    const params = await (await ethers.getContractFactory("PoolFacetParams", signer.l2)).deploy();
    await params.deployed();
    // print out
    console.log(`Params deployed to: ${params.address}`);

    
    const reveal = await (await ethers.getContractFactory("PoolFacetReveal", signer.l2)).deploy();
    await reveal.deployed();
    // print out
    console.log(`Reveal deployed to: ${reveal.address}`);

    
    const buyOrder = await (await ethers.getContractFactory("PoolFacetBuyOrder", signer.l2)).deploy();
    await buyOrder.deployed();
    // print out
    console.log(`BuyOrder deployed to: ${buyOrder.address}`);

    const facets = [
        entrypoint.address,  // FACET_ENTRY_POINT,
        params.address,   // FACET_PARAMS,
        reveal.address,  // FACET_REVEALS,
        buyOrder.address, // FACET_BUYORDER_BOX 
    ]

    console.log(facets);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
