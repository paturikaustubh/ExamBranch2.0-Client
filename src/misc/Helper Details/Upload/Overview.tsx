export default function UploadOverview() {
  return (
    <div className="flex flex-col gap-4">
      <span>
        In this page, you can upload results of regular/supplementary exams.
        Along with it, you can also upload the downloaded tables into the
        database if the database has lost it's data.
      </span>
      <span>
        You can also update the <code>Code Names</code> table from here. This
        table ensures that there is consistent data available in the database.
        Even Written Test related subjects information can be updated from here
        (CbtSubjects table).
      </span>
    </div>
  );
}
