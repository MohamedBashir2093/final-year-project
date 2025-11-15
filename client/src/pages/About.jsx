import React from 'react';
import { Users, HeartHandshake, Store } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Users,
      title: 'Community Feed',
      description: 'A dedicated space for neighbors to share updates, ask questions, and stay connected with local happenings.',
      color: 'text-blue-200 bg-blue-800'
    },
    {
      icon: HeartHandshake,
      title: 'Local Services',
      description: 'Easily find and book trusted service providers within your neighborhood, supporting local businesses.',
      color: 'text-green-200 bg-green-800'
    },
    {
      icon: Store,
      title: 'Marketplace',
      description: 'Buy, sell, or trade items locally with people you can trust, fostering a sustainable community economy.',
      color: 'text-purple-200 bg-purple-800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-900">
      {/* Header */}
      <div className="text-center mb-16 text-gray-100">
        <h1 className="text-5xl font-extrabold mb-4">About Neighbordeep</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Connecting residents and service providers to build stronger, more supportive neighborhoods.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-gray-700 text-gray-100">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">Our Mission</h2>
        <p className="text-lg md:text-xl leading-relaxed text-center md:text-left">
          Neighbordeep was founded on the belief that strong communities thrive when neighbors help each other.
          Our platform simplifies local interactions, making it easy to find reliable services, share information, 
          and participate in a local marketplace. We aim to foster trust and convenience, turning neighborhoods into true communities.
        </p>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700 text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl text-gray-100"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${feature.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-200 text-sm md:text-base">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
