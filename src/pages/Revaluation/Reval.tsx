import PageLayout from "../../components/PageLayout";
import dayjs from "dayjs";
import { CustTextField } from "../../components/CustTextField";
import { useState } from "react";

export default function Reval() {
  // ANCHOR STATES && VARS  ||========================================================================
  const [rollNo, setRollNo] = useState("");
  const [examYear, setExamYear] = useState(dayjs().year());
  const [examMonth, setExamMonth] = useState(dayjs().month() + 1);

  console.log(
    rollNo.length !== 10,
    !(examMonth in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    !(examYear in [dayjs().year() - 1, dayjs().year()]),
    typeof examYear,
    typeof dayjs().year(),
    examYear
  );

  // ANCHOR JSX  ||========================================================================
  return (
    <PageLayout>
      <div className="flex">
        <span className="page-title">Revaluation</span>
      </div>

      <form
        className="grid grid-cols-6 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="col-span-1 row-start-1">
          <CustTextField
            label="Cost"
            defaultValue={new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(1000)}
            disabled
            inputProps={{ style: { textAlign: "right" } }}
          />
        </div>
        <div className="col-span-2 row-start-2 flex gap-4">
          <CustTextField
            type="number"
            label="Exam Year"
            InputProps={{
              inputProps: { min: dayjs().year() - 1, max: dayjs().year() },
            }}
            defaultValue={dayjs().year()}
          />
          <CustTextField
            type="number"
            label="Exam Month"
            InputProps={{
              inputProps: { min: 1, max: 12 },
            }}
            defaultValue={dayjs().month() + 1}
          />
        </div>
        <div className="row-start-3 col-span-3 grid grid-cols-3 gap-4 items-center">
          <CustTextField
            label="Roll Number"
            className="col-span-2"
            inputProps={{ maxLength: 10 }}
            value={rollNo}
            onChange={({ target: { value } }) => setRollNo(value.toUpperCase())}
          />
          <button
            type="submit"
            className="blue-button-filled col-span-1 mr-auto h-fit"
            // disabled={
            //   rollNo.length !== 10 ||
            //   !(examMonth in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) ||
            //   !(examYear in [dayjs().year() - 1, dayjs().year()])
            // }
          >
            Search
          </button>
        </div>
      </form>
    </PageLayout>
  );
}
