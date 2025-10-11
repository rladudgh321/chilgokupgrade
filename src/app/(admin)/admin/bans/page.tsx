import BannedIpList from "./BannedIpList";

const fetchBannedIps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/banned-ips`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? 'Failed to fetch banned IPs');
  return json.data.map((ip: any) => ({
    id: ip.id,
    ipAddress: ip.ipAddress,
    reason: ip.reason ?? '-',
    contact: ip.contact ?? '-',
    details: ip.details ?? '-',
    createdAt: new Date(ip.createdAt).toLocaleDateString(),
  }));
};

const BannedIpPage = async () => {
  const bannedIps = await fetchBannedIps();

  return (
    <BannedIpList initialBannedIps={bannedIps} />
  );
};

export default BannedIpPage;
