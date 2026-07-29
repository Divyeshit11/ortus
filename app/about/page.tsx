export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-text mb-8 text-center">
          Our Story
        </h1>
        
        <div className="prose-brand text-lg space-y-6">
          <p>
            Founded on the belief that children deserve the finest quality, ORTUS combines timeless design with exceptional craftsmanship. Each piece is thoughtfully created to provide both style and comfort, ensuring your little ones look and feel their best every day.
          </p>
          
          <p>
            Our journey began with a simple vision: to create children's fashion that doesn't compromise on quality or style. We work with premium materials and skilled artisans to bring you clothing that stands the test of time.
          </p>
          
          <p>
            At ORTUS, we believe in sustainable fashion. Our commitment to ethical production and eco-friendly materials ensures that every purchase you make is a step towards a better future for our children.
          </p>
          
          <h2 className="font-serif text-2xl text-brand-text mt-12 mb-4">Our Values</h2>
          
          <ul className="space-y-3">
            <li><strong>Quality:</strong> Premium materials and expert craftsmanship</li>
            <li><strong>Sustainability:</strong> Eco-friendly production practices</li>
            <li><strong>Comfort:</strong> Designed for active, happy children</li>
            <li><strong>Style:</strong> Timeless designs that never go out of fashion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
