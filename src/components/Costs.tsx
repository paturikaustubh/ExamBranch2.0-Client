import { useLocation } from "react-router-dom";
import { formatCost } from "../misc/CostFormater";
import { CustTextField } from "./Custom/CustTextField";
import { useLayoutEffect } from "react";
import Axios from "axios";

export interface CostsProps {
    cfc: number;
    cac: number;
    cbc: number;
    sbc: number;
    sac: number;
    sfc: number;
}

export interface FineProps{
    A: number,
    B: number,
    C: number,
    D: number,
    E: number,
    F: number,
    G: number,
    H: number
}

function CostField({ cost, label }: { cost: number, label: string }) {
    return (
        <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <CustTextField
                disabled
                fullWidth
                value={formatCost(cost)}
                label={label}
                className="bg-white"
                inputProps={{ style: { textAlign: "right" } }}
            />
        </div>
    );
}

export default function Costs({
    costs,setCosts,setFine
} : {
    costs: CostsProps,
    setCosts : React.Dispatch<React.SetStateAction<CostsProps>>,
    fine : FineProps
    setFine :  React.Dispatch<React.SetStateAction<FineProps>>
}) {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        Axios.get(
            `api/cost/costs?module=${pathname === "/written-test" ? "cbt" : "supple"}`
        )
            .then(({ data }) => {
                setCosts(data.costs);
                setFine(data.fines);
            });
    }, [pathname]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CostField cost={costs?.sbc ?? costs?.cbc} label={"Base Cost"} />
            <CostField cost={costs?.sac ?? costs?.cac} label={"Additional Cost"} />
            <CostField cost={costs?.sfc ?? costs?.cfc} label={"Max Cost"} />
        </div>
    );
}
