export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
      <div className="w-5 h-5 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin" />
      Loading...
    </div>
  );
}
