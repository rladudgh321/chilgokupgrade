import OrderList from "./OrderList";

const fetchOrders = async (page: number, limit: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inquiries/orders?page=${page}&limit=${limit}`, { cache: 'no-store' });
  const json = await res.json();
  if (json.error) throw new Error(json.error ?? '목록 불러오기 실패');
  return { 
    orders: json.data as any[],
    count: json.count ?? 0,
  };
};

const OrdersPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const page = parseInt(searchParams.page ?? "1", 10);
  const limit = 10;
  const { orders, count } = await fetchOrders(page, limit);
  const totalPages = Math.ceil(count / limit);

  return (
    <OrderList 
      initialOrders={orders}
      totalPages={totalPages}
      currentPage={page}
    />
  );
};

export default OrdersPage;