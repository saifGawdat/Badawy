export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardState {
  step: WizardStep;
  fullName: string;
  email: string;
  phone: string;
  procedureId: string | null;
  procedureTitle: string;
  locationId: string | null;
  locationName: string;
  notes: string;
  isSubmitting: boolean;
}

export type WizardAction =
  | { type: "SET_STEP"; payload: WizardStep }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "SET_FIELD"; field: keyof Omit<WizardState, "step" | "isSubmitting">; value: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "RESET" };

export const INITIAL_WIZARD_STATE: WizardState = {
  step: 1,
  fullName: "",
  email: "",
  phone: "",
  procedureId: null,
  procedureTitle: "",
  locationId: null,
  locationName: "",
  notes: "",
  isSubmitting: false,
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "GO_NEXT":
      return { ...state, step: Math.min(state.step + 1, 4) as WizardStep };
    case "GO_BACK":
      return { ...state, step: Math.max(state.step - 1, 1) as WizardStep };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "RESET":
      return { ...INITIAL_WIZARD_STATE };
    default:
      return state;
  }
}

export interface ServiceItem {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string;
}

export interface LocationOption {
  id: string;
  name: string;
  nameAr: string;
}
