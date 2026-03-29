import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Payment {
  id: string;
  packageId: string;
  userId: string;
  amount: number;
  method: 'dana' | 'gopay' | 'ovo' | 'linkaja' | 'card';
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId: string;
  createdAt: string;
}

export interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async (data: { packageId: string; method: string }) => {
    const response = await api.post('/payments/initiate', data);
    return response.data.data;
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (transactionId: string) => {
    const response = await api.post('/payments/verify', { transactionId });
    return response.data.data;
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchHistory',
  async () => {
    const response = await api.get('/payments/history');
    return response.data.data;
  }
);

export const cancelPayment = createAsyncThunk(
  'payment/cancel',
  async (transactionId: string) => {
    const response = await api.post('/payments/cancel', { transactionId });
    return response.data.data;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    resetPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initiate payment';
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.successMessage = 'Payment verified successfully!';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Payment verification failed';
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        state.successMessage = 'Payment cancelled successfully';
      });
  },
});

export const { clearError, clearSuccess, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
