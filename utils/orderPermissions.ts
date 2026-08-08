import { ORDER_STATUS } from "@/constants/orderStatus";

export interface OrderPermissionTarget {
  id?: string;
  status?: string | null;
  [key: string]: any;
}

/**
 * VIEW: Always enabled
 */
export const canView = (_order?: OrderPermissionTarget | null): boolean => {
  return true;
};

/**
 * TRACK: Enabled when CONFIRMED, PROCESSING, PACKED, SHIPPED, DELIVERED
 * Disabled when PENDING, CANCELLED, RETURNED
 */
export const canTrack = (order?: OrderPermissionTarget | null): boolean => {
  if (!order || !order.status) return false;
  const status = order.status.toUpperCase();
  return [
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
  ].includes(status as any);
};

export const getTrackDisabledReason = (order?: OrderPermissionTarget | null): string => {
  if (!order || !order.status) return "Tracking status is unavailable.";
  const status = order.status.toUpperCase();
  if (status === ORDER_STATUS.PENDING) {
    return "Tracking is unavailable for Pending orders.";
  }
  return `Tracking is unavailable for ${status} orders.`;
};

/**
 * EDIT / UPDATE: Enabled when PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED
 * Disabled when DELIVERED, CANCELLED, RETURNED
 */
export const canEdit = (order?: OrderPermissionTarget | null): boolean => {
  if (!order || !order.status) return false;
  const status = order.status.toUpperCase();
  return [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
  ].includes(status as any);
};

export const getEditDisabledReason = (order?: OrderPermissionTarget | null): string => {
  if (!order || !order.status) return "Editing order is not permitted.";
  const status = order.status.toUpperCase();
  if (status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED) {
    return "Delivered or Cancelled orders cannot be edited.";
  }
  return `${status} orders cannot be edited.`;
};

/**
 * CANCEL: Enabled only when PENDING, CONFIRMED
 * Disabled when PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURNED
 */
export const canCancel = (order?: OrderPermissionTarget | null): boolean => {
  if (!order || !order.status) return false;
  const status = order.status.toUpperCase();
  return [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
  ].includes(status as any);
};

export const getCancelDisabledReason = (order?: OrderPermissionTarget | null): string => {
  if (!order || !order.status) return "Order cancellation is unavailable.";
  const status = order.status.toUpperCase();
  if (status === ORDER_STATUS.CANCELLED) {
    return "This order has already been cancelled.";
  }
  return "Only Pending or Confirmed orders can be cancelled.";
};

/**
 * Helper to check if an order is delivered
 */
export const isDelivered = (order?: OrderPermissionTarget | null): boolean => {
  if (!order || !order.status) return false;
  return order.status.toUpperCase() === ORDER_STATUS.DELIVERED;
};
