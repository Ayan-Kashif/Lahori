import { FaPizzaSlice, FaHamburger, FaDrumstickBite, FaUtensils, FaClock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
const AboutPage = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen mt-16 bg-gradient-to-b from-orange-50 to-amber-50">
                {/* Hero Section */}
                <div className="relative h-96 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                        alt="Lahori Pizza"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Lahori Pizza & Fast Food</h1>
                            <p className="text-xl text-white mb-6">Serving Authentic Flavors with a Modern Twist</p>
                            <div className="flex items-center justify-center gap-2 text-white">
                                <FaMapMarkerAlt className="text-orange-300" />
                                <span>Harnoli</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                    {/* Our Story */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-orange-800 mb-6 relative inline-block">
                            <span className="relative z-10">Our Story</span>
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-orange-200 z-0 opacity-70"></span>
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Founded with a passion for rich, bold flavors, Lahori Pizza & Fast Food brings the vibrant culinary heritage of Lahore to your table. From sizzling pizzas loaded with fresh toppings to mouthwatering fast-food classics, every dish is prepared with care, using the finest ingredients.
                        </p>
                    </div>

                    {/* What We Offer */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-orange-800 mb-8">What We Offer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FeatureCard
                                icon={<FaPizzaSlice className="text-4xl text-orange-500" />}
                                title="Signature Pizzas"
                                description="Hand-tossed dough, premium cheese, and fresh toppings"
                            />
                            <FeatureCard
                                icon={<FaHamburger className="text-4xl text-orange-500" />}
                                title="Juicy Burgers & Wraps"
                                description="Perfectly grilled patties and flavorful fillings"
                            />
                            <FeatureCard
                                icon={<FaDrumstickBite className="text-4xl text-orange-500" />}
                                title="Crispy Fried Chicken"
                                description="Golden, crunchy, and full of spice"
                            />
                            <FeatureCard
                                icon={<FaUtensils className="text-4xl text-orange-500" />}
                                title="Irresistible Sides"
                                description="Fries, nuggets, and more to complete your meal"
                            />
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-orange-800 mb-8">Why Choose Us?</h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BenefitItem
                                    title="Authentic Lahori Taste"
                                    description="Recipes inspired by Lahore's legendary street food"
                                />
                                <BenefitItem
                                    title="Fresh & Quality Ingredients"
                                    description="No compromises on flavor or freshness"
                                />
                                <BenefitItem
                                    title="Fast & Friendly Service"
                                    description="Quick, efficient, and always with a smile"
                                />
                                <BenefitItem
                                    title="Cozy & Modern Ambiance"
                                    description="A welcoming space for dine-in or takeaway"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visit Us */}
                    <div className="bg-orange-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-10 text-white">
                            <h2 className="text-3xl font-bold mb-6">Visit Us Today!</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-orange-300 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Location</h3>
                                        <p>Harnoli</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaPhone className="text-orange-300 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Call to Order</h3>
                                        <p>+92 300 1103755</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaClock className="text-orange-300 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Opening Hours</h3>
                                        <p>Monday-Sunday: 11:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="text-orange-200 italic">
                                    Join us at Lahori Pizza & Fast Food and experience a burst of flavors that keep you coming back for more!
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">#LahoriFlavors</span>
                                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">#HarnoliEats</span>
                                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">#PizzaLovers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Component for feature cards
const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

// Component for benefit items
const BenefitItem = ({ title, description }) => {
    return (
        <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-2 rounded-full">
                <div className="bg-orange-500 w-2 h-2 rounded-full"></div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default AboutPage;