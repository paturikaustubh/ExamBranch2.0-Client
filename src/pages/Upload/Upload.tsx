import { MenuItem } from "@mui/material";
import Title from "../../components/Title";
import { useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import dayjs from "dayjs";
import { UploadOutlined } from "@mui/icons-material";
import Axios from "axios";

export default function Upload() {
    const [type, setType] = useState("results");
    const [loc, setLoc] = useState("");
    const [examYear, setExamYear] = useState(dayjs().year());
    const [examMonth, setExamMonth] = useState(dayjs().month() + 1);
    const [acYear, setAcYear] = useState(0);
    const [sem, setSem] = useState(0);
    const [exam, setExam] = useState("supple");

    const handletype = (e: React.ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value);
        setLoc("")
        setAcYear(0)
        setSem(0)
    };
    const handleyears = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAcYear(parseInt(e.target.value));
    };
    const handlesems = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSem(parseInt(e.target.value));
    };
    const handleexam = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExam(e.target.value);
    };

    const handleUpload = async () => {
        try {
            const response = await Axios.post('/api/upload/results', {
                loc: loc,
                tableName: 'cbtsubjects',
                ext: '.xlsx',
                acYear: acYear,
                sem: sem,
                exYear: examYear,
                branch: 'cse'
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    return (
        <>
            <Title title="Upload" />
            {/* Results... registered Entries... code Names... Written-Test*/}
            <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6 no-print">
                <CustTextField
                    select
                    label="Type"
                    onChange={handletype}
                    value={type}
                >
                    <MenuItem value="results">Results</MenuItem>
                    <MenuItem value="registeredEntries">Registered Entries</MenuItem>
                    <MenuItem value="codeNames">Code Names</MenuItem>
                    <MenuItem value="cbt">Written Test</MenuItem>
                </CustTextField>

                {/* type === Results || Written-Test */}
                {(type === "results" || type === "cbt") && (
                    <>

                        <div className="flex w-full col-span-2 row-start-2 gap-4">
                            <CustTextField
                                fullWidth
                                select
                                label="Year"
                                onChange={handleyears}
                                value={acYear}
                            >
                                
                                    <MenuItem disabled value={0}>Year</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                
                            </CustTextField>
                            <CustTextField
                                fullWidth
                                select
                                label="Semester"
                                onChange={handlesems}
                                value={sem}
                            >
                                
                                    <MenuItem disabled value={0}>Semester</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                
                            </CustTextField>
                        </div>
                        <div className="flex w-full col-span-2 row-start-3 gap-4">
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
                                }}
                                value={examMonth}
                            />

                        </div>
                    </>
                )
                }

                {/* type === Registered Entries */}
                {type === "registeredEntries" && (
                    <>
                        <div className="flex w-full col-span-1 row-start-2 gap-4">
                            <CustTextField
                                fullWidth
                                select
                                label="Exam"
                                onChange={handleexam}
                                value={exam}
                            >
                                    <MenuItem value={"supple"}>Supplementary</MenuItem>
                                    <MenuItem value={"reval"}>Revaluation</MenuItem>
                                    <MenuItem value={"cbt"}>Written-Test</MenuItem>
                            </CustTextField>
                        </div>
                    </>
                )
                }
                
                {type === "codeNames" && (
                    <>
                        <div className="text-red-600 text-l font-bold text-2xl flex w-full col-span-1 row-start-2 gap-4 whitespace-nowrap">
                            The file name MUST be <code>code-names.csv</code>
                        </div>
                    </>
                )}

            </div>

            {/* Folder loaction and button */}
            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6 no-print">
                <div className="flex flex-col lg:col-span-2 md:col-span-3 col-span-2 row-start-2 gap-3 items-center">
                    <div className="flex w-full gap-3 items-center">
                        <CustTextField
                            fullWidth
                            type="string"
                            label="Folder Location"
                            onChange={(e) => {
                                setLoc(e.target.value);
                            }}
                            value={loc}
                        />
                        <button
                            type="submit"
                            className="blue-button-filled h-fit flex items-center gap-2"
                            disabled={
                                (type === "results" || type === "cbt") && 
                                (acYear === 0 || examMonth === 0 || examYear === 0 || sem === 0 || loc.length === 0) ||
                                (type === "registeredEntries" && exam === "" || loc.length === 0) ||
                                (type === "codeNames" && loc.length === 0)
                            }
                            
                            onClick={handleUpload}
                        >
                            <UploadOutlined fontSize="small" />
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}