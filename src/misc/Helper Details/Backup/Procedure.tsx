export default function BackupProcedure() {
  return (
    <div>
      <span>These are the steps to follow for this page</span>
      <ol
        style={{
          listStyle: "number",
          paddingLeft: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <li>
          To make a backup click on the <code>Create Backup</code> button and
          then your backup file will be downloaded.
        </li>
        <li>
          Remember the download location of this file. This will be useful for
          restoring the contents.
        </li>
        <li>
          For restoring, from the available drop down menu named Action, select{" "}
          <code>Restore</code>, then copy and paste the folder location of the
          backup file. The following image shows where you can find the folder
          location.
        </li>
        <img
          src="assets/HelperAssets/Backup Folder Location.png"
          alt="Folder Location"
          style={{ width: "80%", marginInline: "auto" }}
        />
        <li>
          Ensure that the name of the file is always <code>backup.xlsx</code>.
          Any file other than this name will be ignored. After uploading, the
          student’s details (studentinfo) table will be updated.
        </li>
      </ol>
    </div>
  );
}
