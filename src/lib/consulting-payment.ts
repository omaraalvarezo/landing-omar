import {
  getConsultingOrder,
  getConsultingOrderById,
  hasConsultingOrderAccess,
  recordConsultingTransaction,
  type ConsultingOrder,
} from './consulting-orders';
import { fetchTransaction, isApprovedConsultingPayment } from './wompi-consulting';

export type ConsultingPaymentResolution =
  | {
      kind: 'FOUND';
      status: string;
      approved: boolean;
      order: ConsultingOrder | null;
      legacy: boolean;
    }
  | { kind: 'NOT_FOUND'; status: 'NOT_FOUND'; approved: false }
  | { kind: 'UNAUTHORIZED'; status: 'INVALID'; approved: false };

function publicStatus(order: ConsultingOrder): string {
  return order.status === 'CREATED' ? 'PENDING' : order.status;
}

function storedResolution(order: ConsultingOrder): ConsultingPaymentResolution {
  return {
    kind: 'FOUND',
    status: publicStatus(order),
    approved: order.status === 'APPROVED',
    order,
    legacy: false,
  };
}

export async function resolveConsultingOrder(
  orderId: string,
  accessToken: string,
  returnedTransactionId = '',
): Promise<ConsultingPaymentResolution> {
  const order = await getConsultingOrderById(orderId);
  if (!order) return { kind: 'NOT_FOUND', status: 'NOT_FOUND', approved: false };
  if (!(await hasConsultingOrderAccess(order, accessToken))) {
    return { kind: 'UNAUTHORIZED', status: 'INVALID', approved: false };
  }

  const transactionId = returnedTransactionId || order.transactionId || '';
  if (!transactionId) return storedResolution(order);

  try {
    const transaction = await fetchTransaction(transactionId);
    if (!transaction) return storedResolution(order);
    if (transaction.reference !== order.reference) {
      return { kind: 'UNAUTHORIZED', status: 'INVALID', approved: false };
    }

    const recorded = await recordConsultingTransaction(transaction);
    return recorded
      ? storedResolution(recorded.order)
      : { kind: 'NOT_FOUND', status: 'NOT_FOUND', approved: false };
  } catch (error) {
    console.warn('[consultoria] se usó el estado persistido mientras Wompi no respondía', error);
    return storedResolution(order);
  }
}

export async function resolveConsultingPayment(
  transactionId: string,
  accessToken = '',
): Promise<ConsultingPaymentResolution> {
  const transaction = await fetchTransaction(transactionId);

  if (!transaction) return { kind: 'NOT_FOUND', status: 'NOT_FOUND', approved: false };

  const storedOrder = await getConsultingOrder(transaction.reference);
  if (!storedOrder) {
    return {
      kind: 'FOUND',
      status: transaction.status,
      approved: isApprovedConsultingPayment(transaction),
      order: null,
      legacy: true,
    };
  }

  if (!(await hasConsultingOrderAccess(storedOrder, accessToken))) {
    return { kind: 'UNAUTHORIZED', status: 'INVALID', approved: false };
  }

  const recorded = await recordConsultingTransaction(transaction);
  if (!recorded) return { kind: 'NOT_FOUND', status: 'NOT_FOUND', approved: false };

  return storedResolution(recorded.order);
}
