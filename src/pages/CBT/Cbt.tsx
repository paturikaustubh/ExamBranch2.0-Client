// React Elements
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Axios from "axios";
// Material UI Components
import { Autocomplete, MenuItem } from "@mui/material";
import {
  HowToRegOutlined,
  ListAltOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
// Custom Components
import { CustTextField } from "../../components/Custom/CustTextField";
import { CustBarcode } from "../../components/Custom/Barcode";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { ExamSemProps } from "../../Types/responseTypes";
import { formatCost } from "../../misc/CostFormater";
import { Print } from "../../components/Custom/Print";

export default function CBT() {
  // Contexts
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  // States
  const [examYear, setExamYear] = useState(dayjs().year());
  const [branch, setBranch] = useState<string>("");
  const [year, setYear] = useState<number>(0);
  const [semester, setSemester] = useState<number>(0);
  const [rollNo, setRollNo] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [currDateTime, setCurrDateTime] = useState<string>("");
  const [generateForm, setGenerateForm] = useState<boolean>(false);
  const [subCodes, setSubCodes] = useState<string[]>([]);
  const [subNames, setSubNames] = useState<string[]>([]);
  const [printTableExist, setPrintTableExist] = useState<boolean>(false);
  const [empty, setEmpty] = useState<boolean>(false);
  const [baseCost, setBaseCost] = useState<number>(0);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [maxCost, setMaxCost] = useState<number>(0);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedSubjectNames, setSelectedSubjectNames] = useState<string[]>(
    []
  );
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  let subs: string[] = [];
  // Effects
  useEffect(() => {
    setInterval(() => {
      setCurrDateTime(dayjs().format("DD MMM, YYYY (hh:mm A)"));
    }, 500);
  }, []);
  useEffect(() => {
    Axios.get(`api/cbt/branchs`).then((response) => {
      setBranches(response.data["branch"]);
      setYears(response.data["acYear"]);
      setSemesters(response.data["sem"]);
    });
    Axios.get(`api/cost/costs?module=cbt`).then((response) => {
      setBaseCost(response.data["cbc"]);
      setAdditionalCost(response.data["cac"]);
      setMaxCost(response.data["cfc"]);
    });
  }, [false]);
  // Functions
  const FormSectionHeader = ({
    copyType,
  }: {
    copyType: "Exam Branch" | "Student" | "Accounts";
  }) => (
    <div className="flex justify-around w-full items-center font-semibold mt-4">
      <span className="lg:text-xl text-lg">{rollNo} (CBT)</span>
      <span className="lg:text-3xl text-2xl">{copyType} Copy</span>
      <span className="lg:text-xl text-lg">{currDateTime}</span>
    </div>
  );
  const CalcTotalCost = () => {
    if (subs.length > 0) {
      if (subs.length === 1) {
        setGrandTotal(baseCost);
      } else if (subs.length >= 5) {
        setGrandTotal(maxCost);
      } else {
        if (!isNaN(baseCost) && !isNaN(additionalCost)) {
          let b = baseCost;
          let ad = additionalCost;
          setGrandTotal(b + ad * (subs.length - 1));
        }
      }
    } else {
      setGrandTotal(0);
    }
  };
  const reset = () => {
    setPrintTableExist(false);
    setSearched(false);
    setGenerateForm(false);
  };
  return (
    <div>
      <div className="flex justify-center"></div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {
          <>
            <CustTextField
              label={"Base Cost"}
              className="text-justify"
              value={formatCost(baseCost)}
              disabled
              inputProps={{ style: { textAlign: "right" } }}
            />
            <CustTextField
              label={"Additional Cost"}
              value={formatCost(additionalCost)}
              disabled
              inputProps={{ style: { textAlign: "right" } }}
            />
            <CustTextField
              label={"Max Cost"}
              value={formatCost(maxCost)}
              disabled
              inputProps={{ style: { textAlign: "right" } }}
            />
          </>
        }
      </div>
      <form
        className="no-print"
        onSubmit={(e) => {
          e.preventDefault();
          onchange = () => {
            setSearched(false);
          };
          loading?.showLoading(true);
          Axios.get(
            `api/cbt/search?acYear=${year}&sem=${semester}&reg=${examYear}&branch=${branch}&rollNo=${rollNo}`
          )
            .then(({ data }) => {
              const {
                error,
              }: {
                error: { message: string };
              } = data;
              if (!error) {
                if (data.subCodes.length) {
                  setSubCodes(data.subCodes);
                  setSubNames(data.subNames);
                  setSelectedSubjectNames(data.subNames);
                  subs.push(data.subCodes);
                  setPrintTableExist(data.printTableExist);
                  setSearched(true);
                } else {
                  alert?.showAlert("No data found", "warning");
                }
              } else {
                alert?.showAlert(error.message, "error");
              }
            })
            .catch(() => {
              alert?.showAlert(
                "There was an error while connecting to the server",
                "error"
              );
            })
            .finally(() => {
              loading?.showLoading(false);
            });
        }}
      >
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4 py-4">
          <CustTextField
            type="number"
            label="Exam Year"
            onChange={({ target: { value } }) => {
              setExamYear(
                parseInt(value) > 0 ? parseInt(value) : dayjs().year() - 1
              );
              setSearched(false);
              setGenerateForm(false);
            }}
            InputProps={{
              inputProps: { min: dayjs().year() - 1, max: dayjs().year() },
            }}
            value={examYear}
          />
          <CustTextField
            select
            label="Branch"
            className="col-span-1"
            defaultValue={""}
            onChange={({ target: { value } }) => {
              setBranch(value);
              setSearched(false);
              setGenerateForm(false);
            }}
          >
            {branches.map((value, indx) => {
              return (
                <MenuItem value={value} key={indx}>
                  {value}
                </MenuItem>
              );
            })}
          </CustTextField>
        </div>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
          <CustTextField
            select
            label="Year"
            className="col-span-1"
            defaultValue={""}
            onChange={({ target: { value } }) => {
              setYear(parseInt(value));
              setSearched(false);
              setGenerateForm(false);
            }}
          >
            {years.map((year, indx) => (
              <MenuItem value={year} key={indx}>
                {year}
              </MenuItem>
            ))}
          </CustTextField>
          <CustTextField
            select
            label="Semester"
            className="col-span-1"
            defaultValue={""}
            onChange={({ target: { value } }) => {
              setSemester(parseInt(value));
              setSearched(false);
              setGenerateForm(false);
            }}
          >
            {semesters.map((sem, indx) => (
              <MenuItem value={sem} key={indx}>
                {sem}
              </MenuItem>
            ))}
          </CustTextField>
        </div>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4 py-4">
          <CustTextField
            label="Roll Number"
            className="col-span-2"
            value={rollNo}
            autoFocus
            inputProps={{ maxLength: 10 }}
            onChange={({ target: { value } }) => {
              setRollNo(value.toUpperCase());
              setSearched(false);
              setGenerateForm(false);
            }}
          />
          <div className="col-span-3 flex items-center">
            {!printTableExist && (
              <button
                type="submit"
                className="blue-button-filled mx-2"
                onClick={() => {
                  setGrandTotal(maxCost);
                }}
                disabled={
                  rollNo.length !== 10 ||
                  branch === "" ||
                  year === 0 ||
                  semester === parseInt("") ||
                  searched
                }
              >
                <SearchOutlined fontSize="small" className="mr-2" />
                Search
              </button>
            )}
            {printTableExist && searched && (
              <button
                type="submit"
                className="green-button-filled"
                onClick={() => {
                  loading?.showLoading(true);

                  Axios.post(`api/cbt/paid/${rollNo}`, {
                    subjects: { subCodes, subNames } as ExamSemProps,
                    acYear: year,
                    sem: semester,
                    branch: branch,
                    username: sessionStorage.getItem("username"),
                    grandTotal: grandTotal,
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
            )}
          </div>
        </div>
      </form>
      {/*Generation of Exam Branch Copy*/}
      {searched && (
        <div
          className="bg-white rounded-sm p-4 w-full mt-5"
          style={{
            backgroundImage: generateForm ? `url(assets/LightLogo.png)` : "",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "60%",
          }}
        >
          <div>
            <FormSectionHeader copyType={"Exam Branch"} />
            <div className="grid grid-cols-9 my-10">
              <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                {year}
                {"-"}
                {semester}
                {" ("}
                {branch}
                {")"}
              </span>
            </div>
            <div className="grid grid-cols-6 my-10">
              <Autocomplete
                readOnly={generateForm || printTableExist}
                multiple
                onChange={(_e, val) => {
                  subs = [];
                  setSelectedSubjectNames(val);
                  val.forEach((value) => {
                    for (let i = 0; i < subNames.length; i++) {
                      if (value == subNames[i]) {
                        subs.push(subCodes[i]);
                      } else {
                        continue;
                      }
                    }
                  });
                  CalcTotalCost();
                  if (val.length === 0) {
                    setEmpty(true);
                  } else setEmpty(false);
                }}
                disableCloseOnSelect
                options={subNames}
                value={selectedSubjectNames}
                filterSelectedOptions
                renderInput={(val) => (
                  <CustTextField {...val} label="Subjects" />
                )}
                className="col-span-4 col-start-2"
              />
            </div>
            <div className="flex justify-around">
              <span className="lg:text-xl text-lg font-semibold">
                <h3>
                  {" "}
                  <br />
                  <>
                    Grand Total: {grandTotal} ({selectedSubjectNames.length}{" "}
                    Subjects)
                  </>
                </h3>
              </span>
            </div>
            <div className="flex justify-around">
              <span className="lg:text-xl text-lg font-semibold">
                <CustBarcode rollNo={rollNo} />
              </span>
            </div>
            {!generateForm && (
              <button
                className="blue-button ml-auto border-none flex items-center gap-2 no-print"
                onClick={() => {
                  setGenerateForm(true);
                }}
                disabled={empty}
              >
                <ListAltOutlined />
                Generate Form
              </button>
            )}
          </div>
          {/*Generate Form*/}
          {generateForm && (
            <>
              <Divider />
              <div>
                <FormSectionHeader copyType={"Student"} />
                <div className="grid grid-cols-9 my-10">
                  <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                    {year}
                    {"-"}
                    {semester}
                    {" ("}
                    {branch}
                    {")"}
                  </span>
                </div>
                <div className="grid grid-cols-6 my-10">
                  <Autocomplete
                    readOnly={generateForm}
                    multiple
                    onChange={(_e, val) => {
                      if (val.length === 0) {
                        setEmpty(true);
                      } else setEmpty(false);
                    }}
                    disableCloseOnSelect
                    options={subNames}
                    value={selectedSubjectNames}
                    filterSelectedOptions
                    renderInput={(val) => (
                      <CustTextField {...val} label="Subjects" />
                    )}
                    className="col-span-4 col-start-2"
                  />
                </div>
                <div className="flex justify-around">
                  <span className="lg:text-xl text-lg font-semibold">
                    <h3>
                      {" "}
                      <br />
                      <>
                        Grand Total: {grandTotal} ({selectedSubjectNames.length}{" "}
                        Subjects)
                      </>
                    </h3>
                  </span>
                </div>
                <div className="flex justify-around">
                  <span className="lg:text-xl text-lg font-semibold">
                    <CustBarcode rollNo={rollNo} />
                  </span>
                </div>
                <div className="flex justify-around my-10">
                  <span className="font-bold">
                    AFTER PAYING THE FEE IN ACCOUNTS SECTION, THE RECEIPT MUST
                    BE SUBMITTED IN THE EXAM BRANCH TO COMPLETE YOUR
                    REGISTRATION
                  </span>
                </div>
              </div>
              <Divider />
              <div>
                <FormSectionHeader copyType={"Accounts"} />
                <div className="grid grid-cols-9 my-10">
                  <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                    {year}
                    {"-"}
                    {semester}
                    {" ("}
                    {branch}
                    {")"}
                  </span>
                </div>
                <div className="grid grid-cols-6 my-10">
                  <Autocomplete
                    readOnly={generateForm}
                    multiple
                    onChange={(_e, val) => {
                      if (val.length === 0) {
                        setEmpty(true);
                      } else setEmpty(false);
                    }}
                    disableCloseOnSelect
                    options={subNames}
                    value={selectedSubjectNames}
                    filterSelectedOptions
                    renderInput={(val) => (
                      <CustTextField {...val} label="Subjects" />
                    )}
                    className="col-span-4 col-start-2"
                  />
                </div>
                <div className="flex justify-around">
                  <span className="lg:text-xl text-lg font-semibold">
                    <h3>
                      {" "}
                      <br />
                      <>
                        Grand Total: {grandTotal} ({selectedSubjectNames.length}{" "}
                        Subjects)
                      </>
                    </h3>
                  </span>
                </div>
                <div className="flex justify-around">
                  <span className="lg:text-xl text-lg font-semibold">
                    <CustBarcode rollNo={rollNo} />
                  </span>
                </div>
                <div className="flex gap-2 ml-auto justify-end">
                  <Print
                    rollNo={rollNo}
                    exam="cbt"
                    setStudentCopyGenerated={setGenerateForm}
                    printTable={printTableExist}
                    acYear={year}
                    sem={semester}
                    selectedSubjects={{ subCodes, subNames } as ExamSemProps}
                    branch={branch}
                    reset={reset}
                    grandTotal={grandTotal}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
