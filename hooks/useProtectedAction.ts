'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import Swal from 'sweetalert2';

export type ProtectedActionType = 'buy_now' | 'add_to_cart' | 'wishlist';

export interface PendingActionPayload {
  action: ProtectedActionType;
  productId: string;
  quantity?: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
  attributes?: Record<string, string>;
  returnUrl: string;
  timestamp: number;
}

export const PENDING_ACTION_KEY = 'growthzen_pending_action';
export const BUY_NOW_KEY = 'growthzen_buy_now_item';

export interface BuyNowSessionItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  selectedSize?: string | null;
  productCode?: string;
  slug?: string;
}

export function saveBuyNowItem(item: BuyNowSessionItem): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
  } catch {
    // sessionStorage disabled or full
  }
}

export function getBuyNowItem(): BuyNowSessionItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearBuyNowItem(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(BUY_NOW_KEY);
  } catch {
    // ignore
  }
}

/**
 * Validates redirect URLs to ensure they are internal relative paths.
 * Prevents Open Redirect vulnerabilities.
 */
export function sanitizeRedirectUrl(url: string | null | undefined, fallback: string = '/'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();
  // Ensure it starts with '/' and does not start with '//', 'http:', 'https:', or 'javascript:'
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.toLowerCase().startsWith('/\\') &&
    !trimmed.toLowerCase().includes('javascript:')
  ) {
    return trimmed;
  }

  return fallback;
}

/**
 * Reads pending return URL from sessionStorage if present.
 */
export function getPendingRedirectUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PENDING_ACTION_KEY);
    if (!raw) return null;
    const payload: PendingActionPayload = JSON.parse(raw);
    if (payload.returnUrl && Date.now() - payload.timestamp < 30 * 60 * 1000) {
      return sanitizeRedirectUrl(payload.returnUrl);
    }
  } catch {
    return null;
  }
  return null;
}

export function useProtectedAction() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  /**
   * Executes an action if logged in, or saves state and redirects to login if guest.
   */
  const executeProtectedAction = useCallback(
    async (
      options: {
        action: ProtectedActionType;
        productId: string;
        quantity?: number;
        selectedSize?: string | null;
        selectedColor?: string | null;
        attributes?: Record<string, string>;
        returnUrl?: string;
      },
      onAuthenticated: () => void | Promise<void>
    ) => {
      if (isAuthenticated) {
        await onAuthenticated();
        return;
      }

      // Resolve current path + query as returnUrl
      const currentUrl =
        options.returnUrl ||
          `${pathname}${searchParams.toString() ? ` ?${ searchParams.toString()
    }` : ''}`;
  const sanitizedReturnUrl = sanitizeRedirectUrl(currentUrl);

  const payload: PendingActionPayload = {
    action: options.action,
    productId: options.productId,
    quantity: options.quantity ?? 1,
    selectedSize: options.selectedSize ?? null,
    selectedColor: options.selectedColor ?? null,
    attributes: options.attributes,
    returnUrl: sanitizedReturnUrl,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(payload));
  } catch {
    // Fallback if sessionStorage is disabled
  }

  Swal.fire({
    icon: 'info',
    title: 'Sign In Required',
    text: 'Please sign in to continue your purchase.',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const loginRedirect = `/auth/login?redirect=${encodeURIComponent(
        sanitizedReturnUrl
      )}&action=${options.action}`;
  router.push(loginRedirect);
},
[isAuthenticated, pathname, searchParams, router]
  );

/**
 * Effect hook to restore and execute pending actions upon returning post-login.
 */
const usePendingActionEffect = (
  currentProductId: string,
  onRestoreAction: (payload: PendingActionPayload) => void | Promise<void>
) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const raw = sessionStorage.getItem(PENDING_ACTION_KEY);
      if (!raw) return;

      const payload: PendingActionPayload = JSON.parse(raw);

      // Check payload validity (within 30 minutes and matching current product)
      const isFresh = Date.now() - payload.timestamp < 30 * 60 * 1000;
      if (isFresh && payload.productId === currentProductId) {
        // Clear payload first to prevent execution loops
        sessionStorage.removeItem(PENDING_ACTION_KEY);

        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Continuing your purchase automatically...',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
        });

        onRestoreAction(payload);
      }
    } catch {
      sessionStorage.removeItem(PENDING_ACTION_KEY);
    }
  }, [isAuthenticated, currentProductId, onRestoreAction]);
};

return {
  isAuthenticated,
  executeProtectedAction,
  usePendingActionEffect,
};
}

export default useProtectedAction;

