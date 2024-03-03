import { TextField } from "@mui/material";
import Title from "../../components/Title";
import Costs, { addcost, basecosts, maxcost } from "../../components/Costs";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ExamSearchSubjectsProps } from "../../Types/responseTypes";
import { AlertContext } from "../../components/Context/AlertDetails";
import { formatCost } from "../../misc/CostFormater";
import { Calculate, HowToRegOutlined, ListAltOutlined, SearchOutlined } from "@mui/icons-material";
import Axios from "axios";
import { CustTextField } from "../../components/Custom/CustTextField";
import { PrintDialog } from "../../components/Custom/PrintDialog";
import { CustAutocomplete } from "../../components/Custom/CustAutocomplete";
import { CustBarcode } from "../../components/Custom/Barcode";


export default function Supple() {

  const alert = useContext(AlertContext);
  const [rollNo, setRollNo] = useState("");
  const [availableSubs, setAvailableSubs] = useState<ExamSearchSubjectsProps>();
  const [selectedSubjects, setSelectedSubjects] =
    useState<ExamSearchSubjectsProps>();
  const [currDateTime, setCurrDateTime] = useState<string>(
    dayjs().format("DD MMM, YYYY (hh:mm A)")
  );
  const cost: number = 100
  const [studentCopyGenerated, setStudentCopyGenerated] = useState(false);
  const [searched, setSearched] = useState(false);
  const [printTable, setPrintTable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setCurrDateTime(dayjs().format("DD MMM, YYYY (hh:mm A)"));
    }, 500);
  }, []);
  const FormSectionHeader = ({
    copyType,
  }: {
    copyType: "Exam Branch" | "Student" | "Accounts";
  }) => (
    <div className="flex justify-around w-full items-center font-semibold mt-6">
      <span className="text-xl">{rollNo} (Supplementary)</span>
      <span className="text-3xl">{copyType} Copy</span>
      <span className="text-xl">{currDateTime}</span>
    </div>
  );

  const reset = () => {
    setPrintTable(false);
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
    const cost = (totalSubs >= 4 && totalSubs !== 0) ? maxcost : totalSubs > 0 ? basecosts + (totalSubs - 1) * addcost : 0
    return { cost, totalSubs };
  };
  
  return (
    <>
      <Title title="Supplementary" />
      <Costs />
      <form className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5 no-print"
        onSubmit={async (e) => {
          e.preventDefault();
          const { data } = await Axios.get(
            `api/supple/search?rollNo=${rollNo}`,
            {
              withCredentials: true,
            }
          );

          let totalLength = 0;
          if (data && data.subjectDetails) {
            let subjectDetails = data.subjectDetails;
            Object.keys(subjectDetails).forEach((key) => {
              totalLength += subjectDetails[key].subNames.length;
            });
          }

          if (totalLength > 0) {
            setShowForm(true);
            setSearched(true);
            setAvailableSubs(data.subjectDetails);
            setSelectedSubjects(data.subjectDetails);
            setPrintTable(data.printTableExist);
          } else alert?.showAlert("No data found", "warning");
        }

        }>

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
              setPrintTable(false);
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
            <div className="flex items-center gap-2">
             
              <button
                className="green-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
                type="button"
                onClick={async () => {
                  const { data } = await Axios.post(
                    `api/supple/paid/${rollNo}`,
                    {
                      selectedSubjects,
                      username: sessionStorage.getItem("username"),
                      grandTotal: calculateCostPerYear(1).cost + calculateCostPerYear(2).cost +
                      calculateCostPerYear(3).cost+ calculateCostPerYear(4).cost
                    }
                  );

                  if (data.done) {
                    alert?.showAlert(`Registered for ${rollNo}`, "success");
                    setPrintTable(false);
                    setShowForm(false);
                    setSearched(false);
                  } else {
                    alert?.showAlert(data.error, "error");
                  }
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
            <div className="flex flex-col space-y-2">
              <FormSectionHeader copyType={"Exam Branch"} />
              <SubDetails
                printTable={printTable}
                cost={cost}
                supplySubs={availableSubs as ExamSearchSubjectsProps}
                calculateCostPerYear = {
                  calculateCostPerYear
                }
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
                <div className="flex flex-col space-y-2">
                  <FormSectionHeader copyType={"Student"} />
                  <SubDetails
                    printTable={printTable}
                    cost={cost}
                    supplySubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={
                      calculateCostPerYear
                    }
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
                <div className=" flex flex-col space-y-2">
                  <FormSectionHeader copyType={"Accounts"} />
                  <SubDetails
                    printTable={printTable}
                    cost={cost}
                    supplySubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={
                      calculateCostPerYear
                    }
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
                  exam = "supple"
                  grandTotal={calculateCostPerYear(1).cost + calculateCostPerYear(2).cost +
                    calculateCostPerYear(3).cost+ calculateCostPerYear(4).cost}
                  setStudentCopyGenerated={setStudentCopyGenerated}
                  selectedSubjects={selectedSubjects as ExamSearchSubjectsProps}
                  printTable={printTable}
                  reset={reset}
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

function SubDetails({
  supplySubs,
  calculateCostPerYear,
  setSelectedSubjects,
  studentCopyGenerated,
  printTable,
}: {
  supplySubs: ExamSearchSubjectsProps;
  calculateCostPerYear: (year: 1 | 2 | 3 | 4 ) => {cost:number, totalSubs: number}
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchSubjectsProps>
  >;
  studentCopyGenerated: boolean;
  cost: number;
  printTable: boolean;
}) {
  // ANCHOR STATES && VARS  ||========================================================================
  const subsA = supplySubs["A"].subNames;
  const subsB = supplySubs["B"].subNames;
  const subsC = supplySubs["C"].subNames;
  const subsD = supplySubs["D"].subNames;
  const subsE = supplySubs["E"].subNames;
  const subsF = supplySubs["F"].subNames;
  const subsG = supplySubs["G"].subNames;
  const subsH = supplySubs["H"].subNames;


  // ANCHOR JSX  ||========================================================================
  return (
    <div className="flex flex-col gap-4 justify-center">
      {/* ANCHOR 1st YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsA}
          label="1-1"
          sem="A"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsB}
          label="1-2"
          sem="B"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(1).cost ? formatCost(calculateCostPerYear(1).cost) : "NA"}
        </div>
      </div>
      {/* ANCHOR 2nd YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsC}
          label="2-1"
          sem="C"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsD}
          label="2-2"
          sem="D"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(2).cost ? formatCost(calculateCostPerYear(2).cost) : "NA"}
        </div>
      </div>
      {/* ANCHOR 3rd YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsE}
          label="3-1"
          sem="E"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsF}
          label="3-2"
          sem="F"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(3).cost ? formatCost(calculateCostPerYear(3).cost) : "NA"}
        </div>
      </div>
      {/* ANCHOR 4th YEAR  ||=============================================================== */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <CustAutocomplete
          options={subsG}
          label="4-1"
          sem="G"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <CustAutocomplete
          options={subsH}
          label="4-2"
          sem="H"
          revalSubs={supplySubs}
          setSelectedSubjects={setSelectedSubjects}
          studentCopyGenerated={studentCopyGenerated}
          printTable={printTable}
        />
        <div className="col-span-2">
          {calculateCostPerYear(4).cost ? formatCost(calculateCostPerYear(4).cost) : "NA"}
        </div>
      </div>
      <span className="text-xl font-semibold mx-auto">
        Grand Total:{" "}
        {formatCost(
          calculateCostPerYear(1).cost +
          calculateCostPerYear(2).cost +
          calculateCostPerYear(3).cost +
          calculateCostPerYear(4).cost
        )}
        ({calculateCostPerYear(1).totalSubs +
          calculateCostPerYear(2).totalSubs +
          calculateCostPerYear(3).totalSubs +
          calculateCostPerYear(4).totalSubs} Subjects)
      </span>
    </div>
  );
}