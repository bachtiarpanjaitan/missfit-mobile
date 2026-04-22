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
  async (data: { packageId: string; method: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/initiate', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const initiateFreePayment = createAsyncThunk(
  'payment/initiateFree',
  async (data: { packageId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/initiate-free', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/verify', { transactionId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'payment/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'payment/cancel',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/cancel', { transactionId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
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
      .addCase(initiateFreePayment.fulfilled, (state, action) => {
        state.loading = false;
        console.log('action payload', action.payload);
        state.currentPayment = action.payload;
        state.successMessage = action.payload.message;
      })
      .addCase(initiateFreePayment.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to process free payment';
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
