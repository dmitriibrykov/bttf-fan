export enum STATUS {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export type ResponseSuccessfulBase = {
  status: STATUS.SUCCESSFUL;
};

export type ResponseFailed = {
  status: STATUS.FAILED;
  error: string;
};
