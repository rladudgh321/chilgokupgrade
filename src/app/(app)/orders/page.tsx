import OrderForm from './OrderForm';

async function getPropertyTypes() {
  // Fetch data from your API endpoint.
  // The URL should be absolute for server-side fetching.
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/property-types`, { cache: 'no-store' });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary.
    throw new Error('Failed to fetch property types');
  }

  const { data } = await res.json();
  return data || [];
}

async function getBuyTypes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/buy-types`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch buy types');
  }

  const { data } = await res.json();
  return data || [];
}

const OrdersPage = async () => {
  const propertyTypes = await getPropertyTypes();
  const buyTypes = await getBuyTypes();

  return (
    <main className="container mx-auto p-4 sm:px-4 sm:py-8 mt-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">매물 의뢰</h1>
      <OrderForm propertyTypes={propertyTypes} buyTypes={buyTypes} />
    </main>
  );
};

export default OrdersPage;
