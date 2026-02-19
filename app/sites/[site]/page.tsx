export default function SitePage({ params }: { params: { site: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">
        Welcome to {params.site}
      </h1>
      <p className="mt-4 text-xl">
        This is a generated site for {params.site}.
      </p>
    </div>
  );
}
