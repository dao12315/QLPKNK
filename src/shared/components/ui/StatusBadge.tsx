import React from "react";
import { Badge } from "./Badge";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_COLOR,
  AppointmentStatus,
} from "@/src/types/appointment";
import {
  TREATMENT_STATUS_LABEL,
  TREATMENT_STATUS_COLOR,
  TreatmentStatus,
} from "@/src/types/treatment";
import {
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_COLOR,
  InvoiceStatus,
} from "@/src/types/invoice";

export const AppointmentStatusBadge: React.FC<{
  status: AppointmentStatus;
}> = ({ status }) => (
  <span
    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${APPOINTMENT_STATUS_COLOR[status]}`}
  >
    {APPOINTMENT_STATUS_LABEL[status]}
  </span>
);

export const TreatmentStatusBadge: React.FC<{ status: TreatmentStatus }> = ({
  status,
}) => (
  <span
    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${TREATMENT_STATUS_COLOR[status]}`}
  >
    {TREATMENT_STATUS_LABEL[status]}
  </span>
);

export const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({
  status,
}) => (
  <span
    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${INVOICE_STATUS_COLOR[status]}`}
  >
    {INVOICE_STATUS_LABEL[status]}
  </span>
);
