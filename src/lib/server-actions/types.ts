export type ServerActionResponse<T> = {
  success: boolean;
  status?: number; // Optional status code for errors
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
};

// New error class for better error handling
type Code =
  | "TEAM_NOT_FOUND"
  | "ALREADY_IN_TEAM"
  | "USER_NOT_AUTHORIZED"
  | "UNKNOWN_ERROR";

type ConstructorParams = {
  message: string;
  code: Code;
  status: number;
  cause?: string;
};

export class ServerActionError extends Error {
  code: Code;

  status: number;

  constructor({ message, code, cause, status }: ConstructorParams) {
    super(message, { cause });
    this.name = "ServerActionError";
    this.code = code;
    this.status = status;
  }
}
