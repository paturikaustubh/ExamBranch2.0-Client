import dayjs from "dayjs";

export default function UploadParams() {
  return (
    <div>
      <p>
        <code className="text-red-600">Note!</code>{" "}
        <span className="font-semibold">
          Some parameters are applicable based on the type you select.
        </span>
      </p>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          marginTop: "0.5rem",
        }}
      >
        <li>
          <code>Type:</code> The type of data you want to upload.
        </li>
        <p className="font-semibold">
          For type <code>Result</code>
        </p>
        <li>
          <code>Year:</code> Academic year of the exam in the data. (ex: 1, 2,
          3, 4)
        </li>
        <li>
          <code>Semester:</code> Semester of the exam in the data. (ex: 1, 2)
        </li>
        <li>
          <code>Exam Year:</code> Year of the exam when it was conducted (ex:{" "}
          {dayjs().year()})
        </li>
        <li>
          <code>Exam Month:</code> Month of the exam when it was conducted (ex:{" "}
          {dayjs().month() + 1})
        </li>
        <li>
          <code></code>
        </li>
      </ul>
    </div>
  );
}
