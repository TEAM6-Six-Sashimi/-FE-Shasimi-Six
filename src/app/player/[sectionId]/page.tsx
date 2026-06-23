import PlayerPage from './components/PlayerPage';

interface Props {
  params: Promise<{ sectionId: string }>;
}

export default async function Page({ params }: Props) {
  const { sectionId } = await params;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#F9FAFB]">
      <PlayerPage sectionId={sectionId} />
    </div>
  );
}
