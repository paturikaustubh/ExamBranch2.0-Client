export function DownProcedure() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span>
          For <code>Download</code>
        </span>
        <ol
          style={{
            listStyle: "number",
            paddingLeft: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          <li>
            Select the type of exam whose details you want to download. Then
            select the <code>Academic Year</code> and the <code>Semester</code>{" "}
            for downloading specific details.
          </li>
          <li>
            Now select the type of download and click on download button to
            download an excel file with the related data.
          </li>
        </ol>
      </div>
      <hr />
      <div>
        <span>
          For <code>Truncate</code>
        </span>
        <ol
          style={{
            listStyle: "number",
            paddingLeft: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "0.5rem",
          }}
        ></ol>
      </div>
    </div>
  );
}
