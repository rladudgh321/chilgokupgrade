"use client";

import AdminBoardForm from '@/app/(admin)/admin/board/admin-board/components/AdminBoardForm';

interface PostForForm {
  id: string;
  title: string;
  content: string;
  popupContent: string | null;
  representativeImage: string | null;
  externalLink: string | null;
  registrationDate: string;
  manager: string;
  isAnnouncement: boolean;
  isPopup: boolean;
  popupWidth: number | null;
  popupHeight: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  order: number | null;
}

interface AdminBoardEditClientProps {
  post: PostForForm;
}

const AdminBoardEditClient = ({ post }: AdminBoardEditClientProps) => {
  return <AdminBoardForm initialData={post} isEdit={true} />;
};

export default AdminBoardEditClient;