interface LoginResponseParams {
  goahead: boolean;
  userName?: string;
  error?: string;
}

export interface ExamSearchResponseProps {
  A: {
    subjCodes: string[];
    subjNames: string[];
  };
  B: {
    subjCodes: string[];
    subjNames: string[];
  };
  C: {
    subjCodes: string[];
    subjNames: string[];
  };
  D: {
    subjCodes: string[];
    subjNames: string[];
  };
  E: {
    subjCodes: string[];
    subjNames: string[];
  };
  F: {
    subjCodes: string[];
    subjNames: string[];
  };
  G: {
    subjCodes: string[];
    subjNames: string[];
  };
  H: {
    subjCodes: string[];
    subjNames: string[];
  };
}

export interface ExamSemProps {
  subjCodes: string[];
  subjNames: string[];
}
