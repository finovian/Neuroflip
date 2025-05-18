import { ExternalToast } from "sonner";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface HistoryEntry {
  date: string;
  known: number;
  unknown: number;
}

export interface FlashcardStats {
  known: number;
  unknown: number;
  streak: number;
  lastReviewDate: string | null;
  history: HistoryEntry[];
}

export type ToastProps = ExternalToast & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
};

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type ActionType = {
  ADD_TOAST: "ADD_TOAST";
  UPDATE_TOAST: "UPDATE_TOAST";
  DISMISS_TOAST: "DISMISS_TOAST";
  REMOVE_TOAST: "REMOVE_TOAST";
};

export interface State {
  toasts: ToasterToast[];
}

export type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };
export interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    name: string;
    value: number;
  };
}
