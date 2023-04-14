/* page portfolio */

export default function Portfolio() {
    return (
        <main className="grid grid-cols-12">
            <div className="col-span-4">
                <span className="border border-solid border-gray-300 px-6 py-2 w-full inline-block">
                    Pools
                </span>
                <span
                    className="border-x border-solid border-gray-300 px-6 py-2 w-full inline-block"
                >
                    switch input here (status)
                </span>
                {/* pool list */}
                <div className="border border-solid border-gray-300 grid grid-cols-3 px-5 leading-10">
                    {/* table head */}
                    <span className="w-10">id</span>
                    <span className="w-20">owned</span>
                    <span className="">status</span>
                    {/* items */}
                    <span className="w-10">1</span>
                    <span className="w-20">5</span>
                    <span>REFUNDABLE</span>
                </div>
            </div>

            {/* collection info */}
            <div className="col-span-8 border border-solid border-gray-300 px-6 py-2 w-full inline-block">
                <div className="grid grid-cols-6 grid-gap-4 pb-5">
                    <span className="text-lg col-span-3">Selected collection</span>
                    <span className="text-sm">EST Value</span>
                    <span className="text-sm">Cost</span>
                    <span className="text-sm">Currrent Supply</span>
                    <span className="text-sm col-span-3 text-gray-500">count</span>
                    <span className="text-md">10E</span>
                    <span className="text-md">3E</span>
                    <span className="text-md">10/100</span>
                </div>

                {/* List here */}
                <div className="border-t border-solid">
                    <div className="grid grid-cols-8 grid-gap-4 pt-6">
                        <span></span>
                        <span>id</span>
                        <span>cost</span>
                    </div>
                    <div className="grid grid-cols-8 grid-gap-4 pt-3">
                        <div className="text-center">
                            <input type="checkbox" className="w-3" />
                        </div>
                        <span>1</span>
                        <span>0.5E</span>
                    </div>
                    <div className="grid grid-cols-8 grid-gap-4 pt-2 pb-5">
                        <div className="text-center">
                            <input type="checkbox" className="w-3" />
                        </div>
                        <span>2</span>
                        <span>0.5E</span>
                    </div>
                </div>

                {/* Bottom actions */}
                <div className="border-t border-solid pt-4 pb-3">
                    <button
                        className="border border-solid border-gray-100 py-1 px-3"
                    >
                        mb refund
                    </button>
                </div>
            </div>
        </main>
    )
}
