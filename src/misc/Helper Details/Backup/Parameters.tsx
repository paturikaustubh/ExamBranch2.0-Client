export default function BackupParams() {
  return (
    <ul
      style={{
        listStyle: "disc",
        paddingLeft: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
      }}
    >
      <li>
        <code>Folder Location:</code> The folder location of the backup file.
      </li>
    </ul>
  );
}
