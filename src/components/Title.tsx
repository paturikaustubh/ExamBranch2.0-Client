export default function Title({ title }: { title: string }) {
  return (
    <div className="flex no-print">
      <span className="page-title">{title}</span>
    </div>
  );
}
