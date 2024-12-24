import React from 'react';

const ProductCard = ({ title, price, image }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-green-900">{title}</h3>
        <p className="text-green-800">Rp.{price}</p>
        <button className="mt-4 px-4 py-2 border border-green-800 text-green-800 rounded-xl hover:bg-green-800 hover:text-white transition">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const products = [
    { id: 1, title: 'White Dress', price: '550.000', image: '/dress.jpg' },
    { id: 2, title: 'White Dress', price: '550.000', image: '/dress.jpg' },
    { id: 3, title: 'White Dress', price: '550.000', image: '/dress.jpg' },
    { id: 4, title: 'White Dress', price: '550.000', image: '/dress.jpg' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold text-center text-green-900 mb-8">
          Produk
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900">
            Prev
          </button>
          <span className="text-green-900">1/2</span>
          <button className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
