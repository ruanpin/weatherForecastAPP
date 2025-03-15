export default function MyBox({ children }) {
    return (
          <div className="relative flex justify-between items-center px-6 md:px-8 py-4 bg-white w-full max-w-[800px] rounded-[16px]">
          { children }
        </div>
      );
} 