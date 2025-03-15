export default function MyCard({ children }) {
    return (
          <div className="relative flex flex-col md:flex-row items-center px-4 py-8 bg-[#F7F6F9] w-full max-w-[800px] rounded-[24px] md:gap-6 align-middle">
          { children }
        </div>
      );
} 