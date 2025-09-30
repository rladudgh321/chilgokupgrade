import ContactRequestList from "./ContactRequestList";

const fetchContactRequests = async (page: number, limit: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/supabase/contact-requests?page=${page}&limit=${limit}`, { cache: 'no-store' });
  const json = await res.json();
  if (!json?.ok) throw new Error(json?.error?.message ?? '목록 불러오기 실패');
  return { 
    requests: (json.data as any[]).map((r) => ({
      id: r.id,
      confirm: !!r.confirm,
      author: r.author ?? '',
      contact: r.contact ?? '',
      ipAddress: r.ipAddress ?? '',
      description: r.description ?? '',
      note: r.note ?? '',
      date: r.date ? String(r.date).slice(0, 10) : '',
    })),
    count: json.count ?? 0,
  };
};

const ContactRequestPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const page = parseInt(searchParams.page ?? "1", 10);
  const limit = 10;
  const { requests, count } = await fetchContactRequests(page, limit);
  const totalPages = Math.ceil(count / limit);

  return (
    <ContactRequestList 
      initialRequests={requests}
      totalPages={totalPages}
      currentPage={page}
    />
  );
};

export default ContactRequestPage;