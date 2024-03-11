// React Elements
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Axios from "axios";
// Material UI Components
import { Autocomplete, IconButton, MenuItem } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { ListAltOutlined, SearchOutlined } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
// Custom Components
import Title from "../../components/Title";
import { CustTextField } from "../../components/Custom/CustTextField";
import { CustBarcode } from "../../components/Custom/Barcode";

export default function CBT() {
    // States
    const [examYear, setExamYear] = useState(dayjs().year());
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [searched, setSearched] = useState(false);
    const [currDateTime, setCurrDateTime] = useState('');
    const [generateForm, setGenerateForm] = useState(false);
    const [subCodes, setSubCodes] = useState([]);
    const [subNames, setSubNames] = useState([]);
    const [mapper, setMapper] = useState({});
    const [printTableExist, setPrintTableExist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [baseCosts, setBaseCosts] = useState("");
    const [additionalCost, setAdditionalCost] = useState("");
    const [maxCost, setMaxCost] = useState("");
    const [branches, setBranches] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    // Effects
    useEffect(() => {
        setInterval(() => {
          setCurrDateTime(dayjs().format("DD MMM, YYYY (hh:mm A)"));
        }, 500);
      }, []);
    useEffect(() => {
        Axios.get(`api/cbt/branchs`)
        .then((res) => {
            setBranches(res.data.branch);
            setYears((y) => (
                res.data.acYear.map((acYear: string) => (
                    <MenuItem value={acYear} key={acYear}>
                        {acYear}
                    </MenuItem>
                ))
            ));
            setSemesters((s) => (
                res.data.sem.map((sem: string) => (
                    <MenuItem value={sem} key={sem}>
                        {sem}
                    </MenuItem>
                ))
            ));
        });
        Axios.get(`api/costs?module=cbt`)
        .then((res) => {
            setBaseCosts(res.data["cbc"]);
            setAdditionalCost(res.data["cac"]);
            setMaxCost(res.data["cfc"]);
        });
    }, [false]);
    console.log(branches);
    console.log(years);
    // JSON
    const defaultCosts = [
        {
            "label": "Base Cost",
            "value": 200
        },
        {
            "label": "Additional Cost",
            "value": 100
        },
        {
            "label": "Max Cost",
            "value": 500
        }
    ]
    let subjectCodes = [];
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
    const calc = () => {
        if (subjectCodes.length >= 0) {
          if (subjectCodes.length === 1) {
            return (
              <>
                <h3>
                  {" "}
                  <>
                    Grand Total: {baseCosts} ({subjectCodes.length} Subject)
                  </>
                </h3>
              </>
            );
          } else if (subjectCodes.length >= 5) {
            return (
              <>
                <h3>
                  {" "}
                  <br />
                  <>
                    Grand Total: {maxCost} ({subjectCodes.length} Subjects)
                  </>
                </h3>
              </>
            );
          } else {
            if (!isNaN(parseInt(baseCosts)) && !isNaN(parseInt(additionalCost))) {
              let b = parseInt(baseCosts);
              let ad = parseInt(additionalCost);
              return (
                <>
                  <h3>
                    {" "}
                    <br />
                    <>
                      Grand Total: {b + ad * (subjectCodes.length - 1)} ({subjectCodes.length}{" "}
                      Subjects)
                    </>
                  </h3>
                </>
              );
            }
            let b = parseInt(baseCosts);
            let ad = parseInt(additionalCost);
            return (
              <>
                <h3>
                  {" "}
                  <br />
                  <>
                    Grand Total: {b + ad * (subjectCodes.length)} ({subjectCodes.length}{" "}
                    Subjects)
                  </>
                </h3>
              </>
            );
          }
        }
    };
    return (
        <div>
            <div className="flex justify-center">
                <Title title="CBT" />
                <IconButton>
                    <HelpIcon
                    color = "primary"
                    />
                </IconButton>
            </div>
            <div className="grid grid-cols-6 gap-4">
                {
                    defaultCosts.map((cost) => (
                        <CustTextField
                        label = {cost.label}
                        className="col-span-1"
                        value = {cost.value}
                        disabled
                        />
                    ))
                }
            </div>
            <form
            onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                Axios.post(`api/cbt/search`,{
                    acYear: examYear,
                    sem: semester,
                    reg: year,
                    branch: branch,
                    rollNo: rollNo
                }).then((res) => {
                    if(res.data.out.length > 0) {
                        setSubCodes(res.data["subCodes"]);
                        setSubNames(res.data["subNames"]);
                        setMapper(res.data["mapper"]);
                        setPrintTableExist(res.data["printTableExist"]);
                    }
                })
            }}
            >
                <div className="grid grid-cols-6 gap-4 py-8">
                    <CustTextField
                    type="number"
                    label="Exam Year"
                    onChange={({target: {value}}) => {
                        setExamYear(parseInt(value) > 0 ? parseInt(value) : dayjs().year() - 1);
                    }}
                    InputProps={{
                        inputProps: { min: dayjs().year() - 1, max: dayjs().year() },
                    }}
                    value={examYear}
                    disabled={searched}
                    />
                    <CustTextField 
                    select
                    label="Branch"
                    className="col-span-1"
                    onChange={({ target: { value } }) => {
                        setBranch(value);
                    }}
                    disabled={searched}
                    >
                      {/* {
                        branches.map((branch) => (
                            <MenuItem value={branch} key={branch}>
                                {branch}
                            </MenuItem>
                        ))
                      }   */}
                      {
                        branches
                      }
                    </CustTextField>
                </div>
                <div className="grid grid-cols-6 gap-4">
                    <CustTextField 
                    select
                    label="Year"
                    className="col-span-1"
                    onChange={({ target: { value } }) => {
                        setYear(value);
                    }}
                    disabled={searched}
                    >
                        {
                            years.map((year) => (
                                <MenuItem value={year} key={year}>
                                    {year}
                                </MenuItem>
                            ))
                        }
                    </CustTextField>
                    <CustTextField 
                    select
                    label="Semester"
                    className="col-span-1"
                    onChange={({ target: { value } }) => {
                        setSemester(value);
                    }}
                    disabled={searched}
                    >
                        {
                            semesters.map((semester) => (
                                <MenuItem value={semester} key={semester}>
                                    {semester}
                                </MenuItem>
                            ))
                        }
                    </CustTextField>
                </div>
                <div className="grid grid-cols-6 gap-4 py-8">
                    <CustTextField 
                    label="Roll Number"
                    className="col-span-2"
                    inputProps={{maxLength: 10}}
                    onChange={({ target: { value } }) => {
                        setRollNo(value.toUpperCase());
                    }}
                    disabled={searched}
                    />
                    <button
                    type="submit"
                    className="blue-button-filled col-span-1 mr-auto h-fit flex items-center gap-2 my-auto"
                    disabled={rollNo.length !== 10 || branch === '' || year === '' || semester === '' || searched}
                    onClick={() => {
                        setSearched(true);
                    }}
                    >
                    <SearchOutlined fontSize="small" />
                    Search
                    </button>
                </div>
            </form>
            {/*Generation of Exam Branch Copy*/}
            {searched && (
                <div className="bg-white rounded-sm p-4 w-full mt-5">
                    <div>
                        <FormSectionHeader copyType={"Exam Branch"}/>
                        <div className="grid grid-cols-9 my-10">
                            <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                                {year}{'-'}{semester}{' ('}{branch}{')'}
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
                            defaultValue={[...subNames]}
                            filterSelectedOptions
                            renderInput={(val) => <CustTextField {...val} label="Subjects" />}
                            className="col-span-4 col-start-2"
                            />
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4">
                                {calc()}
                            </span>
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4 my-4">
                                <CustBarcode rollNo = {rollNo}/>
                            </span>
                        </div>
                        {!generateForm && (
                            <button 
                            className="blue-button ml-auto border-none flex items-center gap-2 no-print"
                            onClick={() => {
                                setGenerateForm(true);
                            }}
                            disabled={!empty}
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
                        <FormSectionHeader copyType={"Student"}/>
                        <div className="grid grid-cols-9 my-10">
                            <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                                {year}{'-'}{semester}{' ('}{branch}{')'}
                            </span>
                        </div>
                        <div className="grid grid-cols-6 my-10">
                            <CustTextField 
                            label="Subjects"
                            className="col-span-4 col-start-2"
                            />
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4">
                                {calc()}
                            </span>
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4 my-4">
                                <CustBarcode rollNo = {rollNo}/>
                            </span>
                        </div>
                        <div className="flex justify-around my-10">
                            <span className="font-bold">
                                AFTER PAYING THE FEE IN ACCOUNTS SECTION, THE RECEIPT MUST BE SUBMITTED IN THE EXAM BRANCH TO COMPLETE YOUR REGISTRATION
                            </span>
                        </div>               
                    </div>
                    <Divider /> 
                    <div>
                        <FormSectionHeader copyType={"Accounts"}/>
                        <div className="grid grid-cols-9 my-10">
                            <span className="lg:text-xl text-lg font-semibold col-span-1 col-start-5">
                                {year}{'-'}{semester}{' ('}{branch}{')'}
                            </span>
                        </div>
                        <div className="grid grid-cols-6 my-10">
                            <CustTextField 
                            label="Subjects"
                            className="col-span-4 col-start-2"
                            />
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4">
                                {calc()}
                            </span>
                        </div>
                        <div className="grid grid-cols-8">
                            <span className="lg:text-xl text-lg font-semibold col-span-2 col-start-4 my-4">
                                <CustBarcode rollNo = {rollNo}/>
                            </span>
                        </div>
                        <div className="flex gap-2 ml-auto justify-end">
                            <Button 
                            variant="outlined"
                            onClick={() => {
                                setGenerateForm(false);
                            }}
                            >
                                <EditIcon />
                                Edit Values
                            </Button>
                            <Button variant="contained">
                                <PrintIcon />
                                Print
                            </Button>
                        </div>              
                    </div>
                    </>
                    )}
                </div>
            )}
        </div>
    )
}