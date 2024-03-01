import Barcode from "react-barcode";

export function CustBarcode({ rollNo }: { rollNo: string }) {
  return (
    <div className="mx-auto">
      <Barcode value={rollNo} width={2} height={40} displayValue={false} />
    </div>
  );
}
