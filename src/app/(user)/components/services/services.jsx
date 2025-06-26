"use client";

import { useEffect, useState } from "react";
import category from "@/dummy/category";
import { FaCar, FaCity } from "react-icons/fa";
import { IoFastFoodOutline, IoFastFoodSharp, IoLogoElectron } from "react-icons/io5";
import { MdEmojiEvents, MdHealthAndSafety, MdHotel, MdPets, MdRealEstateAgent } from "react-icons/md";
import { FiMonitor } from "react-icons/fi";
import { FaPeopleGroup, FaShop, FaWheelchairMove } from "react-icons/fa6";
import { TbShoppingCartFilled } from "react-icons/tb";
import { GrBusinessService } from "react-icons/gr";
import { RiGovernmentFill } from "react-icons/ri";
import { SiElectronbuilder } from "react-icons/si";
import { PiHairDryerFill } from "react-icons/pi";

// Skeleton loader for categories
const CategorySkeleton = () => (
  <div className="p-6 rounded-lg shadow bg-white animate-pulse space-y-3">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 rounded w-full" />
      <div className="h-3 bg-gray-300 rounded w-5/6" />
      <div className="h-3 bg-gray-300 rounded w-4/6" />
      <div className="h-3 bg-gray-300 rounded w-3/6" />
    </div>
  </div>
);

