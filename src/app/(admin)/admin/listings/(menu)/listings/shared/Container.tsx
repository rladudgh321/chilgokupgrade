const Container = ({children, title}: {children: React.ReactNode; title: string;}) => {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 border border-gray-200">
      <h3 className="px-2 sm:px-4 bg-slate-200 h-12 sm:h-14 flex items-center font-bold text-base sm:text-lg">{title}</h3>
      <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 bg-slate-100">
        {children}
      </div>
    </div>
  );
};

export default Container;