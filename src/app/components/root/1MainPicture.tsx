import Image from 'next/image';

const MainPicture = () => {
  return (
    <section className="w-full mt-14">
      <Image
        src="/img/main.png"
        alt="Main visual"
        width={1920} // Placeholder: Adjust if you know the actual image width
        height={400} // Placeholder: Adjust if you know the actual image height
        sizes="100vw"
        className="w-full h-auto"
        priority
      />
    </section>
  );
};

export default MainPicture;
