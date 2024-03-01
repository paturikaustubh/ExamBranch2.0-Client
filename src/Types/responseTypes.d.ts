interface LoginResponseParams {
  goahead: boolean;
  userName?: string;
  error?: string;
}

export interface ExamSearchResponseProps {
  A: {
    subCodes: string[];
    subNames: string[];
  };
  B: {
    subCodes: string[];
    subNames: string[];
  };
  C: {
    subCodes: string[];
    subNames: string[];
  };
  D: {
    subCodes: string[];
    subNames: string[];
  };
  E: {
    subCodes: string[];
    subNames: string[];
  };
  F: {
    subCodes: string[];
    subNames: string[];
  };
  G: {
    subCodes: string[];
    subNames: string[];
  };
  H: {
    subCodes: string[];
    subNames: string[];
  };
}

export interface ExamSemProps {
  subCodes: string[];
  subNames: string[];
}
