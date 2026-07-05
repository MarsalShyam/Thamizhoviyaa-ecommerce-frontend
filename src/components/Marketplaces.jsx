import React from 'react';
import { motion } from 'framer-motion';

const platforms = [
    {
        name: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        url: "https://www.amazon.in/l/27943762031?me=A37Z9DBTUAOAAM&ref_=ssf_share"
    },
    {
        name: "IndiaMart",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/39/IndiaMART_logo.svg/250px-IndiaMART_logo.svg.png",
        url: "https://www.indiamart.com/thamizhoviyaa-home-goodies/"
    },
    {
        name: "Justdial",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Justdial_Logo.svg/250px-Justdial_Logo.svg.png",
        url: "https://www.justdial.com/Namakkal/Thamizhoviyaa-Home-Goodies-Kalangani/9999P4286-4286-250906043019-U9Q4_BZDET"
    },
    {
        name: "Desertcart UAE",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrTGHeLCDS4NaFYAApUqezC88ERsug3f2ld7AD8pUoQn9Y-KhvrimfVm8&s=10",
        url: "https://www.desertcart.ae/products/774026841-thamizhoviyaa-pure-arappu-powder-natural-hair-wash-and-conditioner-albizia"
    },
    {
        name: "YouTube",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
        url: "https://www.youtube.com/@admin_thamizhoviyaa"
    },
    {
        name: "Scribd",
        logo: "data:image/png;base64,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",
        url: "https://www.scribd.com/document/975860929/Gst-Certificate"
    }
];

const Marketplaces = () => {
    // Duplicate the array to create a seamless loop
    const infinitePlatforms = [...platforms, ...platforms];

    return (
        <section className="section-padding bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            <div className="container-custom">
                {/* Heading Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent mb-4">
                        Trusted Marketplaces & Platforms
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg">
                        Buy our products, watch our manufacturing process,
                        and explore our certifications across these trusted platforms also.
                    </p>
                </motion.div>

                {/* Infinite Slider Wrapper */}
                <div className="relative mt-8">
                    {/* Faded edges for premium look */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

                    <div className="flex overflow-hidden group">
                        <motion.div
                            className="flex space-x-12 md:space-x-20 items-center py-4"
                            animate={{
                                x: [0, -1000], // Adjust based on total logo width
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 25,
                                    ease: "linear",
                                },
                            }}
                            // Pause animation on hover
                            whileHover={{ animationPlayState: "paused" }}
                        >
                            {infinitePlatforms.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 transition-all duration-300 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110"
                                >
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className="h-8 md:h-12 w-auto object-contain pointer-events-none"
                                    />
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Optional: Simple bottom separator or trust indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex justify-center"
                >
                    <div className="h-1 w-20 bg-primary-100 rounded-full" />
                </motion.div>
            </div>
        </section>
    );
};

export default Marketplaces;