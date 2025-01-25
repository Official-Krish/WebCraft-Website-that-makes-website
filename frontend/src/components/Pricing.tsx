
export const Pricing = () => {
    return <div className="flex flex-col justify-center items-center mt-16">
        <div className="flex flex-col md:flex-row gap-14">
            {/* Free Plan */}
            <div className="bg-brown3 text-white rounded-2xl shadow-lg p-8 w-96 hover:border-2 hover:border-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <h2 className="text-xl font-semibold">Free</h2>
                <p className="text-4xl font-bold my-4">$0<span className="text-lg font-normal">/month</span></p>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>3 Website Generations
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Basic Customization
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Export HTML/CSS
                    </li>
                </ul>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg my-10 w-full">
                    Get Started
                </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-brown3 text-white rounded-2xl shadow-lg p-8 w-96 border-2 border-blue-500 relative transition delay-150 duration-300 ease-in-out -translate-y-1 scale-110">
                <div className="absolute top-0 -mt-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Most Popular
                </div>
                <h2 className="text-xl font-semibold">Pro</h2>
                <p className="text-4xl font-bold my-4">$29<span className="text-lg font-normal">/month</span></p>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Unlimited Generations
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Advanced Customization
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Priority Support
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Custom Domain
                    </li>
                </ul>
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg my-10 w-full">
                    Get Started
                </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-brown3 text-white rounded-2xl shadow-lg p-8 w-96 hover:border-2 hover:border-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <h2 className="text-xl font-semibold">Enterprise</h2>
                <p className="text-4xl font-bold my-4">$99<span className="text-lg font-normal">/month</span></p>
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Everything in Pro
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>API Access
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Dedicated Support
                    </li>
                    <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>Custom Integration
                    </li>
                </ul>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg my-10 w-full">
                    Contact Sales
                </button>
            </div>
        </div>
    </div>
}