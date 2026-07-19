export default function RecomResultSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* 채용 공고 요약 */}
      <section className="bg-white rounded-2xl shadow-md p-8 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-4 border-l border-[#E5E7EB] pl-8">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-4/5 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* 공고 적합도 분석 */}
      <section className="bg-white rounded-2xl shadow-md p-8 animate-pulse">
        <div className="h-5 w-36 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* 추천 자격증 */}
      <section className="bg-white rounded-2xl shadow-md p-8 animate-pulse">
        <div className="h-5 w-28 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* 추천 강의 */}
      <section className="bg-white rounded-2xl shadow-md p-8 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-5" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-30 h-20 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
