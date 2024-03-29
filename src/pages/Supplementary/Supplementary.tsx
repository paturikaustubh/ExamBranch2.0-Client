import Title from "../../components/Title";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { ExamSearchSubjectsProps } from "../../Types/responseTypes";
import { AlertContext } from "../../components/Context/AlertDetails";
import { formatCost } from "../../misc/CostFormater";
import {
  HowToRegOutlined,
  ListAltOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import Axios from "axios";
import { CustTextField } from "../../components/Custom/CustTextField";
import { PrintDialog } from "../../components/Custom/PrintDialog";
import { CustAutocomplete } from "../../components/Custom/CustAutocomplete";
import { CustBarcode } from "../../components/Custom/Barcode";
import Costs from "../../components/Costs";

export default function Supple() {
  const alert = useContext(AlertContext);

  const [costs, setCosts] = useState({
    sbc: 0,
    sac: 0,
    sfc: 0,
    cbc: 0,
    cac: 0,
    cfc: 0
  });
  const [fine, setFine] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0
  });

  const [rollNo, setRollNo] = useState("");
  const [availableSubs, setAvailableSubs] = useState<ExamSearchSubjectsProps>();
  const [selectedSubjects, setSelectedSubjects] =
    useState<ExamSearchSubjectsProps>();
  const [currDateTime, setCurrDateTime] = useState<string>(
    dayjs().format("DD MMM, YYYY (hh:mm A)")
  );
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
    setRollNo("");
    setPrintTable(false);
    setShowForm(false);
    setSearched(false);
    setStudentCopyGenerated(false);
  };


  const calculateCostPerYear = (year: 1 | 2 | 3 | 4) => {
    let totalSubs = 0;
    let fines = 0;
    let A = 0, B = 0;
    switch (year) {
      case 1:
        A = (selectedSubjects as ExamSearchSubjectsProps)["A"].subNames.length;
        B = (selectedSubjects as ExamSearchSubjectsProps)["B"].subNames.length;
        totalSubs = A + B;
        (A != 0 && B != 0) ? fines = fine.A + fine.B : (A == 0) ? fines = fine.B : fines = fine.A;
        break;
      case 2:
        A = (selectedSubjects as ExamSearchSubjectsProps)["C"].subNames.length;
        B = (selectedSubjects as ExamSearchSubjectsProps)["D"].subNames.length;
        totalSubs = A + B;
        (A != 0 && B != 0) ? fines = fine.C + fine.D : (A == 0) ? fines = fine.D : fines = fine.C;
        break;
      case 3:
        A = (selectedSubjects as ExamSearchSubjectsProps)["E"].subNames.length;
        B = (selectedSubjects as ExamSearchSubjectsProps)["F"].subNames.length;
        totalSubs = A + B;
        (A != 0 && B != 0) ? fines = fine.E + fine.F : (A == 0) ? fines = fine.F : fines = fine.E;
        break;
      case 4:
        A = (selectedSubjects as ExamSearchSubjectsProps)["G"].subNames.length;
        B = (selectedSubjects as ExamSearchSubjectsProps)["H"].subNames.length;
        totalSubs = A + B;
        (A != 0 && B != 0) ? fines = fine.G + fine.H : (A == 0) ? fines = fine.H : fines = fine.G;
        break;
    }
    const maxCost = costs.sfc;
    const baseCosts = costs.sbc;
    const addCost = costs.sac;

    let cost1 =
      A >= 4
        ? maxCost
        : A > 0
          ? baseCosts + (A - 1) * addCost
          : 0;
    let cost2 =
      B >= 4
        ? maxCost
        : B > 0
          ? baseCosts + (B - 1) * addCost
          : 0;
    if(A > 0 && B > 0){cost1 = cost1; cost2 = cost2 + fines } 
    (A === 0 && B > 0) ? cost2 = cost2 + fines : (A > 0 && B === 0) ? cost1 = cost1 + fines : 0;
    return { cost: cost1 + cost2, totalSubs, A, B };
  };

  return (
    <>
      <Title title="Supplementary" />
      <Costs
        costs={costs}
        setCosts={setCosts}
        fine={fine}
        setFine={setFine}
      />
      <form
        className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-4 no-print"
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
        }}
      >
        <div className="row-start-2 col-span-3 grid md:grid-cols-3 grid-cols-2 gap-4 items-center">
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
              <button
                className="green-button-filled col-span-1 mr-auto h-fit flex items-center gap-2"
                type="button"
                onClick={async () => {
                  const { data } = await Axios.post(
                    `api/supple/paid/${rollNo}`,
                    {
                      subjects: selectedSubjects,
                      username: sessionStorage.getItem("username"),
                      grandTotal:
                        calculateCostPerYear(1).cost +
                        calculateCostPerYear(2).cost +
                        calculateCostPerYear(3).cost +
                        calculateCostPerYear(4).cost,
                    }
                  );

                  if (data.done) {
                    alert?.showAlert(`Registered for ${rollNo}`, "success");
                    setRollNo("");
                    setPrintTable(false);
                    setShowForm(false);
                    setSearched(false);
                  } else {
                    alert?.showAlert(data.error.message, "error");
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
                supplySubs={availableSubs as ExamSearchSubjectsProps}
                calculateCostPerYear={calculateCostPerYear}
                setSelectedSubjects={
                  setSelectedSubjects as React.Dispatch<
                    React.SetStateAction<ExamSearchSubjectsProps>
                  >
                }
                studentCopyGenerated={studentCopyGenerated}
                fine={fine}
              />
              <CustBarcode rollNo={rollNo} />
            </div>
            {studentCopyGenerated ? (
              <>
                <div className="flex flex-col space-y-2">
                  <FormSectionHeader copyType={"Student"} />
                  <SubDetails
                    printTable={printTable}
                    supplySubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={calculateCostPerYear}
                    setSelectedSubjects={
                      setSelectedSubjects as React.Dispatch<
                        React.SetStateAction<ExamSearchSubjectsProps>
                      >
                    }
                    studentCopyGenerated={studentCopyGenerated}
                    fine={fine}
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
                    supplySubs={selectedSubjects as ExamSearchSubjectsProps}
                    calculateCostPerYear={calculateCostPerYear}
                    setSelectedSubjects={
                      setSelectedSubjects as React.Dispatch<
                        React.SetStateAction<ExamSearchSubjectsProps>
                      >
                    }
                    studentCopyGenerated={studentCopyGenerated}
                    fine={fine}
                  />
                  <CustBarcode rollNo={rollNo} />
                </div>
                <PrintDialog
                  rollNo={rollNo}
                  exam="supple"
                  grandTotal={
                    calculateCostPerYear(1).cost +
                    calculateCostPerYear(2).cost +
                    calculateCostPerYear(3).cost +
                    calculateCostPerYear(4).cost
                  }
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
  fine,
}: {
  supplySubs: ExamSearchSubjectsProps;
  calculateCostPerYear: (year: 1 | 2 | 3 | 4) => {
    cost: number;
    totalSubs: number;
    A: number;
    B: number;
  };
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchSubjectsProps>
  >;
  studentCopyGenerated: boolean;
  printTable: boolean;
  fine: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    G: number;
    H: number;
  };
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
          {calculateCostPerYear(1).cost
            ? (calculateCostPerYear(1).A > 0 && calculateCostPerYear(1).B > 0) ? `${formatCost(calculateCostPerYear(1).cost)} Fine(${formatCost(fine.A)} + ${formatCost(fine.B)}) ` :
              (calculateCostPerYear(1).B > 0) ? `${formatCost(calculateCostPerYear(1).cost)} Fine(${formatCost(fine.B)})` :
                `${formatCost(calculateCostPerYear(1).cost)} Fine(${formatCost(fine.A)})`
            : "NA"}
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
          {calculateCostPerYear(2).cost
            ? (calculateCostPerYear(2).A > 0 && calculateCostPerYear(2).B > 0) ? `${formatCost(calculateCostPerYear(2).cost)} Fine(${formatCost(fine.C)} + ${formatCost(fine.D)}) ` :
              (calculateCostPerYear(2).B > 0) ? `${formatCost(calculateCostPerYear(2).cost)} Fine(${formatCost(fine.D)})` :
                `${formatCost(calculateCostPerYear(2).cost)} Fine(${formatCost(fine.C)})`
            : "NA"}
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
          {calculateCostPerYear(3).cost
            ? (calculateCostPerYear(3).A > 0 && calculateCostPerYear(3).B > 0) ? `${formatCost(calculateCostPerYear(3).cost)} Fine(${formatCost(fine.E)} + ${formatCost(fine.F)}) ` :
              (calculateCostPerYear(3).B > 0) ? `${formatCost(calculateCostPerYear(3).cost)} Fine(${formatCost(fine.F)})` :
                `${formatCost(calculateCostPerYear(3).cost)} Fine(${formatCost(fine.E)})`
            : "NA"}
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
          {calculateCostPerYear(4).cost
            ? (calculateCostPerYear(4).A > 0 && calculateCostPerYear(4).B > 0) ? `${formatCost(calculateCostPerYear(4).cost)} Fine(${formatCost(fine.G)} + ${formatCost(fine.H)}) ` :
              (calculateCostPerYear(4).B > 0) ? `${formatCost(calculateCostPerYear(4).cost)} Fine(${formatCost(fine.H)})` :
                `${formatCost(calculateCostPerYear(4).cost)} Fine(${formatCost(fine.G)})`
            : "NA"}
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
        (
        {calculateCostPerYear(1).totalSubs +
          calculateCostPerYear(2).totalSubs +
          calculateCostPerYear(3).totalSubs +
          calculateCostPerYear(4).totalSubs}{" "}
        Subjects)
      </span>
    </div>
  );
}
