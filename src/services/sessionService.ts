import axiosClient from "@/src/core/http/axiosClient";
import {
  TreatmentSessionDto,
  CreateTreatmentSessionDto,
} from "@/src/types/treatment";

export const sessionService = {
  getByTreatment: (treatmentId: string) =>
    axiosClient.get<TreatmentSessionDto[]>(
      `/treatments/${treatmentId}/sessions`,
    ),

  create: (data: CreateTreatmentSessionDto) =>
    axiosClient.post<TreatmentSessionDto>("/treatments/sessions", data),

  delete: (sessionId: string) =>
    axiosClient.delete(`/treatments/sessions/${sessionId}`),
};
