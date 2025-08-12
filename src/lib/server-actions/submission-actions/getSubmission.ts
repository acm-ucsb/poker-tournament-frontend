"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { BACKEND_ENGINE_BASE_URL } from "@/lib/constants";
import axios from "axios";
import { getLanguageFromExtension } from "@/lib/utils";

type SubmissionData = {
  code: string;
  language: string;
};

export async function getSubmission(): Promise<
  ServerActionResponse<SubmissionData>
> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user || !session) {
      throw new ServerActionError({
        message: "You must be logged in to submit code.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    console.log(session.access_token);

    const res = await axios.get(`${BACKEND_ENGINE_BASE_URL}/submission`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      validateStatus: function (status) {
        return true; // Don't throw errors for any status code, just handle them manually
      },
    });

    if (
      res.status !== 200 ||
      !res.data ||
      !res.data.content ||
      !res.data.filename
    ) {
      throw new ServerActionError({
        message: "Failed to fetch submission.",
        code: "INTERNAL_SERVER_ERROR",
        status: res.status,
      });
    }

    const code = res.data.content;
    const language = getLanguageFromExtension({
      extension: res.data.filename.split(".").pop() || "",
    });

    return {
      success: true,
      data: {
        code,
        language,
      },
      status: 200,
      error: null,
    };

    // return {
    //   success: false,
    //   data: null,
    //   status: 400,
    //   error: {
    //     code: "FILE_NOT_SAVED",
    //     message: "There was an error submitting your code.",
    //     details: "Please try signing in again or try later.",
    //   },
    // };
  } catch (error) {
    console.log(error);
    if (error instanceof ServerActionError) {
      return {
        success: false,
        status: error.status,
        error: {
          code: error.code,
          message: error.message,
        },
        data: null,
      };
    }

    return {
      success: false,
      status: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        details: error,
      },
      data: null,
    };
  }
}
