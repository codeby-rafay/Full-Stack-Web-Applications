function About() {
  const features = [
    {
      title: "Wide Product Range",
      desc: "Browse products across multiple categories with ease.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Smart Search",
      desc: "Quickly find products by searching the product in search bar.",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Category Filtering",
      desc: "Explore products by categories easily.",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  window.scrollTo(0, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="text-xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Product<span className="text-orange-500">Hub</span>
        </span>
        <h1
          className="mt-4 text-4xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Your Online Shopping Destination
        </h1>
        <p className="mt-4 text-gray-500 leading-relaxed max-w-xl mx-auto">
          ProductHub is a modern e-commerce web application where users can
          explore, search, and browse products across different categories. It
          provides a smooth and responsive shopping experience with clean UI and
          fast performance.
        </p>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Key Features
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-100 rounded-xl p-4"
            >
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${item.color}`}
              >
                {item.title}
              </span>
              <p className="text-gray-500 text-xs mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-orange-800 mb-3">Our Mission</h2>
        <p className="text-sm text-orange-700 leading-relaxed">
          Our goal is to provide a simple, fast, and user-friendly platform for
          users to explore products online. ProductHub focuses on delivering a
          smooth browsing experience with modern web technologies and scalable
          architecture.
        </p>
      </div>
    </div>
  );
}

export default About;
