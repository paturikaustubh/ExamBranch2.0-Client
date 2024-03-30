import { useContext, useEffect, useLayoutEffect, useState } from "react";

import dayjs from "dayjs";
import Axios from "axios";

import {
  HowToRegOutlined,
  ListAltOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import { CustTextField } from "../../components/Custom/CustTextField";
import { ExamSearchSubjectsProps } from "../../Types/responseTypes";
import { AlertContext } from "../../components/Context/AlertDetails";
import { formatCost } from "../../misc/CostFormater";
import { PrintDialog } from "../../components/Custom/PrintDialog";
import { CustBarcode } from "../../components/Custom/Barcode";
import { CustAutocomplete } from "../../components/Custom/CustAutocomplete";
import { MenuItem } from "@mui/material";
import { LoadingContext } from "../../components/Context/Loading";

export default function Reval() {
  // ANCHOR STATES && VARS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [rollNo, setRollNo] = useState("");
  const [examYear, setExamYear] = useState(dayjs().year());
  const [examMonth, setExamMonth] = useState(dayjs().month() + 1);
  const [showForm, setShowForm] = useState(false);
  const [availableSubs, setAvailableSubs] = useState<ExamSearchSubjectsProps>();
  const [selectedSubjects, setSelectedSubjects] =
    useState<ExamSearchSubjectsProps>();
  const [currDateTime, setCurrDateTime] = useState<string>(
    dayjs().format("DD MMM, YYYY (hh:mm A)")
  );
  const [studentCopyGenerated, setStudentCopyGenerated] = useState(false);
  const [searched, setSearched] = useState(false);
  const [printTable, setPrintTable] = useState(false);
  const [cost, setCost] = useState(69);
  const [regular, setRegular] = useState("0");
  const [lastSem, setLastSem] = useState("A");

  // ANCHOR EFFECTS  ||========================================================================
  useEffect(() => {
    setInterval(() => {
      setCurrDateTime(dayjs().format("DD MMM, YYYY (hh:mm A)"));
    }, 500);
  }, []);

  useLayoutEffect(() => {
    Axios.get(`api/cost/costs?module=reval`)
      .then(({ data: { rev } }: { data: { rev: number } }) => {
        setCost(rev);
      })
      .catch(() =>
        alert?.showAlert(
          "There was an error while connecting to the server",
          "error"
        )
      );
  }, []);

  // ANCHOR FUNCTIONS  ||========================================================================
  const FormSectionHeader = ({
    copyType,
  }: {
    copyType: "Exam Branch" | "Student" | "Accounts";
  }) => (
    <div className="flex justify-around w-full items-center font-semibold mt-4">
      <span className="lg:text-xl text-lg">{rollNo} (Revaluation)</span>
      <span className="lg:text-3xl text-2xl">{copyType} Copy</span>
      <span className="lg:text-xl text-lg">{currDateTime}</span>
    </div>
  );

  // Reset the values when print taken or registered
  const reset = () => {
    setPrintTable(false);
    setRegular("0");
    setShowForm(false);
    setSearched(false);
    setStudentCopyGenerated(false);
  };

  const calculateCostPerYear = (year: 1 | 2 | 3 | 4) => {
    let totalSubs = 0;
    switch (year) {
      case 1:
        totalSubs =
          (selectedSubjects as ExamSearchSubjectsProps)["A"].subNames.length +
          (selectedSubjects as ExamSearchSubjectsProps)["B"].subNames.length;

        break;
      case 2:
        totalSubs =
          (selectedSubjects as ExamSearchSubjectsProps)["C"].subNames.length +
          (selectedSubjects as ExamSearchSubjectsProps)["D"].subNames.length;
        break;
      case 3:
        totalSubs =
          (selectedSubjects as ExamSearchSubjectsProps)["E"].subNames.length +
          (selectedSubjects as ExamSearchSubjectsProps)["F"].subNames.length;
        break;
      case 4:
        totalSubs =
          (selectedSubjects as ExamSearchSubjectsProps)["G"].subNames.length +
          (selectedSubjects as ExamSearchSubjectsProps)["H"].subNames.length;
        break;
    }
    return totalSubs * 1000;
  };

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      {/* ANCHOR REVAL FORM  ||======================================================================== */}
      <form
        className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4 no-print"
        onSubmit={(e) => {
          e.preventDefault();
          loading?.showLoading(true);

          Axios.get(
            `api/reval/search?rollNo=${rollNo}&exMonth=${examMonth}&exYear=${examYear}`
          )
            .then(({ data }) => {
              const {
                subjects,
                printTableExist,
                error,
              }: {
                subjects: ExamSearchSubjectsProps;
                printTableExist: boolean;
                error: { message: string };
              } = data;

              if (!error) {
                setPrintTable(printTableExist);
                let totalLength = 0;
                if (subjects) {
                  setLastSem(() => {
                    const keysArr = Object.keys(subjects).filter(
                      (subjectKey) =>
                        subjects[subjectKey as keyof ExamSearchSubjectsProps]
                          .subCodes.length > 0
                    );
                    return keysArr[keysArr.length - 1];
                  });

                  Object.keys(subjects).forEach((key) => {
                    totalLength +=
                      subjects[key as keyof ExamSearchSubjectsProps].subNames
                        .length;
                  });
                }

                if (totalLength > 0) {
                  setShowForm(true);
                  setSearched(true);
                  setAvailableSubs(subjects);
                  setSelectedSubjects(subjects);
                } else alert?.showAlert("No data found", "warning");
              } else {
                alert?.showAlert(error.message, "error");
              }
            })
            .catch(() =>
              alert?.showAlert(
                "There was an error while connecting to the server",
                "error"
              )
            )
            .finally(() => loading?.showLoading(false));
        }}
      >
        <div className="col-span-1 row-start-1">
          <CustTextField
            label="Cost"
            value={formatCost(cost)}
            onChange={() => {}}
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
            onChange={({ target: { value } }) => {
              setExamYear(
                parseInt(value) > 0 ? parseInt(value) : dayjs().year() - 1
              );
              setShowForm(false);
              setPrintTable(false);
              setSearched(false);
            }}
            value={examYear}
          />
          <CustTextField
            type="number"
            label="Exam Month"
            InputProps={{
              inputProps: { min: 1, max: 12 },
            }}
            onChange={({ target: { value } }) => {
              setExamMonth(parseInt(value) > 0 ? parseInt(value) : 0);
              setShowForm(false);
              setPrintTable(false);
              setSearched(false);
            }}
            value={examMonth}
          />
        </div>
        <div className="row-start-3 col-span-3 grid md:grid-cols-3 grid-cols-2 gap-4 items-center">
          <CustTextField
            label="Roll Number"
            className="lg:col-span-2 col-span-1"
            inputProps={{ maxLength: 10 }}
            value={rollNo}
            autoFocus
            onChange={({ target: { value } }) => {
              setRollNo(value.toUpperCase());
              setShowForm(false);
              setStudentCopyGenerated(false);
              setSearched(false);
              setPrintTable(false);
            }}
          />
          {!printTable ? (
            <button
              type="submit"
              className="blue-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
              disabled={rollNo.length !== 10 || searched}
            >
              <SearchOutlined fontSize="small" />
              Search
            </button>
          ) : (
            <div className="flex items-center col-span-1 gap-1">
              <CustTextField
                select
                label="Regular"
                value={regular}
                onChange={({ target: { value } }) => setRegular(value)}
              >
                <MenuItem value="0">None</MenuItem>
                <MenuItem value={lastSem}>
                  {lastSem === "A"
                    ? "1-1"
                    : lastSem === "B"
                    ? "1-2"
                    : lastSem === "C"
                    ? "2-1"
                    : lastSem === "D"
                    ? "2-2"
                    : lastSem === "E"
                    ? "3-1"
                    : lastSem === "F"
                    ? "3-2"
                    : lastSem === "G"
                    ? "4-1"
                    : "4-2"}
                </MenuItem>
              </CustTextField>
              <button
                className="green-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
                type="button"
                onClick={() => {
                  loading?.showLoading(true);

                  Axios.post(`api/reval/paid/${rollNo}`, {
                    subjects: selectedSubjects,
                    username: sessionStorage.getItem("username"),
                    regular,
                    grandTotal:
                      calculateCostPerYear(1) +
                      calculateCostPerYear(2) +
                      calculateCostPerYear(3) +
                      calculateCostPerYear(4),
                  })
                    .then(
                      ({
                        data: { done, error },
                      }: {
                        data: { done: boolean; error: string };
                      }) => {
                        if (done) {
                          alert?.showAlert(
                            `Registered for ${rollNo}`,
                            "success"
                          );
                          reset();
                        } else {
                          alert?.showAlert(error, "error");
                        }
                      }
                    )
                    .catch(() =>
                      alert?.showAlert(
                        "There was an error while connecting to the server.",
                        "error"
                      )
                    )
                    .finally(() => loading?.showLoading(false));
                }}
              >
                <HowToRegOutlined />
                Register
              </button>
            </div>
          )}
        </div>
      </form>

      {showForm && (
        <div className="bg-white rounded-sm p-4 w-full mt-5">
          <div
            className="flex flex-col gap-4 divide-y divide-neutral-500"
            style={{
              backgroundImage: studentCopyGenerated
                ? `url(assets/LightLogo.png)`
                : "",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "60%",
            }}
          >
            {/* EXAM BRANCH COPY ||==================================================== */}
            <div className="flex flex-col space-y-2">
              <FormSectionHeader copyType={"Exam Branch"} />
              <SubDetails
                printTable={printTable}
                cost={cost}
                revalSubs={availableSubs as ExamSearchSubjectsProps}
                calculateCostPerYear={calculateCostPerYear}
                setSelectedSubjects={
                  setSelectedSubjects as React.Dispatch<
                    React.SetStateAction<ExamSearchSubjectsProps>
                  >
                }
                studentCopyGenerated={studentCopyGenerated}
              />
              <CustBarcode rollNo={rollNo} />
            </div>
            {studentCopyGenerated ? (
              <>
                {/* STUDENT COPY ||==================================================== */}
                <div className="flex flex-col space-y-2">
                  <FormSectionHeader copyType={"Student"} />
                  <SubDetails
                    printTable={printTable}
                    cost={cost}
                    revalSubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={calculateCostPerYear}
                    setSelectedSubjects={
                      setSelectedSubjects as React.Dispatch<
                        React.SetStateAction<ExamSearchSubjectsProps>
                      >
                    }
                    studentCopyGenerated={studentCopyGenerated}
                  />
                  <CustBarcode rollNo={rollNo} />
                  <span className="mx-auto text-lg text-center font-bold">
                    AFTER PAYING THE FEE IN ACCOUNTS SECTION, THE RECEIPT MUST
                    BE SUBMITTED IN THE EXAM BRANCH TO COMPLETE YOUR
                    REGISTRATION
                  </span>
                </div>
                {/* ACCOUNTS COPY ||==================================================== */}
                <div className=" flex flex-col space-y-2">
                  <FormSectionHeader copyType={"Accounts"} />
                  <SubDetails
                    printTable={printTable}
                    cost={cost}
                    revalSubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={calculateCostPerYear}
                    setSelectedSubjects={
                      setSelectedSubjects as React.Dispatch<
                        React.SetStateAction<ExamSearchSubjectsProps>
                      >
                    }
                    studentCopyGenerated={studentCopyGenerated}
                  />
                  <CustBarcode rollNo={rollNo} />
                </div>
                <PrintDialog
                  rollNo={rollNo}
                  exam="reval"
                  setStudentCopyGenerated={setStudentCopyGenerated}
                  selectedSubjects={selectedSubjects as ExamSearchSubjectsProps}
                  printTable={printTable}
                  reset={reset}
                  grandTotal={
                    calculateCostPerYear(1) +
                    calculateCostPerYear(2) +
                    calculateCostPerYear(3) +
                    calculateCostPerYear(4)
                  }
                />
              </>
            ) : (
              <button
                className="blue-button ml-auto border-none flex items-center gap-2 no-print"
                onClick={() => {
                  setStudentCopyGenerated(true);
                }}
                disabled={
                  selectedSubjects &&
                  Object.keys(
                    selectedSubjects as ExamSearchSubjectsProps
                  ).reduce(
                    (acc, key) =>
                      acc +
                      selectedSubjects[key as keyof ExamSearchSubjectsProps]
                        .subNames.length,
                    0
                  ) === 0
                }
              >
                <ListAltOutlined /> Generate Form
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ANCHOR SUBJECTS DETAILS  ||========================================================================
function SubDetails({
  revalSubs,
  calculateCostPerYear,
  setSelectedSubjects,
  studentCopyGenerated,
  cost,
  printTable,
}: {
  revalSubs: ExamSearchSubjectsProps;
  calculateCostPerYear: (year: 1 | 2 | 3 | 4) => number;
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchSubjectsProps>
  >;
  studentCopyGenerated: boolean;
  cost: number;
  printTable: boolean;
}) {
  // ANCHOR STATES && VARS  ||========================================================================
  const subsA = revalSubs["A"].subNames;
  const subsB = revalSubs["B"].subNames;
  const subsC = revalSubs["C"].subNames;
  const subsD = revalSubs["D"].subNames;
  const subsE = revalSubs["E"].subNames;
  const subsF = revalSubs["F"].subNames;
  const subsG = revalSubs["G"].subNames;
  const subsH = revalSubs["H"].subNames;

  // ANCHOR FUNCTIONS  ||========================================================================

  // ANCHOR JSX  ||========================================================================
  return (
    <div className="flex flex-col gap-x-4 gap-y-4 justify-center">
      {/* ANCHOR 1st YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsA}
          label="1-1"
          sem="A"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsB}
          label="1-2"
          sem="B"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(1) ? formatCost(calculateCostPerYear(1)) : "NA"}
        </div>
      </div>
      {/* ANCHOR 2nd YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsC}
          label="2-1"
          sem="C"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsD}
          label="2-2"
          sem="D"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(2) ? formatCost(calculateCostPerYear(2)) : "NA"}
        </div>
      </div>
      {/* ANCHOR 3rd YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsE}
          label="3-1"
          sem="E"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsF}
          label="3-2"
          sem="F"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(3) ? formatCost(calculateCostPerYear(3)) : "NA"}
        </div>
      </div>
      {/* ANCHOR 4th YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsG}
          label="4-1"
          sem="G"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsH}
          label="4-2"
          sem="H"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(4) ? formatCost(calculateCostPerYear(4)) : "NA"}
        </div>
      </div>
      <span className="text-xl font-semibold mx-auto">
        Grand Total:{" "}
        {formatCost(
          calculateCostPerYear(1) +
            calculateCostPerYear(2) +
            calculateCostPerYear(3) +
            calculateCostPerYear(4)
        )}{" "}
        (
        {(calculateCostPerYear(1) +
          calculateCostPerYear(2) +
          calculateCostPerYear(3) +
          calculateCostPerYear(4)) /
          cost}{" "}
        subjects )
      </span>
    </div>
  );
}
