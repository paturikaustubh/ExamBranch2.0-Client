import { useContext, useEffect, useState } from "react";

import dayjs from "dayjs";
import Axios from "axios";

import {
  HowToRegOutlined,
  ListAltOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";

import { CustTextField } from "../../components/Custom/CustTextField";
import { ExamSearchResponseProps } from "../../Types/responseTypes";
import { AlertContext } from "../../components/Context/AlertDetails";
import { formatCost } from "../../misc/CostFormater";
import { PrintDialog } from "../../components/Custom/PrintDialog";

export default function Reval() {
  // ANCHOR STATES && VARS  ||========================================================================
  const alert = useContext(AlertContext);

  const [rollNo, setRollNo] = useState("");
  const [examYear, setExamYear] = useState(dayjs().year());
  const [examMonth, setExamMonth] = useState(dayjs().month() + 1);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] =
    useState<ExamSearchResponseProps>();
  const [currDateTime, setCurrDateTime] = useState<string>(
    dayjs().format("DD MMM, YYYY (hh:mm A)")
  );
  const [studentCopyGenerated, setStudentCopyGenerated] = useState(false);
  const [searched, setSearched] = useState(false);
  const [printTable, setPrintTable] = useState(false);

  // ANCHOR EFFECTS  ||========================================================================
  useEffect(() => {
    setInterval(() => {
      setCurrDateTime(dayjs().format("DD MMM, YYYY (hh:mm A)"));
    }, 500);
  }, []);

  // ANCHOR FUNCTIONS  ||========================================================================
  const FormSectionHeader = ({
    copyType,
  }: {
    copyType: "Exam Branch" | "Student" | "Accounts";
  }) => (
    <div className="flex justify-around w-full items-center font-semibold mt-6">
      <span className="text-xl">{rollNo} (Revaluation)</span>
      <span className="text-3xl">{copyType} Copy</span>
      <span className="text-xl">{currDateTime}</span>
    </div>
  );

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <div className="flex no-print">
        <span className="page-title">Revaluation</span>
      </div>

      {/* ANCHOR REVAL FORM  ||======================================================================== */}
      <form
        className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4 no-print"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await Axios.get(
            `http://localhost:6969/api/reval/${rollNo}?examMonth=${examMonth}&examYear=${examYear}`
          );
          let totalLength = 0;
          if (data) {
            Object.keys(data).forEach((key) => {
              totalLength += data[key].subjNames.length;
            });
          }

          if (totalLength > 0) {
            setShowForm(true);
            setSearched(true);
            setSelectedSubjects(data);
          } else alert?.showAlert("No data found", "warning");
        }}
      >
        <div className="col-span-1 row-start-1">
          <CustTextField
            label="Cost"
            defaultValue={formatCost(1000)}
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
              setExamYear(parseInt(value));
              setShowForm(false);
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
              setExamMonth(parseInt(value));
              setShowForm(false);
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
            onChange={({ target: { value } }) => {
              setRollNo(value.toUpperCase());
              setShowForm(false);
              setStudentCopyGenerated(false);
              setSearched(false);
            }}
          />
          {!printTable ? (
            <button
              type="submit"
              className="blue-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
              disabled={rollNo.length !== 10 || searched}
            >
              <SearchOutlined />
              Search
            </button>
          ) : (
            <button
              className="green-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
              type="button"
            >
              <HowToRegOutlined />
              Register
            </button>
          )}
        </div>
      </form>

      {showForm && (
        <>
          <div className="flex mt-10">
            <div className="bg-white rounded-sm p-4 w-full">
              <div
                className="flex flex-col gap-8 divide-y divide-neutral-500"
                style={{
                  backgroundImage: "url(assets/LightLogo.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  // backgroundSize: "cover",
                  backgroundSize: "50%",
                }}
              >
                <div className="space-y-6">
                  <FormSectionHeader copyType={"Exam Branch"} />
                  <SubDetails
                    revalSubs={selectedSubjects as ExamSearchResponseProps}
                    selectedSubjects={
                      selectedSubjects as ExamSearchResponseProps
                    }
                    setSelectedSubjects={
                      setSelectedSubjects as React.Dispatch<
                        React.SetStateAction<ExamSearchResponseProps>
                      >
                    }
                    studentCopyGenerated={studentCopyGenerated}
                  />
                </div>
                {studentCopyGenerated ? (
                  <>
                    <div className="space-y-6">
                      <FormSectionHeader copyType={"Student"} />
                      <SubDetails
                        revalSubs={selectedSubjects as ExamSearchResponseProps}
                        selectedSubjects={
                          selectedSubjects as ExamSearchResponseProps
                        }
                        setSelectedSubjects={
                          setSelectedSubjects as React.Dispatch<
                            React.SetStateAction<ExamSearchResponseProps>
                          >
                        }
                        studentCopyGenerated={studentCopyGenerated}
                      />
                    </div>
                    <div className="space-y-6">
                      <FormSectionHeader copyType={"Accounts"} />
                      <SubDetails
                        revalSubs={selectedSubjects as ExamSearchResponseProps}
                        selectedSubjects={
                          selectedSubjects as ExamSearchResponseProps
                        }
                        setSelectedSubjects={
                          setSelectedSubjects as React.Dispatch<
                            React.SetStateAction<ExamSearchResponseProps>
                          >
                        }
                        studentCopyGenerated={studentCopyGenerated}
                      />
                    </div>
                    <PrintDialog rollNo={rollNo} />
                  </>
                ) : (
                  <button
                    className="blue-button-sm mr-auto flex items-center gap-2 no-print"
                    onClick={() => {
                      setStudentCopyGenerated(true);
                    }}
                  >
                    <ListAltOutlined /> Generate Form
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ANCHOR SUBJECTS DETAILS  ||========================================================================
function SubDetails({
  revalSubs,
  selectedSubjects,
  setSelectedSubjects,
  studentCopyGenerated,
}: {
  revalSubs: ExamSearchResponseProps;
  selectedSubjects: ExamSearchResponseProps;
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchResponseProps>
  >;
  studentCopyGenerated: boolean;
}) {
  // ANCHOR STATES && VARS  ||========================================================================
  const subsA = revalSubs["A"].subjNames;
  const subsB = revalSubs["B"].subjNames;
  const subsC = revalSubs["C"].subjNames;
  const subsD = revalSubs["D"].subjNames;
  const subsE = revalSubs["E"].subjNames;
  const subsF = revalSubs["F"].subjNames;
  const subsG = revalSubs["G"].subjNames;
  const subsH = revalSubs["H"].subjNames;

  // ANCHOR FUNCTIONS  ||========================================================================
  const calculateCostPerYear = (year: 1 | 2 | 3 | 4) => {
    let totalSubs = 0;
    switch (year) {
      case 1:
        totalSubs =
          selectedSubjects["A"].subjNames.length +
          selectedSubjects["B"].subjNames.length;

        break;
      case 2:
        totalSubs =
          selectedSubjects["C"].subjNames.length +
          selectedSubjects["D"].subjNames.length;
        break;
      case 3:
        totalSubs =
          selectedSubjects["E"].subjNames.length +
          selectedSubjects["F"].subjNames.length;
        break;
      case 4:
        totalSubs =
          selectedSubjects["G"].subjNames.length +
          selectedSubjects["H"].subjNames.length;
        break;
    }
    return totalSubs * 1000;
  };

  // ANCHOR JSX  ||========================================================================
  return (
    <div className="flex flex-col gap-4 justify-center">
      {/* ANCHOR 1st YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsA}
          label="1-1"
          sem="A"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
        />
        <CustAutocomplete
          options={subsB}
          label="1-2"
          sem="B"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
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
        />
        <CustAutocomplete
          options={subsD}
          label="2-2"
          sem="D"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
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
        />
        <CustAutocomplete
          options={subsF}
          label="3-2"
          sem="F"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
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
        />
        <CustAutocomplete
          options={subsH}
          label="4-2"
          sem="H"
          revalSubs={revalSubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
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
        )}
      </span>
    </div>
  );
}

// ANCHOR CUSTOM AUTOCOMPLETE  ||========================================================================
function CustAutocomplete({
  options,
  label,
  sem,
  revalSubs,
  setSelectedSubjects,
  studentCopyGenerated,
}: {
  options: string[];
  label: string;
  sem: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  revalSubs: ExamSearchResponseProps;
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchResponseProps>
  >;
  studentCopyGenerated: boolean;
}) {
  return (
    <Autocomplete
      multiple
      options={options}
      value={[...options]}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      fullWidth
      sx={{ bgcolor: "white" }}
      className="col-span-5 rounded-md"
      disabled={options.length === 0}
      readOnly={studentCopyGenerated}
      onChange={(_, newValue) => {
        const selectedCodes = newValue.map((selectedSubject) => {
          const indx = revalSubs[sem].subjNames.findIndex(
            (value) => value === selectedSubject
          );
          return revalSubs[sem].subjCodes[indx];
        });
        setSelectedSubjects((prevState) => ({
          ...prevState,
          [sem]: {
            subjNames: newValue,
            subjCodes: selectedCodes,
          },
        }));
      }}
    />
  );
}
