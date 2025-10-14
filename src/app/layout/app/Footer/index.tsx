import Image from "next/image";

// Define the type for the prop
type WorkInfo = {
  companyName?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  owner?: string | null;
  businessId?: string | null;
  address?: string | null;
  logoUrl?: string;
} | null;

const Footer = ({ workInfo }: { workInfo: WorkInfo }) => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 및 회사명 */}
          <div className="flex flex-col items-start">
            <Image 
              src={String(workInfo?.logoUrl)} 
              alt="logo" 
              width={120} 
              height={60} 
            />
            <p className="mt-4 text-lg font-bold text-white">
              {workInfo?.companyName}
            </p>
          </div>

          {/* 상세 정보 */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-semibold w-16 inline-block">전화:</span>
                  <span>{workInfo?.phone}</span>
                </li>
                <li>
                  <span className="font-semibold w-16 inline-block">휴대폰:</span>
                  <span>{workInfo?.mobile}</span>
                </li>
                <li>
                  <span className="font-semibold w-16 inline-block">이메일:</span>
                  <a href={`mailto:${workInfo?.email}`} className="hover:text-white transition-colors">
                    {workInfo?.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Information</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-semibold w-24 inline-block">대표자:</span>
                  <span>{workInfo?.owner}</span>
                </li>
                <li>
                  <span className="font-semibold w-24 inline-block">사업자번호:</span>
                  <span>{workInfo?.businessId}</span>
                </li>
                <li>
                  <span className="font-semibold w-24 inline-block">주소:</span>
                  <span>{workInfo?.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} {workInfo?.companyName || "회사 이름, Inc."}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
