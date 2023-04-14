/* page create */
export default function Create() {
    return (
        <div className="text-left">
            <span className="max-w-2xl inline-block">
                Create buy orders for setting up the internal collections for a pool,
                a pool is made up of buy orders for different collections tbh.

                <br /><br />

                Once a pool created, people can mint items from the pool, the item could
                be any of the collections in the pool, it's randomly.

                <br /><br />
                Get NFT or ETH after revealing depends on if the pool is filled up or not,
                for filling up the pool, we will provide scripts for people to do it, which
                are called "keeprs" in flap.sh.

                The keepers will be rewarded with ETH from the fees of the pool.
            </span>
            <div className="flex flex-row align-center pb-8 pt-10">
                <div className="text-2xl pr-3">Create Order</div>
                <a href="#" className="w-5 hover:cursor-pointer flex items-center">
                    +
                </a>
            </div>
        </div>
    )
}
