import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface RankingUser {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  points: number;
  quizzesTaken: number;
}

export interface RankingState {
  globalRankings: RankingUser[];
  packageRankings: { [packageId: string]: RankingUser[] };
  userRank: RankingUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: RankingState = {
  globalRankings: [],
  packageRankings: {},
  userRank: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchGlobalRankings = createAsyncThunk(
  'ranking/fetchGlobal',
  async (limit: number = 10) => {
    const response = await api.get(`/rankings/global?limit=${limit}`);
    return response.data.data;
  }
);

export const fetchPackageRankings = createAsyncThunk(
  'ranking/fetchPackage',
  async (packageId: string) => {
    const response = await api.get(`/rankings/package/${packageId}`);
    return { packageId, rankings: response.data.data };
  }
);

export const fetchUserRank = createAsyncThunk(
  'ranking/fetchUserRank',
  async () => {
    const response = await api.get('/rankings/my-rank');
    return response.data.data;
  }
);

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalRankings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.globalRankings = action.payload;
      })
      .addCase(fetchGlobalRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rankings';
      })
      .addCase(fetchPackageRankings.fulfilled, (state, action) => {
        state.packageRankings[action.payload.packageId] =
          action.payload.rankings;
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.userRank = action.payload;
      });
  },
});

export const { clearError } = rankingSlice.actions;
export default rankingSlice.reducer;
