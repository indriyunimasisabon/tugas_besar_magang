export default function MonthlySalesChart() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="items-center justify-between pb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          CCTV 1
        </h3>

        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          View Room
        </p>
        <div className="flex items-center justify-center m-4 h-80 bg-gray-200 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 ">
            COMING SOON
          </h3>
        </div>
      </div>
    </div>
  );
}