export default function Services() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(category);
      setLoading(false);
    }, 1500); // simulate 1.5s loading

    return () => clearTimeout(timer);
  }, []);

  // return (
  //   <div className="mx-auto px-6 py-10 max-w-7xl">
  //     <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-10">
  //       Explore our services that are useful in everyday activities:
  //     </h2>

  //     <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-7">
  //       {loading
  //         ? Array.from({ length: 12 }).map((_, index) => (
  //             <CategorySkeleton key={index} />
  //           ))
  //         : categories.map((category, index) => (
  //             <div
  //               key={index}
  //               className="p-6 rounded-lg shadow bg-white hover:shadow-md transition"
  //             >
  //               <div className="flex items-center space-x-0 mb-3">
  //                 <p className="text-2xl">{category.icons}</p>
  //                 <h3 className="text-xl font-semibold text-gray-900">
  //                   Automobile
  //                 </h3>
  //               </div>

  //               <p className="text-gray-600 text-sm">
  //                 Lorem Ipsum is simply dummy text of the printing and
  //                 typesetting industry. Lorem Ipsum has been the industry's
  //                 standard dummy text ever since the 1500s, when an unknown
  //                 printer took a galley of type and scrambled it to make a type
  //                 specimen book. It has survived not only five centuries, but
  //                 also the leap into electronic typesetting, remaining
  //                 essentially unchanged.
  //               </p>
  //             </div>
  //           ))}
  //     </div>
  //   </div>
  // );
  return (
    <div className="mx-auto px-6 py-10 max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-10">
        Explore our services that are useful in everyday activities:
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-7">
        {/* Service Card 1 - Automobile */}
        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FaCar /></span>
            <h3 className="text-xl font-semibold text-gray-900">Automobile</h3>
          </div>
          <p className="text-gray-600 text-sm">
            New car dealership, Used car sales, Certified pre-owned cars, Buy and sell cars, Luxury car showroom, Affordable car deals, Car repair services, Vehicle maintenance shop, Car AC repair, Brake and engine repair, Car battery replacement, Auto workshop services, Car wash and detailing, Car polish and ceramic coating, Auto accessories store, Car seat covers and mats, Tyre and wheel alignment, Car audio and electronics, Bike sales and service, Scooter repair shop, Motorcycle servicing, Two-wheeler accessories, Roadside assistance, Vehicle insurance service, RTO and registration help, Car rental and leasing, Car finance and loan services.
          </p>
        </div>

        {/* Service Card 2 - Example */}
        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><PiHairDryerFill /></span>
            <h3 className="text-xl font-semibold text-gray-900">Beauty & Wellness:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Beauty salon services, Haircut and styling, Bridal makeup artist, Unisex salon, Facial and skincare treatments, Full body spa, Nail art and manicure, Pedicure services, Eyebrow threading and waxing, Body polishing and massage, Herbal and ayurvedic spa, Relaxation and wellness therapy, Wellness center, Yoga and meditation classes, Weight loss programs, Skin and hair care clinic, Detox and rejuvenation, Beauty products store, Organic skincare products, Hair care and cosmetics, Herbal beauty treatments, Wellness supplements, Online salon booking, Beauty services at home, Certified beauty professionals, Monthly grooming packages, Instant beauty appointments.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><SiElectronbuilder /></span>
            <h3 className="text-xl font-semibold text-gray-900">Courier & Logistics:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Express courier service, Same-day delivery, Domestic courier solutions, Door-to-door parcel delivery, Secure package delivery, Courier tracking service, Logistics service provider, Freight forwarding company, Supply chain solutions, Warehouse and distribution, Bulk cargo transport, Logistics and inventory management, International courier service, Global shipping solutions, Import and export logistics, Customs clearance support, Overseas parcel delivery, Hyperlocal delivery services, Bike and van delivery, eCommerce delivery solutions, Last-mile delivery service, Scheduled delivery provider,Corporate courier solutions, Courier franchise service, Packaging and labelling, Real-time shipment tracking,Pickup and delivery service
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><IoLogoElectron /></span>
            <h3 className="text-xl font-semibold text-gray-900">Electronics Keywords:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Electronics store, Home appliances, Consumer electronics, Branded electronics, Electronic gadgets, Smart electronics, Latest electronics, Affordable electronics, Electronic showroom, Best electronics deals, Mobile phones, Smart TVs, Washing machines, Refrigerators, Laptops & computer, Air conditioners, Bluetooth speakers, Kitchen appliances, CCTV & security systems, Headphones & accessories, Electronics repair, Appliance installation, Warranty services, Authorized electronics dealer, Electronic spare parts, Inverter and battery services, Home automation solutions, Home appliance showroom, Electronics repair and service.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FaWheelchairMove /></span>
            <h3 className="text-xl font-semibold text-gray-900">Entertainment & Recreation keywords :</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Entertainment services, Recreation center, Family entertainment, Indoor play zone, Fun activities, Gaming arcade, Bowling alley, Trampoline park, Adventure park,  Mini golf course, Escape room games, Movie theatre, Amusement park, Event and party venue, Live music shows, Weekend getaway ideas, Kids activity center, Fun for kids, Activities for families, Adult recreational services, Teen entertainment zone, Group entertainment ideas, Nightclubs and lounges, Late-night entertainment, Weekend nightlife spots, Nightlife events, Live music bar, DJ nights, Dance club, Rooftop bar, Cocktail lounge, Night party venue. 
          </p>
        </div>


        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdEmojiEvents /></span>
            <h3 className="text-xl font-semibold text-gray-900">Event Management & Wedding Services:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Event management services, Wedding planning services, Corporate event organizer, Event planner, Full-service event company, Wedding decorators, Destination wedding planner, Bridal event services, Pre-wedding event planning, Mandap and stage decoration, Wedding catering services, Birthday party organizers, Baby shower event planner, Anniversary celebration planner, Engagement event coordinator, Private party planning, Cultural and festive event services, Event coordination and logistics, Event design and styling, Lighting and sound services, Photography and videography, Celebrity and artist management, Invitation design and printing.
          </p>
        </div>


        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><RiGovernmentFill /></span>
            <h3 className="text-xl font-semibold text-gray-900">Government Services:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Beauty salon services, Haircut and styling, Bridal makeup artist, Unisex salon, Facial and skincare treatments, Full body spa, Nail art and manicure, Pedicure services, Eyebrow threading and waxing, Body polishing and massage, Herbal and ayurvedic spa, Relaxation and wellness therapy, Wellness center, Yoga and meditation classes, Weight loss programs, Skin and hair care clinic, Detox and rejuvenation, Beauty products store, Organic skincare products, Hair care and cosmetics, Herbal beauty treatments, Wellness supplements, Online salon booking, Beauty services at home, Certified beauty professionals, Monthly grooming packages, Instant beauty appointments.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdHealthAndSafety /></span>
            <h3 className="text-xl font-semibold text-gray-900">Home Services:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Home services provider, Professional home solutions, On-demand home service, Verified home technicians, At-home service experts, Electrician services, Plumbing repair, AC repair and servicing, Appliance repair technician, Handyman services, Home deep cleaning, Sofa and carpet cleaning, Kitchen and bathroom cleaning, Pest control services, Water tank cleaning Interior design services, Painting and renovation, Modular kitchen installation, Carpentry and woodwork, Flooring and tiling services Gardening and landscaping, Water purifier installation, Solar panel services, CCTV and home security setup, Home automation services
        </p>
        </div>


        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdHealthAndSafety /></span>
            <h3 className="text-xl font-semibold text-gray-900">Healthcare & Medical:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Healthcare services, Medical clinic, General physician, Family health services, 24/7 medical support, Pediatric care, Gynecology services, Orthopedic specialist, Cardiologist consultation, Dermatology clinic, Pathology lab, Diagnostic center,Blood test services,Health check up packages, COVID test and reports, Online pharmacy, Prescription medicine delivery, Generic medicine store, Medical equipment supply,  Health supplements shop, Preventive healthcare,Physiotherapy services, Nutrition and diet consultation, Mental health counselling, Health and wellness center.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdHotel /></span>
            <h3 className="text-xl font-semibold text-gray-900">Hotels & Accommodation:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Hotel booking services, Budget hotels, Luxury accommodation, Family-friendly hotels, Best places to stay, Boutique hotels, Business hotels, Guest houses, Serviced apartments, Resort stays, Bed and breakfast, Online hotel reservations, 24/7 check-in hotel, Room booking with free WiFi, Hotels with complimentary breakfast, Couple-friendly stays, Hotels with swimming pool, Pet-friendly accommodation, Hotels with parking, Sea view rooms, Conference and banquet halls.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FiMonitor /></span>
            <h3 className="text-xl font-semibold text-gray-900">IT & Software Services:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          IT solutions provider, Software development company, IT consulting services, Managed IT services, Tech support and maintenance, Custom software development, Web application development, Mobile app development, SaaS product development, Enterprise software solutions, Website design and development, E-commerce website services, UI/UX design services, CMS development, SEO and digital marketing, Cloud computing services, AWS and Azure solutions, Cloud migration support, Data backup and recovery, IT infrastructure management.
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><GrBusinessService /></span>
            <h3 className="text-xl font-semibold text-gray-900">Legal & Finance Services:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Legal consultancy services, Corporate legal advisor, Civil and criminal lawyer, Property legal services, Legal documentation assistance, Contract drafting services, Trademark and copyright services, Legal notice drafting, Court representation services, Online legal consultation, Financial advisory services, Tax filing and consultancy, Chartered accountant services, GST registration and return filing, Business loan assistance, Investment and wealth planning, Bookkeeping and accounting services, Personal finance planning, Income tax consultant, Financial audit services.
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdPets /></span>
            <h3 className="text-xl font-semibold text-gray-900">Pets & Pet Care:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Pet care services, Pet grooming salon, Veterinary clinic, Pet boarding and daycare, Pet adoption services, Pet food and supplies, Dog and cat accessories, Pet toys and treats, Aquarium and fish supplies, Online pet store, Dog grooming services, Cat grooming specialists, Pet spa and massage, Flea and tick treatment, Pet dental care, Vet consultation, Pet vaccination services, Emergency vet services, Pet surgery and diagnostics, Home visit vet services, Pet training and obedience,Pet hostel and day-care, Dog walking services, In-home pet sitting, Pet travel and relocation
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FaPeopleGroup /></span>
            <h3 className="text-xl font-semibold text-gray-900">Political Parties & Politicians:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Political party profile, Registered political organization, Political campaign services, Political candidate bio, Party membership details, Election campaign strategy, Political manifesto highlights, Party agenda and goals, Voter engagement initiatives, Political rally announcements, Politician public profile,Political speeches and updates,Policy and reform advocacy,Public outreach programs, Government policy stance, Join political party, Volunteer for political campaign, Support political movement, Donate to political campaign, Youth political engagement, Political party news, Political press release, Social media for politicians, Political influencer content, Political branding online.
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><MdRealEstateAgent /></span>
            <h3 className="text-xl font-semibold text-gray-900">Real Estate & Rentals:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Real estate services, Property buying and selling, Residential real estate agents, Commercial property consultants, Verified real estate listings, Apartments for sale, Villas for rent, Flats for lease, Office space rental, Land and plot sales, Studio apartment listings, House for rent, Short-term rentals, Furnished apartment rentals, PG accommodation, Luxury rentals, Tenant and landlord services, Real estate investment services,Commercial property deals, Real estate project marketing, Property resale specialists, Real estate valuation services, Property documentation support, Legal assistance in real estate, Home loan consultation, Rental agreement services, Property site visit booking
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><IoFastFoodSharp /></span>
            <h3 className="text-xl font-semibold text-gray-900">Restaurants & Food:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Best restaurants near me, Family dining restaurant, Fine dining experience, Casual dine-in spot, Affordable restaurants, Indian food restaurant,Chinese cuisine, Italian pasta and pizza, Continental restaurant, Vegan and vegetarian food, Multi-cuisine dining, Online food delivery, Food takeaway service, Quick meal delivery, Order food online, Contactless delivery restaurants, Rooftop restaurant, Romantic dinner spot, Buffet restaurant,Themed dining experience, Live music with dinner, Street food corner, Dessert and bakery shop, Coffee and tea café, Juice and smoothie bar, Fast food and snacks.
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FaCity /></span>
            <h3 className="text-xl font-semibold text-gray-900">Shopping & Malls:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Shopping mall, Retail shopping center, Best places to shop, Mall with branded stores, Shopping complex, Fashion and apparel stores, Electronics and gadgets shop,Footwear and accessories, Home décor and furniture, Jewelry and watch outlets, Food court restaurants, Cafes and quick bites, Movie theater in mall, Kids play area in mall, Gaming and arcade zone, Family shopping destination, Luxury shopping experience, Weekend shopping deals, Seasonal sale and discounts, Mall with parking facilities, Online mall directory, Mall navigation app, Store locator service, Shopping mall events, Branded store listings
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><TbShoppingCartFilled /></span>
            <h3 className="text-xl font-semibold text-gray-900">Shopping & Retail:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Retail store, Online shopping, Shop for clothes, Lifestyle store, Affordable shopping, Fashion and clothing store, Footwear and accessories, Mobile and electronics shop, Home décor and furniture, Grocery and daily needs, Departmental store, Supermarket shopping, Branded retail outlet, Boutique store, Online retail platform, Best shopping deals, Discount and sale offers, Seasonal promotions, New arrivals in store, Fast delivery shopping, Easy return policy, Cash on delivery available, Loyalty and reward program, Gift cards and vouchers,24/7 customer support.
        </p>
        </div>

        <div className="p-6 rounded-lg shadow bg-white hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl"><FaShop /></span>
            <h3 className="text-xl font-semibold text-gray-900">Pan Shops and General Stores:</h3>
          </div>
          <p className="text-gray-600 text-sm">
          Pan shop near me, Betel leaf and supari shop, Sweet and meetha pan, Cigarettes and tobacco store, Fresh pan and mouth fresheners, Desi pan flavour varieties, Pan masala and gutkha shop, Cold drink and pan stall, Late-night pan shop, Hookah and smoking accessories, Daily needs store, Grocery and general store, Kirana shop online, Household items store, Snacks and beverages shop, Soap and toiletries store, Home essentials and groceries, Rice, dal, and spices shop, Stationery and utility items, Milk and dairy product shop
        </p>
        </div>
      </div>
    </div>
  );
};
